import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-5xl w-full text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            SHADOW HEIST
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            A multiplayer game of deception, strategy, and cunning heists
          </p>
        </div>

        <div className="flex flex-col gap-8 max-w-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/create-room" className="w-full" passHref>
              <Button 
                className="text-xl py-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all duration-300 border-0 rounded-lg"
              >
                Create Room
              </Button>
            </Link>
            <Link href="/join-room" className="w-full" passHref>
              <Button 
                className="text-xl py-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 transition-all duration-300 border-0 rounded-lg"
              >
                Join Room
              </Button>
            </Link>
          </div>
          <Link href="/how-to-play" className="w-full" passHref>
            <Button 
              variant="outline" 
              className="text-lg py-4 border-white/20 bg-black/30 hover:bg-black/50 transition-all duration-300 text-gray-300 rounded-lg w-full"
            >
              How To Play
            </Button>
          </Link>
        </div>

        <div className="pt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 border border-white/10 p-6 rounded-xl hover:bg-black/70 transition-all duration-300">
              <h3 className="text-xl font-bold mb-2 text-purple-400">Steal The Loot</h3>
              <p className="text-gray-400">Complete tasks with your team to progress through the heist.</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-6 rounded-xl hover:bg-black/70 transition-all duration-300">
              <h3 className="text-xl font-bold mb-2 text-red-400">Trust No One</h3>
              <p className="text-gray-400">Traitors lurk among you. Vote to banish the suspected saboteurs.</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-6 rounded-xl hover:bg-black/70 transition-all duration-300">
              <h3 className="text-xl font-bold mb-2 text-blue-400">Use Your Skills</h3>
              <p className="text-gray-400">Each role has unique abilities. Master them to win the game.</p>
            </div>
          </div>
        </div>

        <footer className="text-gray-500 text-sm mt-12">
          © 2025 Shadow Heist | The Ultimate Social Deduction Game
        </footer>
      </div>
    </main>
  );
}
