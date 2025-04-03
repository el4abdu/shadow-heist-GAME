"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { createRoom } from "@/lib/firebase-services";

export default function CreateRoom() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  
  const [roomName, setRoomName] = useState("");
  const [traitorCount, setTraitorCount] = useState(2);
  const [heroCount, setHeroCount] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(1); // Default avatar
  
  const totalPlayerCount = traitorCount + heroCount + 2; // 2 civilians by default
  
  // Calculate the neutral count (civilians)
  const neutralCount = Math.max(0, totalPlayerCount - traitorCount - heroCount);
  
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn || !user) {
      toast.error("You must be signed in to create a room");
      return;
    }
    
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Use the Firebase service to create a room
      const result = await createRoom({
        name: roomName.trim(),
        hostId: user.id,
        traitorCount, 
        heroCount,
        avatarId: selectedAvatarId,
      });
      
      toast.success("Room created successfully!");
      
      // Navigate to the room page
      const { roomId, code: roomCode } = result;
      router.push(`/room/${roomCode}`);
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image 
            src="/Assets/logo.png" 
            alt="Shadow Heist" 
            width={120} 
            height={120} 
            className="mx-auto mb-4 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
          />
          <h1 className="text-3xl font-bold text-white">Create Room</h1>
          <p className="text-gray-400 mt-2">Set up your game and invite friends</p>
        </div>
        
        <form onSubmit={handleCreateRoom} className="space-y-6 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <div>
            <label htmlFor="roomName" className="text-white block mb-1">Room Name</label>
            <input
              id="roomName"
              type="text"
              value={roomName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="w-full p-2 rounded bg-gray-900/70 border border-gray-700 text-white mt-1"
              maxLength={20}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="traitorCount" className="text-white">Traitors</label>
              <span className="text-purple-400 font-semibold">{traitorCount}</span>
            </div>
            <input
              id="traitorCount"
              type="range"
              value={traitorCount}
              min={1}
              max={3}
              step={1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTraitorCount(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="heroCount" className="text-white">Heroes</label>
              <span className="text-blue-400 font-semibold">{heroCount}</span>
            </div>
            <input
              id="heroCount"
              type="range"
              value={heroCount}
              min={1}
              max={3}
              step={1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroCount(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-white">Civilians</label>
              <span className="text-gray-400 font-semibold">{neutralCount}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-white">Total Players</label>
              <span className="text-green-400 font-semibold">{totalPlayerCount}</span>
            </div>
          </div>
          
          <div className="pt-2 space-y-4">
            <button 
              type="submit" 
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-70"
              disabled={isCreating}
            >
              {isCreating ? "Creating Room..." : "Create Room"}
            </button>
            
            <Link href="/" className="block text-center">
              <button 
                type="button" 
                className="w-full py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded"
              >
                Back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 