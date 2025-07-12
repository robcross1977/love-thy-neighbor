import Link from "next/link";
import { isCurrentUserAdmin } from "@/lib/auth-utils";

/**
 * Navigation component that shows appropriate links based on user permissions
 */
export default async function Navigation() {
  const isAdmin = await isCurrentUserAdmin();

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
      {isAdmin && (
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
