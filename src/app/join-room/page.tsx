"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import AvatarSelector from "@/components/AvatarSelector";

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(undefined);
  const { user } = useUser();
  
  const joinRoom = useMutation(api.rooms.joinRoom);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomCode) {
      setError("Please enter a room code");
      return;
    }

    if (!user) {
      setError("You must be logged in to join a room");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call the Convex mutation to join the room
      const result = await joinRoom({
        code: roomCode,
        userId: user.id,
        avatarId: selectedAvatarId
      });
      
      // Navigate to the room page
      router.push(`/room/${roomCode}`);
    } catch (err) {
      console.error("Failed to join room:", err);
      setError("Failed to join room. Check your room code and try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto pt-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Join a Room</h1>
        
        <form onSubmit={handleJoinRoom} className="space-y-6">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium mb-2">
              Room Code
            </label>
            <input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit room code"
              className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Your Avatar
            </label>
            <div className="flex justify-center mb-4">
              <AvatarSelector 
                onSelect={(avatarId) => setSelectedAvatarId(avatarId)} 
                initialAvatarId={selectedAvatarId}
              />
            </div>
            <p className="text-xs text-center text-gray-400">
              Click to select an avatar. Note: If someone already selected this avatar, you'll get assigned a random one.
            </p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-900 rounded text-sm text-red-200">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full py-6 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Joining Room..." : "Join Room"}
          </Button>
          
          <div className="text-center">
            <Link href="/" className="text-sm text-blue-400 hover:underline">
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
} 