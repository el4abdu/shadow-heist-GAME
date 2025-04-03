// useRoomData.ts - Custom hook to manage room state with optimistic updates

import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { PlayerModel, RoomModel } from "./types";
import { useGameSocket, GameEvent } from "./gameSocket";

export function useRoomData(roomCode: string) {
  const { user } = useUser();
  const userId = user?.id;
  
  // Room and players data from Convex
  const room = useQuery(api.rooms.getRoomByCode, { code: roomCode });
  const playersInRoom = useQuery(
    api.rooms.getPlayersInRoom, 
    room ? { roomId: room._id } : 'skip'
  ) || [];
  
  // Local state for optimistic updates
  const [optimisticPlayers, setOptimisticPlayers] = useState<PlayerModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mutations
  const setPlayerReady = useMutation(api.rooms.setPlayerReady);
  const startGame = useMutation(api.rooms.startGame);
  
  // Get current player data
  const currentPlayer = playersInRoom.find(p => p.userId === userId);
  const isHost = room?.hostId === userId;
  const isReady = currentPlayer?.ready || false;
  
  // Use the game socket for real-time updates
  const { isConnected, connectionError, sendEvent } = useGameSocket({
    roomCode,
    userId: userId || 'anonymous',
    onEvent: handleGameEvent
  });
  
  // Handle incoming real-time events
  function handleGameEvent(event: GameEvent) {
    switch (event.type) {
      case 'player_ready':
        // Optimistically update the player's ready status
        const { playerId, isReady } = event.payload;
        setOptimisticPlayers(prev => 
          prev.map(p => p.userId === playerId ? { ...p, ready: isReady } : p)
        );
        break;
        
      case 'player_join':
      case 'player_leave':
        // Let Convex handle these since they affect the room state
        break;
        
      case 'chat_message':
        // This would be handled by the chat component
        break;
        
      case 'game_start':
        // This will be handled by the router
        break;
    }
  }
  
  // Set up the optimistic state once we have the real data
  useEffect(() => {
    if (playersInRoom.length > 0) {
      setOptimisticPlayers(playersInRoom);
      setIsLoading(false);
    }
  }, [playersInRoom]);
  
  // Room error handling
  useEffect(() => {
    if (room === null) {
      setError('Room not found');
    } else if (connectionError) {
      setError(`Connection error: ${connectionError}`);
    } else {
      setError(null);
    }
  }, [room, connectionError]);
  
  // Toggle ready status with optimistic update
  const toggleReady = async () => {
    if (!userId || !room) return;
    
    // Optimistically update UI
    setOptimisticPlayers(prev => 
      prev.map(p => p.userId === userId ? { ...p, ready: !isReady } : p)
    );
    
    // Send real-time event
    sendEvent({
      type: 'player_ready',
      payload: { playerId: userId, isReady: !isReady }
    });
    
    // Call the mutation
    try {
      await setPlayerReady({
        roomId: room._id,
        userId,
        ready: !isReady
      });
    } catch (err) {
      console.error('Failed to toggle ready status:', err);
      // Revert optimistic update on error
      setOptimisticPlayers(playersInRoom);
      setError('Failed to update ready status');
    }
  };
  
  // Start the game
  const handleStartGame = async () => {
    if (!userId || !room || !isHost) return;
    
    try {
      await startGame({ roomId: room._id });
      
      // Send real-time event
      sendEvent({
        type: 'game_start',
        payload: { roomId: room._id }
      });
      
      return true;
    } catch (err) {
      console.error('Failed to start game:', err);
      setError('Failed to start game');
      return false;
    }
  };
  
  return {
    room,
    players: optimisticPlayers,
    currentPlayer,
    isHost,
    isReady,
    isLoading,
    error,
    isConnected,
    toggleReady,
    startGame: handleStartGame
  };
} 