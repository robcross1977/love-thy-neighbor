import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import type { NextAuthConfig } from "next-auth";

/**
 * Validates required environment variables for Auth0 configuration
 * Throws descriptive errors if any required variables are missing
 */
const validateAuthEnvironment = () => {
  const requiredVars = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}. ` +
        "Please check your .env.local file and ensure all Auth0 variables are set."
    );
  }

  return requiredVars as Record<string, string>;
};

// Validate environment variables at module load time
const authEnv = validateAuthEnvironment();

export const config = {
  // Force trust host in production and development
  trustHost: true,
  providers: [
    Auth0({
      clientId: authEnv.AUTH0_CLIENT_ID,
      clientSecret: authEnv.AUTH0_CLIENT_SECRET,
      issuer: authEnv.AUTH0_DOMAIN,
      wellKnown: `${authEnv.AUTH0_DOMAIN}/.well-known/openid_configuration`,
    }),
  ],
  callbacks: {
    session({ session, token }) {
      // Use email as consistent user ID to avoid Auth0 sub changes
      // This ensures the same user always gets the same ID
      if (session.user?.email) {
        session.user.id = session.user.email;
      } else if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, account }) {
      // Persist the OAuth account info to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    redirect({ url, baseUrl }) {
      // Ensure redirects use HTTPS in production
      if (process.env.NODE_ENV === "production") {
        // If the URL is relative, prepend the base URL
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }
        // If the URL is absolute but uses HTTP, convert to HTTPS
        if (url.startsWith("http://")) {
          return url.replace("http://", "https://");
        }
      }
      return url;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  debug: process.env.NODE_ENV === "development",
  // Remove custom pages to use NextAuth.js defaults
  // pages: {
  //   signIn: "/auth/signin",
  //   error: "/auth/error",
  // },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
