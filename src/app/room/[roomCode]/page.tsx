"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { RoomModel, PlayerModel } from "@/lib/types";
import { safeApi } from "@/lib/safeApi";

type Player = {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  avatar: string;
};

export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomCode = params.roomCode as string;
  const { user } = useUser();
  
  // Get room data
  const room = useQuery(safeApi(api).rooms.getRoomByCode, { code: roomCode });
  
  // Get players in room
  const playersInRoom = useQuery(safeApi(api).rooms.getPlayersInRoom, 
    room ? { roomId: room?._id } : 'skip'
  ) || [];
  
  // Mutations
  const setPlayerReady = useMutation(safeApi(api).rooms.setPlayerReady);
  const startGame = useMutation(safeApi(api).rooms.startGame);
  
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string; timestamp: number }[]>([
    { sender: "System", text: "Welcome to the game lobby!", timestamp: Date.now() },
  ]);
  
  // Determine if current user is host
  const isHost = room?.hostId === user?.id;
  
  // Determine if current user is ready
  const currentPlayer = playersInRoom.find(p => p.userId === user?.id);
  const isReady = currentPlayer?.ready || false;

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      sender: `${user?.firstName || 'Player'} (You)`,
      text: message,
      timestamp: Date.now(),
    };
    
    setChat([...chat, newMessage]);
    setMessage("");
  };

  const toggleReady = async () => {
    if (!user || !room) return;
    
    try {
      await setPlayerReady({
        roomId: room._id,
        userId: user.id,
        ready: !isReady
      });
    } catch (err) {
      console.error("Failed to toggle ready status:", err);
    }
  };

  const handleStartGame = async () => {
    if (!user || !room || !isHost) return;
    
    try {
      await startGame({ roomId: room._id });
      router.push(`/room/${roomCode}/game`);
    } catch (err) {
      console.error("Failed to start game:", err);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    // Add toast notification
  };
  
  // If room doesn't exist, show error
  if (room === undefined) {
    return <div>Loading...</div>;
  }
  
  if (room === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Room Not Found</h1>
          <p>The room code {roomCode} does not exist.</p>
          <Link href="/join-room">
            <Button>Try Another Code</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Room info and players */}
          <div className="lg:w-2/3 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Game Lobby</h1>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg font-mono">
                  {roomCode}
                </div>
                <Button 
                  variant="outline" 
                  className="border-white/20 bg-black/30 hover:bg-black/50 text-gray-300"
                  onClick={copyRoomCode}
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Players ({playersInRoom.length}/6)</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playersInRoom.map(player => (
                  <div 
                    key={player._id} 
                    className={`flex items-center p-4 rounded-lg ${
                      player.ready ? "bg-green-900/20 border border-green-500/30" : "bg-black/20 border border-white/10"
                    }`}
                  >
                    <div className="h-12 w-12 mr-3 overflow-hidden rounded-full border border-white/20">
                      <img 
                        src={player.avatarId ? `/Avatars/Avatar (${player.avatarId}).png` : "/placeholder-avatar.png"} 
                        alt="Player avatar" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">{player.userId === user?.id ? 'You' : `Player ${player._id.substring(0, 4)}`}</div>
                      <div className="text-sm">
                        {player.isHost && <span className="text-yellow-400">Host</span>}
                        {!player.isHost && (
                          player.ready ? 
                            <span className="text-green-400">Ready</span> : 
                            <span className="text-gray-400">Not Ready</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Game Settings</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Traitors</span>
                  <span className="px-3 py-1 bg-black/40 rounded border border-white/10">{room.traitorCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Heroes</span>
                  <span className="px-3 py-1 bg-black/40 rounded border border-white/10">{room.heroCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Civilians</span>
                  <span className="px-3 py-1 bg-black/40 rounded border border-white/10">{6 - room.traitorCount - room.heroCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tasks to Win</span>
                  <span className="px-3 py-1 bg-black/40 rounded border border-white/10">3</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                className={`flex-1 py-6 ${
                  isReady 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={toggleReady}
              >
                {isReady ? "Cancel Ready" : "Ready Up"}
              </Button>
              
              {isHost && (
                <Button
                  className="flex-1 py-6 bg-purple-600 hover:bg-purple-700"
                  disabled={playersInRoom.some(player => !player.ready)}
                  onClick={handleStartGame}
                >
                  Start Game
                </Button>
              )}
            </div>
            
            <Link href="/">
              <Button variant="outline" className="border-white/20 bg-black/30 hover:bg-black/50 text-gray-300">
                Leave Room
              </Button>
            </Link>
          </div>
          
          {/* Right side - Chat */}
          <div className="lg:w-1/3 bg-black/30 border border-white/10 rounded-xl p-4 h-[600px] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Chat</h2>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {chat.map((msg, index) => (
                <div key={index} className="bg-black/20 rounded p-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{msg.sender}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="mt-1">{msg.text}</div>
                </div>
              ))}
            </div>
            
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 