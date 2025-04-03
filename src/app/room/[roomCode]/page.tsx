"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { subscribeToRoom, subscribeToChat, sendMessage, startGame, toggleReady } from '@/lib/firebase-services';
import type { Room, Player, Message } from '@/lib/firebase-services';
import { formatTime, formatSeconds } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const roomCode = params.roomCode as string;
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [isTogglingReady, setIsTogglingReady] = useState(false);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn || !user) {
      router.push('/');
      return;
    }
    
    // Subscribe to room updates
    const unsubscribeRoom = subscribeToRoom(roomCode, (roomData) => {
      setRoom(roomData);
      setLoading(false);
      
      // Find the current player in the room
      const player = roomData.players.find(p => p.id === user.id);
      if (player) {
        setCurrentPlayer(player);
      }
    });
    
    // Subscribe to chat updates
    const unsubscribeChat = subscribeToChat(room?.id || '', (chatMessages) => {
      setMessages(chatMessages);
    });
    
    return () => {
      unsubscribeRoom();
      unsubscribeChat();
    };
  }, [isLoaded, isSignedIn, user, roomCode, router, room?.id]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !user || !currentPlayer || !room) return;
    
    try {
      await sendMessage(room.id, {
        playerId: user.id,
        playerName: currentPlayer.name,
        content: messageInput.trim()
      });
      
      setMessageInput('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleStartGame = async () => {
    if (!room || !currentPlayer?.isHost) return;
    
    setIsStartingGame(true);
    try {
      await startGame(room.id);
      toast.success('Game started successfully!');
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Failed to start game. Please try again.');
    } finally {
      setIsStartingGame(false);
    }
  };

  const handleToggleReady = async () => {
    if (!room || !currentPlayer || currentPlayer.isHost) return;
    
    setIsTogglingReady(true);
    try {
      await toggleReady(room.id, currentPlayer.id);
    } catch (error) {
      console.error('Error toggling ready status:', error);
      toast.error('Failed to update ready status. Please try again.');
    } finally {
      setIsTogglingReady(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-xl text-white animate-pulse">Loading room...</div>
      </div>
    );
  }
  
  // Render error state
  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
        <div className="text-xl text-red-400 mb-4">
          {error || "Room not found"}
        </div>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Room Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{room.name}</h1>
            <div className="text-gray-400">Room Code: {room.code}</div>
          </div>
          
          <div className="flex items-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="mr-2">
                Leave Room
              </Button>
            </Link>
            
            {currentPlayer?.isHost && room.gameState.status === 'waiting' && (
              <Button 
                variant="default" 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleStartGame}
                disabled={isStartingGame || room.players.length < 4 || !room.players.every(p => p.isReady || p.isHost)}
              >
                {isStartingGame ? 'Starting...' : 'Start Game'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Game Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-400">Status: </span>
              <span className={`font-medium ${
                room.gameState.status === 'waiting' ? 'text-yellow-400' : 
                room.gameState.status === 'playing' ? 'text-green-400' :
                'text-red-400'
              }`}>
                {room.gameState.status.charAt(0).toUpperCase() + room.gameState.status.slice(1)}
              </span>
            </div>
            
            {room.gameState.status === 'playing' && (
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">
                  {room.gameState.phase && room.gameState.phase.charAt(0).toUpperCase() + room.gameState.phase.slice(1)} Phase
                </span>
                {room.gameState.timeLeft && (
                  <span className="bg-gray-700 px-2 py-1 rounded font-mono">
                    {formatSeconds(room.gameState.timeLeft)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Player List */}
          <div className="md:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 h-full">
              <h2 className="text-xl font-semibold mb-4">Players</h2>
              
              <div className="space-y-3">
                {room.players.map((player) => (
                  <div 
                    key={player.id} 
                    className={`flex items-center p-2 rounded-lg ${
                      player.id === user?.id ? 'bg-blue-900/30 border border-blue-800/50' : 
                      'bg-gray-800/70'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      {player.avatarId ? (
                        <img 
                          src={`/Assets/avatars/avatar-${player.avatarId}.png`} 
                          alt="Avatar" 
                          className="h-full w-full rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `/Assets/avatars/default.png`;
                          }}
                        />
                      ) : (
                        <div className="text-xl">👤</div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium flex items-center">
                        {player.name}
                        {player.isHost && (
                          <span className="ml-2 text-xs bg-purple-900/70 text-purple-200 px-1.5 py-0.5 rounded-full">
                            Host
                          </span>
                        )}
                      </div>
                      
                      {room.gameState.status === 'waiting' ? (
                        <div className="text-xs text-gray-400">
                          {player.isReady ? 'Ready' : 'Not Ready'}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">
                          {player.isAlive ? 'Active' : 'Eliminated'}
                        </div>
                      )}
                    </div>
                    
                    {room.gameState.status !== 'waiting' && player.role && (
                      <div className="text-xs">
                        {(player.id === user?.id || room.gameState.status === 'finished') && player.role}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Game/Chat Area */}
          <div className="md:col-span-2">
            {room.gameState.status === 'waiting' ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 flex flex-col items-center justify-center min-h-[400px]">
                <Image 
                  src="/Assets/logo.png" 
                  alt="Shadow Heist Logo" 
                  width={120} 
                  height={120}
                  className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] mb-6"
                />
                
                <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  WAITING FOR PLAYERS
                </h2>
                
                <p className="text-gray-400 text-center mb-6">
                  {room.players.length} of 8 players have joined
                </p>
                
                {currentPlayer?.isHost ? (
                  <Button 
                    className="w-48 py-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-700"
                    disabled={
                      isStartingGame || 
                      room.players.length < 4 || 
                      !room.players.every(p => p.isReady || p.isHost)
                    }
                    onClick={handleStartGame}
                  >
                    {isStartingGame ? 'Starting...' : 'Start Game'}
                  </Button>
                ) : (
                  <Button 
                    className="w-48 py-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
                    onClick={handleToggleReady}
                    disabled={isTogglingReady}
                  >
                    {isTogglingReady ? "Updating..." : currentPlayer?.isReady ? "Not Ready" : "Ready"}
                  </Button>
                )}
                
                {room.players.length < 4 && (
                  <p className="text-sm text-yellow-400 mt-4">
                    Need at least 4 players to start
                  </p>
                )}
                
                {room.players.length >= 4 && !room.players.every(p => p.isReady || p.isHost) && currentPlayer?.isHost && (
                  <p className="text-sm text-yellow-400 mt-4">
                    Waiting for all players to be ready
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 min-h-[400px]">
                {/* Game interface will go here */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Game In Progress</h2>
                  <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                    <div className="font-semibold mb-2">Your Role</div>
                    <div className="text-lg font-bold text-purple-400">
                      {currentPlayer?.role || 'Observer'}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="text-sm text-gray-300">Objectives:</div>
                      <ul className="list-disc list-inside text-sm text-gray-400">
                        {currentPlayer?.role?.includes('traitor') && (
                          <>
                            <li>Sabotage tasks without being caught</li>
                            <li>Eliminate heroes without revealing yourself</li>
                          </>
                        )}
                        {currentPlayer?.role?.includes('hero') && (
                          <>
                            <li>Complete tasks to win the heist</li>
                            <li>Identify and vote out the traitors</li>
                          </>
                        )}
                        {currentPlayer?.role === 'civilian' && (
                          <>
                            <li>Complete tasks to help the heroes</li>
                            <li>Avoid being suspected as a traitor</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Chat */}
            <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 h-[300px] flex flex-col">
              <div className="p-3 border-b border-gray-700">
                <h3 className="font-semibold">Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.length === 0 ? (
                  <div className="text-gray-500 text-center text-sm py-4">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${
                        message.playerId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.playerId === user?.id 
                            ? 'bg-indigo-900/70 text-indigo-100' 
                            : 'bg-gray-700/70 text-gray-100'
                        }`}
                      >
                        <div className="text-xs opacity-80 mb-1">
                          {message.playerId === user?.id ? 'You' : message.playerName}
                          <span className="ml-2 text-xs opacity-60">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <div>{message.content}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 flex">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700/60 border border-gray-600 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r px-4"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}