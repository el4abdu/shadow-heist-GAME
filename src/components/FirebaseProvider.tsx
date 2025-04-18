"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { app, db, auth, analytics } from '@/lib/firebase';

interface FirebaseContextType {
  app: typeof app;
  db: typeof db;
  auth: typeof auth;
  analytics: typeof analytics;
  firebaseUser: any | null;
  firebaseLoaded: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setFirebaseUser(user);
      setFirebaseLoaded(true);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  const value = {
    app,
    db,
    auth,
    analytics,
    firebaseUser,
    firebaseLoaded
  };
  
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
} 