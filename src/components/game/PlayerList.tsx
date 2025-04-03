"use client";

import React from "react";

type Player = {
  id: string;
  name: string;
  isAlive: boolean;
  role?: string;
  avatar: string;
};

type PlayerListProps = {
  players: Player[];
};

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-4">
      <h2 className="text-lg font-bold mb-3">Players</h2>
      
      <div className="space-y-2">
        {players.map((player) => (
          <div 
            key={player.id}
            className={`flex items-center p-2 rounded ${
              player.isAlive 
                ? "bg-black/20" 
                : "bg-red-900/10 opacity-60"
            }`}
          >
            <div className="text-2xl mr-2">{player.avatar}</div>
            <div className="flex-1">
              <div className={`font-medium ${!player.isAlive && "line-through text-gray-500"}`}>
                {player.name}
              </div>
              {!player.isAlive && (
                <div className="text-xs text-red-400">
                  Eliminated
                </div>
              )}
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
} 