import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    clerkId: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // In a real implementation with proper schema setup, you would use:
    // const existingUser = await ctx.db
    //   .query("users")
    //   .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
    //   .first();
    
    // For demo, we'll create a new user without checking for existing ones
    const userId = await ctx.db.insert("users", {
      name: args.name,
      clerkId: args.clerkId,
      avatarUrl: args.avatarUrl,
    });

    return userId;
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // In a real implementation with proper schema setup, you would use:
    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
    //   .first();
    
    // For demo, return a mock user
    return {
      _id: "user_id",
      name: "Demo User",
      clerkId: args.clerkId,
      avatarUrl: "https://example.com/avatar.png"
    };
  },
}); 