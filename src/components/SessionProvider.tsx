"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Session provider wrapper for NextAuth v5
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
