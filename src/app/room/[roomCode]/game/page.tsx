"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import NightPhase from "@/components/game/NightPhase";
import DayPhase from "@/components/game/DayPhase";
import TaskPhase from "@/components/game/TaskPhase";
import PlayerList from "@/components/game/PlayerList";
import GameInfo from "@/components/game/GameInfo";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { GamePhase, PlayerUI, RoleInfo, PlayerModel, RoomModel } from "@/lib/types";
import { safeApi } from "@/lib/safeApi";

const roleInfoMap: Record<string, RoleInfo> = {
  masterThief: {
    name: "Master Thief",
    description: "You know one innocent player. You can lockpick to delay sabotage once per game.",
    alignment: "hero",
    color: "blue"
  },
  hacker: {
    name: "Hacker",
    description: "You can reveal a player's true alignment once per game.",
    alignment: "hero",
    color: "cyan"
  },
  infiltrator: {
    name: "Infiltrator",
    description: "You can sabotage tasks secretly and frame a player as suspicious.",
    alignment: "traitor",
    color: "red"
  },
  doubleAgent: {
    name: "Double Agent",
    description: "You appear innocent in investigations and can fake task completion.",
    alignment: "traitor",
    color: "pink"
  },
  civilian: {
    name: "Civilian",
    description: "Complete tasks to help the team win the heist.",
    alignment: "neutral",
    color: "gray"
  }
};

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const roomCode = params.roomCode as string;
  const { user } = useUser();
  
  // Get room data
  const room = useQuery(safeApi(api).rooms.getRoomByCode, { code: roomCode });
  
  // Get players in the game
  const playersInRoom = useQuery(safeApi(api).rooms.getPlayersInRoom, 
    room ? { roomId: room?._id } : 'skip'
  ) || [];
  
  // Check if room is in 'playing' status
  useEffect(() => {
    if (room && room.status !== "playing") {
      router.push(`/room/${roomCode}`);
    }
  }, [room, roomCode, router]);
  
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("night");
  const [round, setRound] = useState(1);
  const [phaseTime, setPhaseTime] = useState(60); // seconds
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksSabotaged, setTasksSabotaged] = useState(0);
  const [playerRole, setPlayerRole] = useState("masterThief");
  const [playerAlignment, setPlayerAlignment] = useState("hero");
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  // For demo purposes, auto-advance phases
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPhase === "night") {
        setCurrentPhase("day");
      } else if (currentPhase === "day") {
        setCurrentPhase("task");
      } else if (currentPhase === "task") {
        if (round < 3) {
          setRound(round + 1);
          setCurrentPhase("night");
        } else {
          setCurrentPhase("end");
        }
      }
    }, phaseTime * 1000);

    return () => clearTimeout(timer);
  }, [currentPhase, round]);

  // Countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setPhaseTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [currentPhase]);

  // Reset phase time when phase changes
  useEffect(() => {
    // Different phases have different times
    if (currentPhase === "night") {
      setPhaseTime(45);
    } else if (currentPhase === "day") {
      setPhaseTime(90);
    } else if (currentPhase === "task") {
      setPhaseTime(60);
    }
  }, [currentPhase]);

  const getRoleInfo = () => {
    return roleInfoMap[playerRole] || roleInfoMap.civilian;
  };

  const roleInfo = getRoleInfo();

  const toggleRoleInfo = () => {
    setShowRoleInfo(!showRoleInfo);
  };
  
  // Map database players to UI player objects
  const gamePlayers: PlayerUI[] = playersInRoom.map((player: PlayerModel) => ({
    id: player._id,
    name: player.userId === user?.id ? 'You' : `Player ${player._id.substring(0,4)}`,
    isAlive: player.isAlive,
    role: player.role || 'unknown',
    avatar: '👤'
  }));

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case "night":
        return <NightPhase playerRole={playerRole} players={gamePlayers} />;
      case "day":
        return <DayPhase players={gamePlayers.filter((p: PlayerUI) => p.isAlive)} />;
      case "task":
        return <TaskPhase onComplete={() => setTasksCompleted(tasksCompleted + 1)} />;
      case "end":
        return (
          <div className="text-center py-12 space-y-6">
            <h2 className="text-4xl font-bold text-green-400">Heroes Win!</h2>
            <p className="text-xl">The heist was successful and all traitors were identified.</p>
            <Button 
              onClick={() => router.push("/")}
              className="mt-6 bg-blue-600 hover:bg-blue-700"
            >
              Back to Lobby
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Loading state
  if (room === undefined || !playersInRoom) {
    return <div>Loading game data...</div>;
  }
  
  // Room not found or not in playing state
  if (room === null || room.status !== "playing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Game Not Available</h1>
          <p>This game room is not active.</p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Shadow Heist</h1>
            <div className="text-sm text-gray-400">Room: {roomCode}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/10">
              <div className="text-sm text-gray-400">Phase</div>
              <div className="font-semibold capitalize">{currentPhase}</div>
            </div>
            
            <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/10">
              <div className="text-sm text-gray-400">Round</div>
              <div className="font-semibold">{round}/3</div>
            </div>
            
            <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/10">
              <div className="text-sm text-gray-400">Time</div>
              <div className="font-semibold">{phaseTime}s</div>
            </div>
            
            <Button
              variant="outline"
              className="border-white/20 bg-black/30 hover:bg-black/50 text-gray-300"
              onClick={toggleRoleInfo}
            >
              Your Role
            </Button>
          </div>
        </div>
        
        {/* Role Info Modal */}
        {showRoleInfo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className={`bg-gray-900 border-2 border-${roleInfo?.color}-500/50 rounded-xl p-6 max-w-md w-full`}>
              <h3 className={`text-2xl font-bold mb-2 text-${roleInfo?.color}-400`}>
                {roleInfo?.name}
              </h3>
              <div className={`inline-block px-2 py-1 rounded text-sm mb-4 bg-${roleInfo?.color}-900/30 text-${roleInfo?.color}-300`}>
                {roleInfo?.alignment.toUpperCase()}
              </div>
              <p className="text-gray-300 mb-6">{roleInfo?.description}</p>
              <div className="text-sm text-gray-400 mb-2">Known information:</div>
              <div className="bg-black/30 p-3 rounded mb-6 text-sm">
                {playerRole === "masterThief" ? (
                  <p>Player 2 is innocent.</p>
                ) : (
                  <p>Use your special abilities during night phase.</p>
                )}
              </div>
              <Button 
                className="w-full bg-gray-800 hover:bg-gray-700"
                onClick={toggleRoleInfo}
              >
                Close
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="lg:w-3/4 bg-black/30 border border-white/10 rounded-xl p-6 min-h-[600px]">
            <div className="text-2xl font-bold mb-6 capitalize">
              {currentPhase} Phase
            </div>
            
            {renderCurrentPhase()}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Game Info */}
            <GameInfo 
              tasksCompleted={tasksCompleted} 
              tasksSabotaged={tasksSabotaged} 
            />
            
            {/* Player List */}
            <PlayerList players={gamePlayers} />
          </div>
        </div>
      </div>
    </main>
  );
} 