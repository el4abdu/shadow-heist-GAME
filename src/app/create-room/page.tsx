"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { safeApi } from "@/lib/safeApi";
import { useUser } from "@clerk/nextjs";
import AvatarSelector from "@/components/AvatarSelector";

export default function CreateRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [traitorCount, setTraitorCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(undefined);
  const { user } = useUser();

  const createRoom = useMutation(safeApi(api).rooms.createRoom);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create room button clicked");
    
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

    // Set a timeout to prevent the button from being stuck in loading state
    const timeoutId = setTimeout(() => {
      console.log("Create room timeout reached");
      setError("Request is taking too long. Please try again.");
      setIsLoading(false);
    }, 10000); // 10 second timeout

    try {
      // Calculate hero count based on traitor count
      const heroCount = 6 - traitorCount - 2; // 2 civilians
      
      console.log("Creating room with:", { 
        name: roomName, 
        hostId: user.id,
        traitorCount,
        heroCount,
        avatarId: selectedAvatarId 
      });
      
      // Call the Convex function to create a room
      const response = await createRoom({
        name: roomName,
        hostId: user.id,
        traitorCount,
        heroCount,
        avatarId: selectedAvatarId
      });
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      console.log("Room created:", response);
      const { roomId, code } = response;
      
      // Navigate to the room page
      router.push(`/room/${code}`);
    } catch (err) {
      // Clear the timeout since we got an error
      clearTimeout(timeoutId);
      console.error("Failed to create room:", err);
      setError("Failed to create room. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto pt-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Create a Room</h1>
        
        <form onSubmit={handleCreateRoom} className="space-y-6">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium mb-2">
              Room Name
            </label>
            <input
              id="roomName"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter a name for your room"
              className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <p className="text-xs text-center text-gray-400">Click to select or change your avatar</p>
          </div>
          
          <div>
            <label htmlFor="traitorCount" className="block text-sm font-medium mb-2">
              Number of Traitors
            </label>
            <div className="flex items-center gap-4">
              <input
                id="traitorCount"
                type="range"
                min="1"
                max="3"
                value={traitorCount}
                onChange={(e) => setTraitorCount(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="w-8 text-center font-semibold">{traitorCount}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>
          </div>
          
          <div className="pt-4">
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-gray-800 rounded p-2">
                <div className="font-medium text-blue-400">Heroes</div>
                <div>{6 - traitorCount - 2}</div>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <div className="font-medium text-red-400">Traitors</div>
                <div>{traitorCount}</div>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <div className="font-medium text-gray-400">Civilians</div>
                <div>2</div>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <div className="font-medium text-purple-400">Total</div>
                <div>6</div>
              </div>
            </div>
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
              console.log("Create room button direct click");
              if (e.currentTarget.form && !e.currentTarget.form.reportValidity()) {
                return; // Let the browser handle form validation
              }
              handleCreateRoom(e as unknown as React.FormEvent);
            }}
          >
            {isLoading ? "Creating Room..." : "Create Room"}
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