import type { Metadata } from "next";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import Navigation from "@/components/Navigation";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Love Thy Neighbor - Community Help Network",
  description:
    "Connect with neighbors to give and receive help in your community. From lawn care to medical assistance, we're here to help each other.",
  keywords: [
    "community",
    "help",
    "neighbors",
    "assistance",
    "volunteer",
    "local",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              {/* Top row: Brand and Auth */}
              <div className="verse-container flex h-14 items-center justify-between">
                <Link className="flex items-center space-x-2" href="/">
                  <span
                    className="font-bold text-xl"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Love Thy Neighbor
                  </span>
                </Link>
                <AuthButton />
              </div>

              {/* Bottom row: Navigation */}
              <div className="border-t border-border/20">
                <div className="verse-container">
                  <Navigation />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="verse-container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built with love for the community. Inspired by the VerseVibe
                    family of apps.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
