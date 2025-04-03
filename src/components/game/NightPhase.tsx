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

type NightPhaseProps = {
  playerRole: string;
  players: Player[];
};

export default function NightPhase({ playerRole, players }: NightPhaseProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [abilityUsed, setAbilityUsed] = useState(false);
  
  const getAbilityInfo = () => {
    switch (playerRole) {
      case "masterThief":
        return {
          name: "Lockpick",
          description: "Prevent one sabotage during the next task phase.",
          buttonText: "Use Lockpick",
          needsTarget: false,
        };
      case "hacker":
        return {
          name: "Investigate",
          description: "Reveal a player's true alignment.",
          buttonText: "Investigate Player",
          needsTarget: true,
        };
      case "infiltrator":
        return {
          name: "Sabotage",
          description: "Sabotage the next task.",
          buttonText: "Sabotage",
          needsTarget: false,
        };
      case "doubleAgent":
        return {
          name: "Frame",
          description: "Make a player appear suspicious in the next investigation.",
          buttonText: "Frame Player",
          needsTarget: true,
        };
      default:
        return {
          name: "No Special Ability",
          description: "Civilian roles don't have special abilities.",
          buttonText: "Skip Night Phase",
          needsTarget: false,
        };
    }
  };
  
  const ability = getAbilityInfo();
  
  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayer(playerId);
  };
  
  const handleUseAbility = () => {
    // Here you would make a call to your backend/Convex
    setAbilityUsed(true);
  };
  
  const isTraitor = ["infiltrator", "doubleAgent"].includes(playerRole);
  
  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${isTraitor ? "bg-red-900/20" : "bg-blue-900/20"}`}>
        <h3 className="text-lg font-bold mb-2">
          {isTraitor ? "Traitor Phase" : "Hero Phase"}
        </h3>
        <p className="text-sm text-gray-300 mb-4">
          Use your abilities secretly. Other players can't see what you do.
        </p>
        
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-1">Your Ability: {ability.name}</h4>
          <p className="text-sm text-gray-400">{ability.description}</p>
        </div>
        
        {ability.needsTarget && (
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">Select a target:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {players
                .filter((p) => p.isAlive && p.id !== "1") // Filter out yourself and dead players
                .map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                      selectedPlayer === player.id
                        ? isTraitor 
                          ? "bg-red-900/40 border border-red-500/40" 
                          : "bg-blue-900/40 border border-blue-500/40"
                        : "bg-black/40 hover:bg-gray-800/60"
                    }`}
                    onClick={() => handleSelectPlayer(player.id)}
                  >
                    <div className="text-2xl mr-2">{player.avatar}</div>
                    <div className="font-medium">{player.name}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        <Button
          className={`w-full py-4 ${
            isTraitor
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleUseAbility}
          disabled={ability.needsTarget && !selectedPlayer || abilityUsed}
        >
          {abilityUsed ? "Ability Used" : ability.buttonText}
        </Button>
      </div>
      
      {isTraitor && (
        <div className="bg-red-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Traitor Chat</h3>
          <div className="bg-black/30 p-2 rounded mb-3 text-sm">
            <div className="text-gray-400">System:</div>
            <div>Other traitors in the game: Player 6 (Double Agent)</div>
          </div>
          <div className="bg-black/30 p-2 rounded mb-3 text-sm">
            <div className="text-red-400">Player 6:</div>
            <div>I'll pretend to complete tasks. You should sabotage them.</div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Message traitors..."
              className="flex-1 bg-black/50 border border-red-900/30 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <Button className="bg-red-600 hover:bg-red-700">Send</Button>
          </div>
        </div>
      )}
    </div>
  );
} 