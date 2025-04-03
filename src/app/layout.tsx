import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadow Heist",
  description: "A multiplayer game of deception and strategy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Z2VuZXJvdXMtcXVhZ2dhLTI4LmNsZXJrLmFjY291bnRzLmRldiQ"}>
      <ConvexClientProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
