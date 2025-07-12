import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";

/**
 * Get the current authenticated user session from Auth0
 */
export async function getCurrentSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return {
    auth0Id: session.user.id, // Auth0 sub field
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  };
}

/**
 * Get or create user record from Auth0 session
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session?.auth0Id) {
    return null;
  }

  try {
    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { id: session.auth0Id },
    });

    // Create user record if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.auth0Id,
          name: session.name || null,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

/**
 * Check if the current user is an admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.isAdmin ?? false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Throw an error if the current user is not an admin
 */
export async function requireAdmin() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error("Admin access required");
  }
}

/**
 * Get current user info for admin purposes
 */
export async function getCurrentUserInfo() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const user = await getCurrentUser();

  return {
    ...session,
    isAdmin: user?.isAdmin ?? false,
  };
}
