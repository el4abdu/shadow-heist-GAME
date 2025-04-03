"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Fallback URL for development purposes only
const fallbackUrl = "https://reserved-sailfish-472.convex.cloud";

// Get the Convex URL from environment variables with fallback
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || fallbackUrl;

// Create a Convex client using the URL
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
} 