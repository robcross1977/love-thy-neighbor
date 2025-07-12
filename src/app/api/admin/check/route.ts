import { NextResponse } from "next/server";
import {
  getCurrentUser,
  isCurrentUserAdmin,
  getCurrentSession,
} from "@/lib/auth-utils";

/**
 * Check if the current user has admin privileges
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    const session = await getCurrentSession();
    const isAdmin = await isCurrentUserAdmin();

    return NextResponse.json({
      isAdmin,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: session?.email,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 }
    );
  }
}
