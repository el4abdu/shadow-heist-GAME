"use client";

import React from "react";

type GameInfoProps = {
  tasksCompleted: number;
  tasksSabotaged: number;
};

export default function GameInfo({ tasksCompleted, tasksSabotaged }: GameInfoProps) {
  // Total tasks needed to win/lose
  const totalTasksNeeded = 3;
  
  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-4">
      <h2 className="text-lg font-bold mb-3">Heist Progress</h2>
      
      <div className="space-y-4">
        {/* Tasks Completed */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-400">Tasks Completed</span>
            <span>{tasksCompleted}/{totalTasksNeeded}</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(tasksCompleted / totalTasksNeeded) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Complete {totalTasksNeeded} tasks to win
          </div>
        </div>
        
        {/* Tasks Sabotaged */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-400">Tasks Sabotaged</span>
            <span>{tasksSabotaged}/{totalTasksNeeded}</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${(tasksSabotaged / totalTasksNeeded) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {totalTasksNeeded} sabotages = traitors win
          </div>
        </div>
        
        {/* Role Distribution */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Roles</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-400">Heroes:</span>
              <span>2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400">Traitors:</span>
              <span>2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Civilians:</span>
              <span>2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Total:</span>
              <span>6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 