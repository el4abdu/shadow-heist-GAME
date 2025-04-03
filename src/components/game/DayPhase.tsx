"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type Player = {
  id: string;
  name: string;
  isAlive: boolean;
  role?: string;
  avatar: string;
};

type DayPhaseProps = {
  players: Player[];
};

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
};

export default function DayPhase({ players }: DayPhaseProps) {
  const [votedPlayer, setVotedPlayer] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([
    { id: "1", sender: "System", text: "Discussion phase has started. Vote to banish a suspected traitor.", timestamp: Date.now() },
    { id: "2", sender: "Player 2", text: "I think Player 4 is suspicious. They weren't doing tasks last round.", timestamp: Date.now() - 5000 },
    { id: "3", sender: "Player 4", text: "I was doing tasks! I completed the wiring puzzle.", timestamp: Date.now() - 3000 },
  ]);
  
  const handleVote = () => {
    if (!votedPlayer) return;
    
    // Here you would send the vote to your backend/Convex
    setHasVoted(true);
    
    // Add system message about your vote
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "System",
      text: `You voted to banish ${players.find(p => p.id === votedPlayer)?.name}.`,
      timestamp: Date.now(),
    };
    
    setChat([...chat, newMessage]);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "Player 1 (You)",
      text: message,
      timestamp: Date.now(),
    };
    
    setChat([...chat, newMessage]);
    setMessage("");
  };
  
  // Simulate votes from other players (for demo)
  const getVoteCount = (playerId: string) => {
    if (playerId === "4") return 2; // Simulate 2 votes for Player 4
    if (playerId === "6") return 1; // Simulate 1 vote for Player 6
    if (playerId === votedPlayer) return 1; // Your vote
    return 0;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Voting Panel */}
      <div className="bg-amber-900/10 p-4 rounded-lg border border-amber-900/30">
        <h3 className="text-lg font-bold mb-3 text-amber-400">Vote to Banish</h3>
        <p className="text-sm text-gray-300 mb-4">
          Vote to banish a player you suspect is a traitor. The player with the most votes will be eliminated.
        </p>
        
        <div className="space-y-2 mb-4">
          {players.filter(p => p.id !== "1").map((player) => {
            const voteCount = getVoteCount(player.id);
            
            return (
              <div 
                key={player.id}
                className={`flex items-center p-3 rounded cursor-pointer transition-colors ${
                  votedPlayer === player.id
                    ? "bg-amber-900/30 border border-amber-500/40"
                    : "bg-black/40 hover:bg-gray-800/60"
                }`}
                onClick={() => !hasVoted && setVotedPlayer(player.id)}
              >
                <div className="text-2xl mr-3">{player.avatar}</div>
                <div className="flex-1">
                  <div className="font-medium">{player.name}</div>
                  {voteCount > 0 && (
                    <div className="text-amber-300 text-sm">
                      {voteCount} vote{voteCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                {votedPlayer === player.id && (
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                )}
              </div>
            );
          })}
        </div>
        
        <Button
          className="w-full py-4 bg-amber-600 hover:bg-amber-700"
          onClick={handleVote}
          disabled={!votedPlayer || hasVoted}
        >
          {hasVoted ? "Vote Submitted" : "Submit Vote"}
        </Button>
        
        {hasVoted && (
          <div className="mt-4 p-3 bg-black/30 rounded text-sm text-center">
            <p className="text-gray-400">Votes will be tallied when the timer ends.</p>
            <p className="mt-1">Continue discussing to convince others!</p>
          </div>
        )}
      </div>
      
      {/* Discussion Panel */}
      <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-bold mb-3">Discussion</h3>
        
        <div className="h-80 overflow-y-auto mb-4 space-y-2 p-1">
          {chat.map((msg) => (
            <div key={msg.id} className="bg-black/40 rounded p-2">
              <div className="flex justify-between text-xs">
                <span className={msg.sender === "System" ? "text-gray-400" : "text-amber-300"}>
                  {msg.sender}
                </span>
                <span className="text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="mt-1 text-sm">{msg.text}</div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Make your case..."
            className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Button type="submit" className="bg-amber-600 hover:bg-amber-700">Send</Button>
        </form>
      </div>
    </div>
  );
} 