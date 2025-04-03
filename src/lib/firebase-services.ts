import { db } from './firebase';
import { ref, set, push, get, onValue, update, remove, off } from 'firebase/database';
import { generateRoomCode } from './utils';

// Types
export interface Room {
  id: string;
  name: string;
  code: string;
  hostId: string;
  traitorCount: number;
  heroCount: number;
  players: Player[];
  gameState: GameState;
  createdAt: number;
}

export interface Player {
  id: string;
  name: string;
  avatarId?: number;
  role?: string;
  isHost: boolean;
  isReady: boolean;
  isAlive: boolean;
}

export interface Message {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
}

export interface GameState {
  status: 'waiting' | 'playing' | 'finished';
  phase: 'day' | 'night' | 'voting' | 'task' | null;
  tasks: Task[];
  completedTasks: number;
  sabotages: number;
  currentRound: number;
  totalRounds: number;
  timeLeft?: number;
  winner?: 'heroes' | 'traitors' | null;
}

export interface Task {
  id: string;
  type: string;
  status: 'pending' | 'completed' | 'sabotaged';
  assignedTo?: string;
}

// Room Services
export const createRoom = async (data: {
  name: string;
  hostId: string;
  traitorCount: number;
  heroCount: number;
  avatarId?: number;
}): Promise<{ roomId: string; code: string }> => {
  try {
    const roomCode = generateRoomCode();
    const hostName = "Host"; // Get from user profile or parameter
    
    // Create a new room reference
    const roomsRef = ref(db, 'rooms');
    const newRoomRef = push(roomsRef);
    const roomId = newRoomRef.key as string;
    
    // Initial player (host)
    const host: Player = {
      id: data.hostId,
      name: hostName,
      avatarId: data.avatarId,
      isHost: true,
      isReady: true,
      isAlive: true
    };
    
    // Initial room data
    const room: Room = {
      id: roomId,
      name: data.name,
      code: roomCode,
      hostId: data.hostId,
      traitorCount: data.traitorCount,
      heroCount: data.heroCount,
      players: [host],
      gameState: {
        status: 'waiting',
        phase: null,
        tasks: [],
        completedTasks: 0,
        sabotages: 0,
        currentRound: 0,
        totalRounds: 5
      },
      createdAt: Date.now()
    };
    
    console.log("Creating room with data:", room);
    
    // Write room data to database
    await set(newRoomRef, room);
    
    // Also store a reference by room code for easier lookup
    const roomsByCodeRef = ref(db, `roomsByCode/${roomCode}`);
    await set(roomsByCodeRef, roomId);
    
    return { roomId, code: roomCode };
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error("Failed to create room");
  }
};

export const joinRoom = async (data: {
  code: string;
  userId: string;
  avatarId?: number;
}): Promise<boolean> => {
  try {
    // Find room by code
    const roomsByCodeRef = ref(db, `roomsByCode/${data.code}`);
    const roomIdSnapshot = await get(roomsByCodeRef);
    
    if (!roomIdSnapshot.exists()) {
      throw new Error("Room not found");
    }
    
    const roomId = roomIdSnapshot.val();
    const roomRef = ref(db, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);
    
    if (!roomSnapshot.exists()) {
      throw new Error("Room not found");
    }
    
    const room = roomSnapshot.val() as Room;
    
    // Check if player is already in the room
    const existingPlayer = room.players.find(p => p.id === data.userId);
    if (existingPlayer) {
      return true; // Player already in room
    }
    
    // Check if the room is full (max 8 players)
    if (room.players.length >= 8) {
      throw new Error("Room is full");
    }
    
    // Check if game has already started
    if (room.gameState.status === 'playing') {
      throw new Error("Game has already started");
    }
    
    // Check if avatar is already taken
    if (data.avatarId !== undefined) {
      const isAvatarTaken = room.players.some(p => p.avatarId === data.avatarId);
      if (isAvatarTaken) {
        // Assign random avatar
        data.avatarId = Math.floor(Math.random() * 12) + 1;
      }
    }
    
    // Add player to room
    const newPlayer: Player = {
      id: data.userId,
      name: "Player", // Get from user profile or parameter
      avatarId: data.avatarId,
      isHost: false,
      isReady: false,
      isAlive: true
    };
    
    const players = [...room.players, newPlayer];
    
    // Update the room in the database
    await update(roomRef, { players });
    
    return true;
  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
};

// Find room by code
export const findRoomByCode = async (code: string): Promise<Room | null> => {
  try {
    // First look up the roomId from the code
    const roomsByCodeRef = ref(db, `roomsByCode/${code}`);
    const roomIdSnapshot = await get(roomsByCodeRef);
    
    if (!roomIdSnapshot.exists()) {
      return null;
    }
    
    const roomId = roomIdSnapshot.val();
    const roomRef = ref(db, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);
    
    if (!roomSnapshot.exists()) {
      return null;
    }
    
    const room = roomSnapshot.val() as Room;
    return room;
  } catch (error) {
    console.error("Error finding room:", error);
    return null;
  }
};

// Subscribe to room changes
export const subscribeToRoom = (roomCode: string, callback: (room: Room) => void) => {
  // First, get the roomId from the code
  const roomsByCodeRef = ref(db, `roomsByCode/${roomCode}`);
  
  // One-time listener to get the roomId
  get(roomsByCodeRef).then((snapshot) => {
    if (!snapshot.exists()) {
      console.error(`Room with code ${roomCode} not found`);
      return;
    }
    
    const roomId = snapshot.val();
    const roomRef = ref(db, `rooms/${roomId}`);
    
    // Subscribe to room changes
    const roomListener = onValue(roomRef, (roomSnapshot) => {
      if (roomSnapshot.exists()) {
        const room = roomSnapshot.val() as Room;
        callback(room);
      } else {
        console.error(`Room with ID ${roomId} no longer exists`);
      }
    });
    
    // Return unsubscribe function
    return () => off(roomRef, 'value', roomListener);
  }).catch(error => {
    console.error("Error setting up room subscription:", error);
  });
  
  // Return a dummy unsubscribe function
  return () => {};
};

// Chat Services
export const sendMessage = async (roomId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
  try {
    const chatRef = ref(db, `chats/${roomId}`);
    const newMessageRef = push(chatRef);
    
    const newMessage: Message = {
      id: newMessageRef.key as string,
      playerId: message.playerId,
      playerName: message.playerName,
      content: message.content,
      timestamp: Date.now()
    };
    
    await set(newMessageRef, newMessage);
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Subscribe to chat messages
export const subscribeToChat = (roomId: string, callback: (messages: Message[]) => void) => {
  const chatRef = ref(db, `chats/${roomId}`);
  
  const listener = onValue(chatRef, (snapshot) => {
    const messages: Message[] = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const id in data) {
        messages.push(data[id]);
      }
      // Sort by timestamp
      messages.sort((a, b) => a.timestamp - b.timestamp);
    }
    callback(messages);
  });
  
  // Return unsubscribe function
  return () => off(chatRef, 'value', listener);
};

// Game Services
export const startGame = async (roomId: string) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);
    
    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }
    
    const room = snapshot.val() as Room;
    
    // Assign roles to players
    const players = assignRoles(room.players, room.traitorCount, room.heroCount);
    
    // Create initial tasks
    const tasks = generateTasks();
    
    // Update game state
    const updatedGameState: GameState = {
      ...room.gameState,
      status: 'playing',
      phase: 'day',
      tasks,
      currentRound: 1,
      completedTasks: 0,
      sabotages: 0,
      timeLeft: 300, // 5 minutes in seconds
    };
    
    await update(roomRef, {
      players,
      gameState: updatedGameState
    });
    
    return true;
  } catch (error) {
    console.error("Error starting game:", error);
    throw error;
  }
};

// Player Actions
export const toggleReady = async (roomId: string, playerId: string) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);
    
    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }
    
    const room = snapshot.val() as Room;
    const players = [...room.players];
    const playerIndex = players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      throw new Error("Player not found in room");
    }
    
    // Toggle ready status
    players[playerIndex].isReady = !players[playerIndex].isReady;
    
    await update(roomRef, { players });
    return players[playerIndex].isReady;
  } catch (error) {
    console.error("Error toggling ready status:", error);
    throw error;
  }
};

// Helper functions
const assignRoles = (players: Player[], traitorCount: number, heroCount: number): Player[] => {
  // Shuffle players
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  
  // Define roles
  const traitorRoles = ['infiltrator', 'double-agent'];
  const heroRoles = ['master-thief', 'hacker'];
  const neutralRole = 'civilian';
  
  const assignedPlayers = shuffledPlayers.map((player, index) => {
    let role;
    if (index < traitorCount) {
      // Assign traitor role
      role = traitorRoles[index % traitorRoles.length];
    } else if (index < traitorCount + heroCount) {
      // Assign hero role
      role = heroRoles[(index - traitorCount) % heroRoles.length];
    } else {
      // Assign civilian role
      role = neutralRole;
    }
    
    return {
      ...player,
      role
    };
  });
  
  return assignedPlayers;
};

const generateTasks = (): Task[] => {
  const taskTypes = [
    'wire-puzzle',
    'keypad-hack',
    'password-crack',
    'surveillance-loop',
    'safe-unlock'
  ];
  
  return taskTypes.map((type, index) => ({
    id: `task-${index + 1}`,
    type,
    status: 'pending'
  }));
};

// Utils for room code can be defined in another file
// This is a placeholder
export const utils = {
  generateRoomCode: () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}; 