import { auth, signIn, signOut } from "../../auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { User } from "lucide-react";

export default async function AuthButton() {
  const session = await auth();

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
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit" variant="outline" size="sm">
            Sign Out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit" size="sm">
        Sign In with Google
      </Button>
    </form>
  );
}
