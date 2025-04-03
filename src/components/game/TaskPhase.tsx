"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type TaskPhaseProps = {
  onComplete: () => void;
};

type TaskType = "wiring" | "hacking" | "keypad";

export default function TaskPhase({ onComplete }: TaskPhaseProps) {
  const [currentTask, setCurrentTask] = useState<TaskType>("wiring");
  const [completed, setCompleted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  
  // Wiring task state
  const [wires, setWires] = useState([
    { id: 1, color: "red", connected: false },
    { id: 2, color: "blue", connected: false },
    { id: 3, color: "green", connected: false },
    { id: 4, color: "yellow", connected: false },
  ]);
  const [selectedWire, setSelectedWire] = useState<number | null>(null);
  
  // Hacking task state
  const [code, setCode] = useState("");
  const [targetCode, setTargetCode] = useState("1337");
  
  // Keypad task state
  const [keypadSequence, setKeypadSequence] = useState<number[]>([]);
  const [targetSequence, setTargetSequence] = useState([1, 4, 2, 3]);
  
  useEffect(() => {
    // Check if task is complete
    if (currentTask === "wiring" && wires.every(w => w.connected)) {
      setTimeout(() => {
        setCompleted(true);
        onComplete();
      }, 500);
    }
    
    if (currentTask === "hacking" && code === targetCode) {
      setTimeout(() => {
        setCompleted(true);
        onComplete();
      }, 500);
    }
    
    if (currentTask === "keypad" && 
        keypadSequence.length === targetSequence.length && 
        keypadSequence.every((val, idx) => val === targetSequence[idx])) {
      setTimeout(() => {
        setCompleted(true);
        onComplete();
      }, 500);
    }
  }, [wires, code, keypadSequence, currentTask, onComplete, targetCode, targetSequence]);
  
  // Track progress
  useEffect(() => {
    if (currentTask === "wiring") {
      const connectedCount = wires.filter(w => w.connected).length;
      setProgressPercent((connectedCount / wires.length) * 100);
    }
    
    if (currentTask === "hacking") {
      let correctChars = 0;
      for (let i = 0; i < code.length; i++) {
        if (code[i] === targetCode[i]) correctChars++;
      }
      setProgressPercent((correctChars / targetCode.length) * 100);
    }
    
    if (currentTask === "keypad") {
      let correctCount = 0;
      for (let i = 0; i < keypadSequence.length; i++) {
        if (keypadSequence[i] === targetSequence[i]) correctCount++;
        else break; // Stop counting at first mistake
      }
      setProgressPercent((correctCount / targetSequence.length) * 100);
    }
  }, [wires, code, keypadSequence, currentTask, targetCode, targetSequence]);
  
  // Wire task handlers
  const handleWireClick = (wireId: number) => {
    if (completed) return;
    
    if (selectedWire === null) {
      setSelectedWire(wireId);
    } else if (selectedWire !== wireId) {
      // Connect wires
      setWires(
        wires.map(wire => 
          wire.id === selectedWire || wire.id === wireId
            ? { ...wire, connected: true }
            : wire
        )
      );
      setSelectedWire(null);
    }
  };
  
  // Hacking task handlers
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (completed) return;
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setCode(value);
  };
  
  // Keypad task handlers
  const handleKeyPress = (num: number) => {
    if (completed) return;
    if (keypadSequence.length < targetSequence.length) {
      setKeypadSequence([...keypadSequence, num]);
    }
  };
  
  const resetKeypad = () => {
    setKeypadSequence([]);
  };
  
  const renderTask = () => {
    switch (currentTask) {
      case "wiring":
        return (
          <div className="p-6 bg-gray-900/60 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Connect the Wires</h3>
            <p className="text-sm text-gray-400 mb-6">
              Click two wires of the same color to connect them.
            </p>
            
            <div className="grid grid-cols-2 gap-10 mb-6">
              {/* Left side wires */}
              <div className="space-y-4">
                {wires.map(wire => (
                  <div 
                    key={wire.id}
                    className={`h-12 flex items-center ${wire.connected ? "opacity-50" : ""}`}
                  >
                    <div
                      className={`w-24 h-4 rounded-r-full cursor-pointer ${
                        selectedWire === wire.id ? "ring-2 ring-white" : ""
                      } bg-${wire.color}-500`}
                      onClick={() => handleWireClick(wire.id)}
                    ></div>
                    {wire.connected && (
                      <div className={`flex-1 h-1 bg-${wire.color}-500`}></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Right side connectors (shuffled) */}
              <div className="space-y-4">
                {[...wires].reverse().map(wire => (
                  <div 
                    key={wire.id}
                    className={`h-12 flex items-center justify-end ${wire.connected ? "opacity-50" : ""}`}
                  >
                    {wire.connected && (
                      <div className={`flex-1 h-1 bg-${wire.color}-500`}></div>
                    )}
                    <div
                      className={`w-24 h-4 rounded-l-full cursor-pointer ${
                        selectedWire === wire.id ? "ring-2 ring-white" : ""
                      } bg-${wire.color}-500`}
                      onClick={() => handleWireClick(wire.id)}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case "hacking":
        return (
          <div className="p-6 bg-gray-900/60 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Hack the System</h3>
            <p className="text-sm text-gray-400 mb-6">
              Enter the correct access code: {targetCode}
            </p>
            
            <div className="mb-6">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                className="w-full bg-black/50 border border-cyan-900/30 text-center font-mono text-2xl tracking-widest py-3 rounded"
                maxLength={4}
                placeholder="0000"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                <button
                  key={num}
                  className="bg-cyan-900/20 hover:bg-cyan-900/40 rounded p-3 text-lg font-bold"
                  onClick={() => setCode((prev) => (prev.length < 4 ? prev + num : prev))}
                >
                  {num}
                </button>
              ))}
              <button
                className="bg-red-900/20 hover:bg-red-900/40 rounded p-3 text-lg font-bold"
                onClick={() => setCode("")}
              >
                Clear
              </button>
            </div>
          </div>
        );
        
      case "keypad":
        return (
          <div className="p-6 bg-gray-900/60 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Enter the Keypad Sequence</h3>
            <p className="text-sm text-gray-400 mb-4">
              Press the buttons in this order: {targetSequence.join(" → ")}
            </p>
            
            <div className="mb-4 flex justify-center">
              <div className="bg-black/40 p-2 rounded-lg min-h-12 min-w-32 flex items-center justify-center">
                <div className="text-xl font-mono tracking-wider">
                  {keypadSequence.length > 0 
                    ? keypadSequence.map((n, i) => (
                        <span 
                          key={i} 
                          className={i < targetSequence.length && n === targetSequence[i] 
                            ? "text-green-500" 
                            : "text-red-500"
                          }
                        >
                          {n}
                        </span>
                      )).reduce((prev, curr) => [prev, ' → ', curr] as any) 
                    : "_ _ _ _"}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  className="bg-purple-900/20 hover:bg-purple-900/40 rounded-lg p-4 text-xl font-bold"
                  onClick={() => handleKeyPress(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            
            <Button
              className="w-full py-2 bg-red-600 hover:bg-red-700"
              onClick={resetKeypad}
            >
              Reset
            </Button>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-emerald-900/10 p-4 rounded-lg border border-emerald-900/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-emerald-400">Task Phase</h3>
          
          {completed ? (
            <span className="px-2 py-1 bg-emerald-900/40 text-emerald-300 rounded text-sm">
              Completed
            </span>
          ) : (
            <span className="px-2 py-1 bg-amber-900/40 text-amber-300 rounded text-sm">
              In Progress
            </span>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-black/40 rounded-full mb-6">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        {/* Task selector */}
        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            className={`flex-1 ${currentTask === "wiring" ? "bg-emerald-900/30 border-emerald-500/30" : "bg-black/30"}`}
            onClick={() => !completed && setCurrentTask("wiring")}
          >
            Wiring
          </Button>
          <Button
            variant="outline"
            className={`flex-1 ${currentTask === "hacking" ? "bg-emerald-900/30 border-emerald-500/30" : "bg-black/30"}`}
            onClick={() => !completed && setCurrentTask("hacking")}
          >
            Hacking
          </Button>
          <Button
            variant="outline"
            className={`flex-1 ${currentTask === "keypad" ? "bg-emerald-900/30 border-emerald-500/30" : "bg-black/30"}`}
            onClick={() => !completed && setCurrentTask("keypad")}
          >
            Keypad
          </Button>
        </div>
        
        {/* Task content */}
        {renderTask()}
      </div>
    </div>
  );
} 