import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { ProfileForm } from "@/components/ProfileForm";

/**
 * User profile page for editing personal information
 */
export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-verse-deep via-verse-primary to-verse-deep/90">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-verse-deep mb-2">
              Your Profile
            </h1>
            <p className="text-verse-deep/70">
              Fill out your information to help your neighbors get to know you
            </p>
          </div>

          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
