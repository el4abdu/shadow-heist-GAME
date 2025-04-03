"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

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
      <div 
        onClick={() => isSelectable && setShowSelector(!showSelector)} 
        className={`overflow-hidden rounded-full border-2 ${selectedAvatarId ? 'border-blue-500' : 'border-gray-300'} ${isSelectable ? 'cursor-pointer hover:border-blue-300' : ''} w-16 h-16 flex items-center justify-center`}
      >
        {selectedAvatarId ? (
          <img 
            src={`/Avatars/Avatar (${selectedAvatarId}).png`} 
            alt="Selected avatar" 
            className="w-14 h-14 object-cover"
          />
        ) : (
          <div className="text-3xl">👤</div>
        )}
      </div>
      
      {showSelector && (
        <div className="absolute z-10 mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
          <div className="grid grid-cols-6 gap-2 mb-3">
            {allAvatarIds.map(avatarId => (
              <div 
                key={avatarId}
                onClick={() => handleSelectAvatar(avatarId)}
                className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 
                  ${selectedAvatarId === avatarId ? 'border-blue-500' : 'border-transparent'} 
                  ${usedAvatarIds.includes(avatarId) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-blue-300'}`}
              >
                <img 
                  src={`/Avatars/Avatar (${avatarId}).png`} 
                  alt={`Avatar ${avatarId}`} 
                  className="w-8 h-8 object-cover"
                />
                {usedAvatarIds.includes(avatarId) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-bold">
                    Used
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={selectRandomAvatar}
              className="w-full text-xs"
            >
              Random
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowSelector(false)}
              className="w-full text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 