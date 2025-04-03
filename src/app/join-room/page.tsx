"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import AvatarSelector from "@/components/AvatarSelector";
import { joinRoom } from "@/lib/firebase-services";
import { getUserDisplayName } from "@/lib/utils";

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(undefined);
  const { user } = useUser();

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Join room button clicked");
    
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

    // Set a timeout to prevent the button from being stuck in loading state
    const timeoutId = setTimeout(() => {
      console.log("Join room timeout reached");
      setError("Request is taking too long. Please try again.");
      setIsLoading(false);
    }, 10000); // 10 second timeout

    try {
      console.log("Joining room with code:", roomCode, "user:", user.id, "avatar:", selectedAvatarId);
      
      // Call the Firebase function to join the room
      const result = await joinRoom({
        code: roomCode,
        userId: user.id,
        avatarId: selectedAvatarId
      });
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      console.log("Join room result:", result);
      
      // Navigate to the room
      router.push(`/room/${roomCode}`);
    } catch (err) {
      // Clear the timeout since we got an error
      clearTimeout(timeoutId);
      console.error("Failed to join room:", err);
      setError("Failed to join room. Check your room code and try again.");
      setIsLoading(false);
    }
  };

  // Add this function to debug click handling
  const debugClick = () => {
    console.log("Button direct click activated");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="flex justify-center mb-6">
          <Image 
            src="/Assets/logo.png" 
            alt="Shadow Heist Logo" 
            width={120} 
            height={120}
            className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          />
        </div>
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
            className="w-full py-6 bg-blue-600 hover:bg-blue-700 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            disabled={isLoading}
            onClick={(e) => {
              debugClick();
              if (e.currentTarget.form && !e.currentTarget.form.reportValidity()) {
                return; // Let the browser handle form validation
              }
              handleJoinRoom(e as unknown as React.FormEvent);
            }}
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