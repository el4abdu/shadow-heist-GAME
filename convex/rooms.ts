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
    // Generate a unique room code
    let code = generateRoomCode();
    
    // For demo purposes, we'll use a simple code without checking uniqueness
    // In a real implementation, you would use withIndex once the schema is properly setup
    
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
    
    // Assign a random avatar if none selected
    const avatarId = args.avatarId ?? Math.floor(Math.random() * 18) + 1;
    
    // Add the host as a player
    await ctx.db.insert("players", {
      userId: args.hostId,
      roomId,
      ready: false,
      isHost: true,
      isAlive: true,
      avatarId,
    });
    
    return { roomId, code };
  },
});

export const joinRoom = mutation({
  args: {
    code: v.string(),
    userId: v.string(),
    avatarId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // In a real implementation with proper schema setup, you would use:
    // const room = await ctx.db
    //   .query("rooms")
    //   .withIndex("by_code", (q) => q.eq("code", args.code))
    //   .first();
    
    // For demo, we'll assume we have the roomId
    const roomId = "demo_room_id";
    
    // Get currently used avatars in the room
    const existingPlayers = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", roomId as any))
      .collect();
    
    const usedAvatarIds = existingPlayers.map(player => player.avatarId).filter(id => id !== undefined);
    
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
    }
    
    // Add player to the room
    await ctx.db.insert("players", {
      userId: args.userId,
      roomId: roomId as any, // Type casting for demo
      ready: false,
      isHost: false,
      isAlive: true,
      avatarId,
    });
    
    return { roomId };
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
    // In a real implementation with proper schema setup, you would use:
    // return await ctx.db
    //   .query("rooms")
    //   .withIndex("by_code", (q) => q.eq("code", args.code))
    //   .first();
    
    // For demo, return a mock room
    return {
      _id: "demo_room_id",
      code: args.code,
      name: "Demo Room",
      status: "lobby",
      traitorCount: 2,
      heroCount: 2,
      createdAt: Date.now(),
    };
  },
});

export const getPlayersInRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    // In a real implementation with proper schema setup, you would use:
    // const players = await ctx.db
    //   .query("players")
    //   .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
    //   .collect();
    
    // For demo, return mock players
    return [
      { 
        _id: "player1", 
        userId: "user1", 
        roomId: args.roomId, 
        ready: true, 
        isHost: true, 
        isAlive: true 
      },
      { 
        _id: "player2", 
        userId: "user2", 
        roomId: args.roomId, 
        ready: false, 
        isHost: false, 
        isAlive: true 
      },
    ];
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