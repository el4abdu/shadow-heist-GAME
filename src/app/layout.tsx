import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthWrapper from "@/components/AuthWrapper";
import { ClerkProvider } from "@clerk/nextjs";
import { FirebaseProvider } from "@/components/FirebaseProvider";

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
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}>
          <FirebaseProvider>
            <AuthWrapper>{children}</AuthWrapper>
          </FirebaseProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
