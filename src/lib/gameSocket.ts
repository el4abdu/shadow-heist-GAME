// gameSocket.ts - Enhanced real-time multiplayer connection

import { useEffect, useRef, useState } from 'react';

export type GameEvent = {
  type: 'player_join' | 'player_leave' | 'player_ready' | 'game_start' | 'phase_change' | 'player_action' | 'chat_message';
  payload: any;
  timestamp: number;
  senderId: string;
};

type GameSocketOptions = {
  roomCode: string;
  userId: string;
  onEvent: (event: GameEvent) => void;
  reconnectInterval?: number;
};

export function useGameSocket({ roomCode, userId, onEvent, reconnectInterval = 3000 }: GameSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // The sendEvent function for sending events to other players
  const sendEvent = (event: Omit<GameEvent, 'timestamp' | 'senderId'>) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setConnectionError('Socket not connected');
      return false;
    }

    const fullEvent: GameEvent = {
      ...event,
      timestamp: Date.now(),
      senderId: userId,
    };

    try {
      socketRef.current.send(JSON.stringify(fullEvent));
      return true;
    } catch (err) {
      setConnectionError('Failed to send event');
      return false;
    }
  };

  // Initialize socket connection
  useEffect(() => {
    // This would be replaced with your actual WebSocket server URL
    const wsUrl = `wss://your-websocket-server.com/game/${roomCode}?userId=${userId}`;
    
    const connectSocket = () => {
      // Close existing socket if it exists
      if (socketRef.current) {
        socketRef.current.close();
      }

      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      setConnectionError(null);
      
      // Create new WebSocket connection
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log('Game socket connected');
      };
      
      socket.onmessage = (event) => {
        try {
          const gameEvent = JSON.parse(event.data) as GameEvent;
          onEvent(gameEvent);
        } catch (err) {
          console.error('Failed to parse socket message', err);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error');
      };
      
      socket.onclose = (event) => {
        setIsConnected(false);
        console.log('Game socket closed', event.code, event.reason);
        
        // Attempt to reconnect unless this was a normal closure
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectSocket();
          }, reconnectInterval);
        }
      };
    };
    
    connectSocket();
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [roomCode, userId, reconnectInterval, onEvent]);
  
  return {
    isConnected,
    connectionError,
    sendEvent
  };
} 