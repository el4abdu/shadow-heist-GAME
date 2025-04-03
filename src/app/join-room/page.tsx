"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
        userId: user.id
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
            JOIN A ROOM
          </h1>
          <p className="mt-2 text-gray-400">
            Enter the room code to join the heist team
          </p>
        </div>

        <form onSubmit={handleJoinRoom} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="roomCode" className="sr-only">
                Room Code
              </label>
              <input
                id="roomCode"
                name="roomCode"
                type="text"
                required
                className="relative block w-full px-4 py-4 text-lg text-center uppercase tracking-widest border border-white/10 bg-black/30 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ENTER CODE"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-center text-sm">{error}</div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="text-lg py-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join Game"}
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