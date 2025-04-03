import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HowToPlay() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/Assets/logo.png" 
              alt="Shadow Heist Logo" 
              width={120} 
              height={120}
              className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500">
            HOW TO PLAY
          </h1>
          <p className="text-xl text-gray-300">
            Master the art of deception and strategy
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-3xl font-bold text-blue-400">Game Overview</h2>
          <p className="text-gray-300">
            Shadow Heist is a social deduction game where a group of thieves plan the perfect heist. However, among them are Traitors working for the security force. Players must complete tasks while uncovering the Traitors before time runs out.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-400">Roles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 rounded-xl p-6 border border-blue-900/40">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Hero Roles</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-blue-300">Master Thief</h4>
                  <p className="text-gray-400">Knows one innocent player's identity. Can "lockpick" to delay sabotage once per game.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-blue-300">Hacker</h4>
                  <p className="text-gray-400">Can reveal a player's true alignment once per game.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-red-900/40">
              <h3 className="text-xl font-bold text-red-400 mb-2">Traitor Roles</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-red-300">Infiltrator</h4>
                  <p className="text-gray-400">Sabotages tasks secretly. Can frame a player as suspicious once per game.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-red-300">Double Agent</h4>
                  <p className="text-gray-400">Appears innocent in investigations. Can fake completing tasks.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-gray-800 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-400 mb-2">Neutral Roles</h3>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-300">Civilians (2)</h4>
                <p className="text-gray-400">Must complete tasks to win, but can be framed by Traitors.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-green-400">Game Phases</h2>
          
          <div className="space-y-6">
            <div className="bg-black/40 rounded-xl p-6 border border-indigo-900/40">
              <h3 className="text-xl font-bold text-indigo-400 mb-2">Night Phase</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Traitors sabotage tasks or frame players</li>
                <li>Heroes use their special abilities</li>
                <li>Actions are performed secretly</li>
              </ul>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-amber-900/40">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Day Phase</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Players debate suspicions and share information</li>
                <li>Vote to banish one suspected player</li>
                <li>Banished player's role is revealed</li>
              </ul>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-emerald-900/40">
              <h3 className="text-xl font-bold text-emerald-400 mb-2">Task Phase</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Complete minigames like wiring puzzles or hacking challenges</li>
                <li>Successful tasks progress the heist</li>
                <li>Sabotaged tasks set back progress</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-3xl font-bold text-pink-400">Win Conditions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 rounded-xl p-6 border border-blue-900/40">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Heroes & Civilians Win If:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Complete 3 tasks before time ends</li>
                <li>OR identify and banish all Traitors</li>
              </ul>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-red-900/40">
              <h3 className="text-xl font-bold text-red-400 mb-2">Traitors Win If:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Successfully sabotage 3 tasks</li>
                <li>OR outnumber the remaining players</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="pt-8 flex justify-center">
          <Link href="/">
            <Button
              className="text-lg py-4 px-8 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 border-0 rounded-lg"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 