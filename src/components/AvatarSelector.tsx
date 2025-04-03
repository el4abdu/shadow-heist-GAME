"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface AvatarSelectorProps {
  onSelect: (avatarId: number) => void;
  initialAvatarId?: number;
  usedAvatarIds?: number[];
  isSelectable?: boolean;
}

export default function AvatarSelector({ onSelect, initialAvatarId, usedAvatarIds = [], isSelectable = true }: AvatarSelectorProps) {
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | undefined>(initialAvatarId);
  const [showSelector, setShowSelector] = useState(false);
  
  // Total number of available avatars
  const totalAvatars = 18;
  
  // Generate array of all avatar IDs
  const allAvatarIds = Array.from({ length: totalAvatars }, (_, i) => i + 1);
  
  // Handle avatar selection
  const handleSelectAvatar = (avatarId: number) => {
    if (!isSelectable || usedAvatarIds.includes(avatarId)) return;
    
    setSelectedAvatarId(avatarId);
    onSelect(avatarId);
    setShowSelector(false);
  };
  
  // Random avatar button handler
  const selectRandomAvatar = () => {
    const availableAvatars = allAvatarIds.filter(id => !usedAvatarIds.includes(id));
    if (availableAvatars.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableAvatars.length);
      const randomId = availableAvatars[randomIndex];
      setSelectedAvatarId(randomId);
      onSelect(randomId);
    }
  };
  
  return (
    <div className="relative">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => isSelectable && setShowSelector(!showSelector)} 
        className={`overflow-hidden rounded-full border-4 ${selectedAvatarId ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' : 'border-gray-700'} ${isSelectable ? 'cursor-pointer hover:border-indigo-400' : ''} w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900`}
      >
        {selectedAvatarId ? (
          <img 
            src={`/Avatars/Avatar (${selectedAvatarId}).png`} 
            alt="Selected avatar" 
            className="w-16 h-16 object-cover"
          />
        ) : (
          <div className="text-3xl">👤</div>
        )}
      </motion.div>
      
      {showSelector && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute z-50 mt-2 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-indigo-500/20 shadow-xl max-w-[320px] w-[320px] -left-[150px]"
        >
          <h3 className="font-bold text-center mb-3 text-white">Choose Your Avatar</h3>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {allAvatarIds.map(avatarId => (
              <motion.div 
                key={avatarId}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelectAvatar(avatarId)}
                className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 relative
                  ${selectedAvatarId === avatarId ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-transparent'} 
                  ${usedAvatarIds.includes(avatarId) 
                    ? 'opacity-40 cursor-not-allowed grayscale' 
                    : 'cursor-pointer hover:border-indigo-400 shadow-md hover:shadow-indigo-500/20'}`}
              >
                <img 
                  src={`/Avatars/Avatar (${avatarId}).png`} 
                  alt={`Avatar ${avatarId}`} 
                  className="w-10 h-10 object-cover"
                />
                {usedAvatarIds.includes(avatarId) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-bold rounded-full">
                    ✕
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="default"
              onClick={selectRandomAvatar}
              className="w-full text-xs py-5 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 border-0"
            >
              Random
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setShowSelector(false)}
              className="w-full text-xs py-5 border border-gray-700 bg-gray-800/50"
            >
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
} 