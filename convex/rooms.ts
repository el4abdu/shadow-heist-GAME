import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Generate a random 6-character code
function generateRoomCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export const createRoom = mutation({
  args: {
    name: v.string(),
    hostId: v.string(),
    traitorCount: v.number(),
    heroCount: v.number(),
    avatarId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log("Create room called with:", args);
    
    try {
      // Generate a unique room code
      let code = generateRoomCode();
      console.log("Generated room code:", code);
      
      // Create the room
      const roomId = await ctx.db.insert("rooms", {
        name: args.name,
        hostId: args.hostId,
        code,
        status: "lobby",
        traitorCount: args.traitorCount,
        heroCount: args.heroCount,
        createdAt: Date.now(),
      });
      
      console.log("Created room with ID:", roomId);
      
      // Assign a random avatar if none selected
      const avatarId = args.avatarId ?? Math.floor(Math.random() * 18) + 1;
      console.log("Using avatar ID:", avatarId);
      
      // Add the host as a player
      const playerId = await ctx.db.insert("players", {
        userId: args.hostId,
        roomId,
        ready: false,
        isHost: true,
        isAlive: true,
        avatarId,
      });
      
      console.log("Added host as player with ID:", playerId);
      
      return { roomId, code, playerId };
    } catch (err) {
      console.error("Error in createRoom:", err);
      throw err;
    }
  },
});

export const joinRoom = mutation({
  args: {
    code: v.string(),
    userId: v.string(),
    avatarId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log("Join room mutation called with:", args);
    
    try {
      // Find the room with the given code
      const rooms = await ctx.db
        .query("rooms")
        .filter((q) => q.eq(q.field("code"), args.code))
        .collect();
      
      console.log("Found rooms:", rooms);
      
      if (rooms.length === 0) {
        throw new Error(`Room with code ${args.code} not found`);
      }
      
      const room = rooms[0];
      const roomId = room._id;
      
      // Check if the player is already in the room
      const existingPlayer = await ctx.db
        .query("players")
        .filter((q) => 
          q.and(
            q.eq(q.field("roomId"), roomId),
            q.eq(q.field("userId"), args.userId)
          )
        )
        .first();
      
      console.log("Existing player:", existingPlayer);
      
      if (existingPlayer) {
        console.log("Player already in room, returning room info");
        return { roomId, player: existingPlayer };
      }
      
      // Get currently used avatars in the room
      const existingPlayers = await ctx.db
        .query("players")
        .filter((q) => q.eq(q.field("roomId"), roomId))
        .collect();
      
      const usedAvatarIds = existingPlayers
        .map(player => player.avatarId)
        .filter(id => id !== undefined);
      
      console.log("Used avatar IDs:", usedAvatarIds);
      
      // If user selected an avatar, check if it's available
      let avatarId = args.avatarId;
      
      // If avatar is already used or not selected, assign a random available one
      if (!avatarId || usedAvatarIds.includes(avatarId)) {
        // Get all available avatars (1-18)
        const allAvatarIds = Array.from({ length: 18 }, (_, i) => i + 1);
        const availableAvatarIds = allAvatarIds.filter(id => !usedAvatarIds.includes(id));
        
        // Select a random available avatar
        const randomIndex = Math.floor(Math.random() * availableAvatarIds.length);
        avatarId = availableAvatarIds[randomIndex];
        console.log("Assigned random avatar:", avatarId);
      }
      
      // Add player to the room
      const playerId = await ctx.db.insert("players", {
        userId: args.userId,
        roomId,
        ready: false,
        isHost: false,
        isAlive: true,
        avatarId,
      });
      
      console.log("Added player to room with ID:", playerId);
      
      return { roomId, code: args.code, playerId };
    } catch (err) {
      console.error("Error in joinRoom:", err);
      throw err;
    }
  },
});

export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const getRoomByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    console.log("Getting room by code:", args.code);
    
    try {
      // Find room by code
      const room = await ctx.db
        .query("rooms")
        .filter((q) => q.eq(q.field("code"), args.code))
        .first();
      
      console.log("Found room:", room);
      return room;
    } catch (err) {
      console.error("Error finding room by code:", err);
      return null;
    }
  },
});

export const getPlayersInRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    console.log("Getting players in room:", args.roomId);
    
    try {
      // Get all players in the room
      const players = await ctx.db
        .query("players")
        .filter((q) => q.eq(q.field("roomId"), args.roomId))
        .collect();
      
      console.log("Found players:", players.length);
      return players;
    } catch (err) {
      console.error("Error finding players in room:", err);
      return [];
    }
  },
});

// This function would be implemented properly once the schema is setup
export const setPlayerReady = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.string(),
    ready: v.boolean(),
  },
  handler: async (ctx, args) => {
    // In a real implementation with proper schema setup, you would use:
    // const player = await ctx.db
    //   .query("players")
    //   .withIndex("by_user_and_room", (q) => 
    //     q.eq("userId", args.userId).eq("roomId", args.roomId)
    //   )
    //   .first();
    
    // For demo, just return true
    return true;
  },
});

// Add this new startGame mutation
export const startGame = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    // Update room status to "playing"
    await ctx.db.patch(args.roomId, {
      status: "playing"
    });
    
    // In a real implementation, you would also:
    // 1. Assign roles to players
    // 2. Initialize game state
    // 3. Set up initial tasks
    
    return true;
  },
}); 