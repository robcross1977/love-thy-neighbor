import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    // Add any experimental features here if needed
  },

  // Environment variable configuration
  env: {
    // Ensure NEXTAUTH_URL uses HTTPS in production
    NEXTAUTH_URL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXTAUTH_URL?.replace("http://", "https://") ||
          process.env.NEXTAUTH_URL
        : process.env.NEXTAUTH_URL,
  },

  // Image optimization
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Security headers for production
  async headers() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Forwarded-Proto",
              value: "https",
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
