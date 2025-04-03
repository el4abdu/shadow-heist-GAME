"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-pink-600/20 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Image 
            src="/Assets/logo.png" 
            alt="Shadow Heist Logo" 
            width={180} 
            height={180}
            className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          />
        </motion.div>
        
        {isSignedIn && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-indigo-500/20"
          >
            <p className="text-xl">
              Welcome back, <span className="font-semibold text-indigo-400">{user?.firstName || 'Agent'}</span>!
            </p>
          </motion.div>
        )}
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
        >
          SHADOW HEIST
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="text-xl mb-12 text-gray-300"
        >
          A multiplayer game of deception and strategy
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
          {isSignedIn ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                whileHover={{ scale: 1.03 }}
                className="col-span-1"
              >
                <Link href="/create-room" className="block w-full">
                  <Button className="w-full py-8 text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg shadow-purple-700/20">
                    CREATE ROOM
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                whileHover={{ scale: 1.03 }}
                className="col-span-1"
              >
                <Link href="/join-room" className="block w-full">
                  <Button className="w-full py-8 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg shadow-blue-700/20">
                    JOIN ROOM
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                whileHover={{ scale: 1.03 }}
                className="col-span-1 md:col-span-2"
              >
                <Link href="/how-to-play" className="block w-full">
                  <Button variant="outline" className="w-full py-6 text-base font-medium border-white/20 bg-black/30 hover:bg-black/50 text-gray-300">
                    HOW TO PLAY
                  </Button>
                </Link>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              whileHover={{ scale: 1.03 }}
              className="col-span-1 md:col-span-2"
            >
              <Link href="/how-to-play" className="block w-full">
                <Button variant="outline" className="w-full py-6 text-base font-medium border-white/20 bg-black/30 hover:bg-black/50 text-gray-300">
                  HOW TO PLAY
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
    </div>
    </main>
  );
}
