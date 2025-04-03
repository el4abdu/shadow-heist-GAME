import { Id } from "../../convex/_generated/dataModel";

// Database model types
export type UserModel = {
  _id: Id<"users">;
  name: string;
  clerkId: string;
  avatarUrl?: string;
};

export type RoomModel = {
  _id: Id<"rooms">;
  name: string;
  hostId: string;
  code: string;
  status: "lobby" | "playing" | "ended";
  traitorCount: number;
  heroCount: number;
  createdAt: number;
};

export type PlayerModel = {
  _id: Id<"players">;
  userId: string;
  roomId: Id<"rooms">;
  role?: string;
  ready: boolean;
  isHost: boolean;
  alignment?: "hero" | "traitor" | "neutral";
  isAlive: boolean;
};

export type TaskModel = {
  _id: Id<"tasks">;
  roomId: Id<"rooms">;
  type: string;
  status: "pending" | "completed" | "sabotaged";
  completedBy?: string;
  sabotagedBy?: string;
  createdAt: number;
};

export type GameActionModel = {
  _id: Id<"gameActions">;
  roomId: Id<"rooms">;
  playerId: string;
  actionType: "vote" | "task" | "ability";
  target?: string;
  phase: "night" | "day" | "task";
  round: number;
  timestamp: number;
};

export type MessageModel = {
  _id: Id<"messages">;
  roomId: Id<"rooms">;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  isSystemMessage: boolean;
};

// UI model types
export type PlayerUI = {
  id: string;
  name: string;
  isAlive: boolean;
  role: string;
  avatar: string;
};

export type GamePhase = "night" | "day" | "task" | "reveal" | "end";

export type RoleInfo = {
  name: string;
  description: string;
  alignment: string;
  color: string;
}; 