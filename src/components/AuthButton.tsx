"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { User } from "lucide-react";

/**
 * Authentication button component that shows sign in/out based on session state
 */
export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          Welcome, {session.user?.name || session.user?.email || "Friend"}
        </span>
        <Link href="/profile">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </Button>
        </Link>
        <Button onClick={() => signOut()} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("auth0")} size="sm">
      Sign In
    </Button>
  );
}
