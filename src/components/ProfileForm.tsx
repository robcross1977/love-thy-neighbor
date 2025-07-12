"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, User, Star } from "lucide-react";
import { User as UserType } from "@prisma/client";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  address: z.string().max(200, "Address too long").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: UserType;
}

/**
 * Form component for editing user profile information
 */
export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
      address: user.address || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        setMessage({ type: "success", text: "Profile updated successfully!" });
        reset(data); // Reset form with new values
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error instanceof Error ? error.message : "Failed to update profile",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-verse-deep">
            <Star className="h-5 w-5" />
            Community Standing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-verse-primary">
                {user.rating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-verse-primary">
                {user.totalRatings}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
          </div>
          {user.isVerified && (
            <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
              <span className="text-green-700 font-medium">
                ✓ Community Verified
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-verse-deep">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Display Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="How should neighbors know you?"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="Optional - for urgent requests"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Tell your neighbors a bit about yourself, your skills, or what kind of help you can offer..."
                rows={4}
                className={errors.bio ? "border-red-500" : ""}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
              <p className="text-xs text-gray-500">
                {watch("bio")?.length || 0}/500 characters
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                General Area
              </Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="e.g., 'Downtown Purcell' or 'East Lexington'"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Optional - helps neighbors find relevant requests
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={!isDirty || isPending}
                className="w-full bg-verse-primary hover:bg-verse-deep"
              >
                {isPending ? "Updating..." : "Update Profile"}
              </Button>

              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
