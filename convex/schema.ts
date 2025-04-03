import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    avatarUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  // Rooms table
  rooms: defineTable({
    name: v.string(),
    hostId: v.string(),
    code: v.string(),
    status: v.string(), // "lobby", "playing", "ended"
    traitorCount: v.number(),
    heroCount: v.number(),
    createdAt: v.number(),
  }).index("by_code", ["code"]),

  // Players table
  players: defineTable({
    userId: v.string(),
    roomId: v.id("rooms"),
    role: v.optional(v.string()), // "masterThief", "hacker", "infiltrator", "doubleAgent", "civilian"
    ready: v.boolean(),
    isHost: v.boolean(),
    alignment: v.optional(v.string()), // "hero", "traitor", "neutral"
    isAlive: v.boolean(),
  })
  .index("by_room", ["roomId"])
  .index("by_user_and_room", ["userId", "roomId"]),

  // Tasks table
  tasks: defineTable({
    roomId: v.id("rooms"),
    type: v.string(), // "wiring", "hacking", etc.
    status: v.string(), // "pending", "completed", "sabotaged"
    completedBy: v.optional(v.string()),
    sabotagedBy: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_room", ["roomId"]),

  // Game Actions table
  gameActions: defineTable({
    roomId: v.id("rooms"),
    playerId: v.string(),
    actionType: v.string(), // "vote", "task", "ability"
    target: v.optional(v.string()), // ID of player being targeted
    phase: v.string(), // "night", "day", "task"
    round: v.number(),
    timestamp: v.number(),
  }).index("by_room", ["roomId"]),

  // Messages table
  messages: defineTable({
    roomId: v.id("rooms"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(),
    timestamp: v.number(),
    isSystemMessage: v.boolean(),
  }).index("by_room", ["roomId"]),
}); 