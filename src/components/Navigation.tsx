"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Navigation component that shows appropriate links based on user permissions
 */
export default function Navigation() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === "loading") return;

      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/admin/check");
        const data = await response.json();
        setIsAdmin(data.isAdmin || false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [session, status]);

  return (
    <nav className="flex items-center space-x-8 py-3">
      <Link
        href="/causes"
        className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Volunteer for Lawn Care
      </Link>
      <Link
        href="/create"
        className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Request Lawn Care
      </Link>
      <Link
        href="/my-requests"
        className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
      >
        My Requests
      </Link>
      {!loading && isAdmin && (
        <Link
          href="/admin"
          className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Admin
        </Link>
      )}
    </nav>
  );
}
