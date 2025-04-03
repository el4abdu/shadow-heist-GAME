"use client";

import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const { openSignIn, openSignUp } = useClerk();
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  
  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-pulse text-indigo-400 text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <>
      {/* Auth Menu Button */}
      <div className="fixed top-4 right-4 z-50">
        {isSignedIn ? (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-full shadow-lg"
              onClick={() => setShowAuthMenu(!showAuthMenu)}
            >
              <img 
                src={user?.imageUrl || '/placeholder-avatar.png'} 
                alt="Profile" 
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">{user?.firstName || 'User'}</span>
            </motion.button>
            
            <AnimatePresence>
              {showAuthMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-700">
                    <div className="font-medium">{user?.fullName || 'User'}</div>
                    <div className="text-xs text-gray-400">{user?.primaryEmailAddress?.emailAddress}</div>
                  </div>
                  
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg"
              onClick={() => openSignIn()}
            >
              Login
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg"
              onClick={() => openSignUp()}
            >
              Register
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      {isSignedIn ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
          <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-xl shadow-2xl">
            <div className="text-center mb-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-6"
              >
                <Image 
                  src="/Assets/logo.png" 
                  alt="Shadow Heist Logo" 
                  width={150} 
                  height={150}
                  className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                />
              </motion.div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                Shadow Heist
              </h1>
              <p className="mt-2 text-gray-300">
                A multiplayer game of deception and strategy
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-center">
                Sign in or create an account to play with friends
              </p>
              
              <div className="flex flex-col gap-3 mt-6">
                <Button
                  onClick={() => openSignIn()}
                  className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </Button>
                
                <Button
                  onClick={() => openSignUp()}
                  className="w-full py-6 text-lg bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700"
                >
                  Create Account
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-6">
                Sign up to create rooms, join games, and track your progress!
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 