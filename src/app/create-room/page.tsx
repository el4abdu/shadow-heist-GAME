"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function CreateRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [traitorCount, setTraitorCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();

  const createRoom = useMutation(api.rooms.createRoom);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName) {
      setError("Please enter a room name");
      return;
    }

    if (!user) {
      setError("You must be logged in to create a room");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Calculate hero count based on traitor count
      const heroCount = 6 - traitorCount - 2; // 2 civilians
      
      // Call the Convex function to create a room
      const { roomId, code } = await createRoom({
        name: roomName,
        hostId: user.id,
        traitorCount,
        heroCount
      });
      
      // Navigate to the room page
      router.push(`/room/${code}`);
    } catch (err) {
      console.error("Failed to create room:", err);
      setError("Failed to create room. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            CREATE A ROOM
          </h1>
          <p className="mt-2 text-gray-400">
            Set up your heist team and invite your friends
          </p>
        </div>

        <form onSubmit={handleCreateRoom} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-300 mb-1">
                Room Name
              </label>
              <input
                id="roomName"
                name="roomName"
                type="text"
                required
                className="relative block w-full px-4 py-3 border border-white/10 bg-black/30 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="The Perfect Heist"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="traitorCount" className="block text-sm font-medium text-gray-300 mb-1">
                Number of Traitors
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="px-3 py-2 bg-black/50 rounded-l-lg border border-white/10 hover:bg-black/70"
                  onClick={() => setTraitorCount(Math.max(1, traitorCount - 1))}
                >
                  -
                </button>
                <div className="px-6 py-2 border-t border-b border-white/10 bg-black/30 text-center min-w-[50px]">
                  {traitorCount}
                </div>
                <button
                  type="button"
                  className="px-3 py-2 bg-black/50 rounded-r-lg border border-white/10 hover:bg-black/70"
                  onClick={() => setTraitorCount(Math.min(3, traitorCount + 1))}
                >
                  +
                </button>
                <span className="ml-3 text-sm text-gray-400">
                  (Max 3 for 6 players)
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-center text-sm">{error}</div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="text-lg py-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
            
            <Link href="/" className="text-center">
              <Button 
                type="button" 
                variant="outline" 
                className="mt-2 text-sm py-2 px-4 border-white/20 bg-black/30 hover:bg-black/50 text-gray-300 rounded-lg"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
} 