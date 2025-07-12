"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MapPin,
  Phone,
  Upload,
  X,
  Image,
  Scissors,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import React from "react";
import Link from "next/link";

const lawnCareRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  yardSize: z.string().min(1, "Please select yard size"),
  serviceType: z.string().min(1, "Please select service type"),
  frequency: z.string().min(1, "Please select frequency"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().min(10, "Please provide a valid phone number"),
  preferredTime: z.string().optional(),
  hasEquipment: z.string().min(1, "Please select equipment availability"),
  notes: z.string().optional(),
  urgency: z.enum(["low", "medium", "high", "urgent"]),
});

type LawnCareRequestForm = z.infer<typeof lawnCareRequestSchema>;

const yardSizes = [
  { value: "small", label: "Small (Under 1/4 acre)" },
  { value: "medium", label: "Medium (1/4 - 1/2 acre)" },
  { value: "large", label: "Large (1/2 - 1 acre)" },
  { value: "extra-large", label: "Extra Large (Over 1 acre)" },
];

const serviceTypes = [
  { value: "mowing-only", label: "🌱 Mowing Only" },
  { value: "mowing-edging", label: "✂️ Mowing + Edging" },
  { value: "full-service", label: "🌿 Full Service (Mowing, Edging, Cleanup)" },
  { value: "cleanup-only", label: "🍂 Cleanup Only (Leaves, Debris)" },
];

const frequencies = [
  { value: "one-time", label: "One-time help" },
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "seasonal", label: "Seasonal (as needed)" },
];

const urgencyLevels = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
];

export default function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const resolvedParams = React.use(params);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedYardSize, setSelectedYardSize] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalRequest, setOriginalRequest] = useState<Record<
    string,
    unknown
  > | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LawnCareRequestForm>({
    resolver: zodResolver(lawnCareRequestSchema),
  });

  const watchedDescription = watch("description");

  // Load existing request data
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/api/auth/signin");
      return;
    }

    loadRequestData(resolvedParams.id);
  }, [session, status, router, resolvedParams.id]);

  const loadRequestData = async (id: string) => {
    try {
      const response = await fetch(`/api/help-requests/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load request");
      }

      const request = data.request;
      setOriginalRequest(request);

      // Parse the notes field to extract form data
      const notesData = parseNotesField(request.notes || "");

      // Set form values
      setValue("title", request.title);
      setValue("description", request.description);
      setValue("address", request.address);
      setValue("latitude", request.latitude);
      setValue("longitude", request.longitude);
      setValue("phone", request.phoneNumber || "");
      setValue("urgency", request.urgency.toLowerCase());

      // Set parsed values from notes
      setValue("yardSize", notesData.yardSize || "medium");
      setValue("serviceType", notesData.serviceType || "mowing-only");
      setValue("frequency", notesData.frequency || "one-time");
      setValue("hasEquipment", notesData.hasEquipment || "no");
      setValue("preferredTime", notesData.preferredTime || "");
      setValue("notes", notesData.additionalNotes || "");

      // Set selected states for UI
      setSelectedYardSize(notesData.yardSize || "medium");
      setSelectedServiceType(notesData.serviceType || "mowing-only");
      setSelectedFrequency(notesData.frequency || "one-time");
      setSelectedUrgency(request.urgency.toLowerCase());

      // Set photo if exists
      if (request.photoUrl) {
        setPhotoPreview(request.photoUrl);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading request:", error);
      alert("Failed to load request data");
      router.push("/my-requests");
    }
  };

  const parseNotesField = (notes: string) => {
    const data: Record<string, string> = {};

    // Parse the notes field that was created in the format:
    // "Yard Size: small, Service: mowing-only, Frequency: weekly, Equipment Available: yes, Preferred Time: morning, Additional Notes: ..."

    const patterns = {
      yardSize: /Yard Size: ([^,]+)/,
      serviceType: /Service: ([^,]+)/,
      frequency: /Frequency: ([^,]+)/,
      hasEquipment: /Equipment Available: ([^,]+)/,
      preferredTime: /Preferred Time: ([^,]+)/,
      additionalNotes: /Additional Notes: (.+)$/,
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = notes.match(pattern);
      if (match) {
        data[key] = match[1].trim();
      }
    });

    return data;
  };

  // Update description length counter
  React.useEffect(() => {
    setDescriptionLength(watchedDescription?.length || 0);
  }, [watchedDescription]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      setUploadedPhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setUploadedPhoto(null);
    setPhotoPreview(null);
    const fileInput = document.getElementById(
      "photo-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude);
          setValue("longitude", position.coords.longitude);

          // Reverse geocode to get address
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          )
            .then((response) => response.json())
            .then((data) => {
              const address = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
              setValue("address", address);
            })
            .catch(() => {
              setValue(
                "address",
                `${position.coords.latitude}, ${position.coords.longitude}`
              );
            })
            .finally(() => {
              setIsGettingLocation(false);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);
          alert(
            "Unable to get your location. Please enter your address manually."
          );
        }
      );
    } else {
      setIsGettingLocation(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  const onSubmit = async (data: LawnCareRequestForm) => {
    try {
      let photoUrl = originalRequest?.photoUrl || null;

      // Upload photo if a new one was selected
      if (uploadedPhoto) {
        const photoFormData = new FormData();
        photoFormData.append("photo", uploadedPhoto);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: photoFormData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || "Failed to upload photo");
        }

        const uploadResult = await uploadResponse.json();
        photoUrl = uploadResult.url;
      }

      // Prepare update data
      const updateData = {
        title: data.title,
        description: data.description,
        urgency: data.urgency,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
        estimatedDuration: getEstimatedDuration(
          data.yardSize,
          data.serviceType
        ),
        skillsNeeded: data.serviceType,
        notes: `Yard Size: ${data.yardSize}, Service: ${
          data.serviceType
        }, Frequency: ${data.frequency}, Equipment Available: ${
          data.hasEquipment
        }${
          data.preferredTime ? `, Preferred Time: ${data.preferredTime}` : ""
        }${data.notes ? `, Additional Notes: ${data.notes}` : ""}`,
        ...(photoUrl ? { photoUrl } : {}),
      };

      const response = await fetch(`/api/help-requests/${resolvedParams.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update request");
      }

      alert("Request updated successfully!");
      router.push("/my-requests");
    } catch (error) {
      console.error("Error updating request:", error);
      alert(
        `There was an error updating your request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const getEstimatedDuration = (yardSize: string, serviceType: string) => {
    const baseTimes = {
      small: { mowing: 30, full: 60 },
      medium: { mowing: 45, full: 90 },
      large: { mowing: 60, full: 120 },
      "extra-large": { mowing: 90, full: 180 },
    };

    const size = yardSize as keyof typeof baseTimes;
    const isFullService = serviceType.includes("full");
    const minutes = baseTimes[size]?.[isFullService ? "full" : "mowing"] || 60;

    return minutes < 60
      ? `${minutes} minutes`
      : `${Math.round(minutes / 60)} hour${minutes >= 120 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <div className="verse-fade-in">
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="verse-container py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">Loading request data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verse-fade-in mb-16">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="verse-container py-12 pb-20">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-8">
              <Link
                href="/my-requests"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Requests
              </Link>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Edit Lawn Care Request
              </h1>
              <p className="text-xl text-gray-600">
                Update your request details and let neighbors know about any
                changes.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Request Title *
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Brief title for your request..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Description *
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white resize-none"
                    placeholder="Provide details about what you need help with..."
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description && (
                      <p className="text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {descriptionLength}/500 characters
                    </p>
                  </div>
                </div>

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priority Level *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {urgencyLevels.map((level) => (
                      <label
                        key={level.value}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedUrgency === level.value
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          {...register("urgency")}
                          type="radio"
                          value={level.value}
                          className="hidden"
                          onChange={(e) => {
                            setSelectedUrgency(e.target.value);
                          }}
                        />
                        <div className="text-center w-full">
                          <div className="font-medium text-gray-900">
                            {level.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.urgency && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.urgency.message}
                    </p>
                  )}
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Update Photo (Optional)
                  </label>

                  {!photoPreview ? (
                    <div className="relative">
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            a photo
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG or JPEG (MAX. 5MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={photoPreview}
                          alt="Upload preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 flex items-center">
                        <Image className="w-4 h-4 mr-1" />
                        {uploadedPhoto?.name || "Current photo"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Yard Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Yard Size *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {yardSizes.map((size) => (
                      <label
                        key={size.value}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedYardSize === size.value
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          {...register("yardSize")}
                          type="radio"
                          value={size.value}
                          className="hidden"
                          onChange={(e) => {
                            setSelectedYardSize(e.target.value);
                          }}
                        />
                        <div className="text-center w-full">
                          <div className="font-medium text-gray-900">
                            {size.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.yardSize && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.yardSize.message}
                    </p>
                  )}
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Type *
                  </label>
                  <div className="space-y-3">
                    {serviceTypes.map((service) => (
                      <label
                        key={service.value}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedServiceType === service.value
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          {...register("serviceType")}
                          type="radio"
                          value={service.value}
                          className="hidden"
                          onChange={(e) => {
                            setSelectedServiceType(e.target.value);
                          }}
                        />
                        <div className="text-left w-full">
                          <div className="font-medium text-gray-900">
                            {service.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.serviceType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.serviceType.message}
                    </p>
                  )}
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How Often? *
                  </label>
                  <div className="space-y-3">
                    {frequencies.map((freq) => (
                      <label
                        key={freq.value}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedFrequency === freq.value
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          {...register("frequency")}
                          type="radio"
                          value={freq.value}
                          className="hidden"
                          onChange={(e) => {
                            setSelectedFrequency(e.target.value);
                          }}
                        />
                        <div className="text-left w-full">
                          <div className="font-medium text-gray-900">
                            {freq.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.frequency && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.frequency.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Location *
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        {...register("address")}
                        type="text"
                        className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                        placeholder="Enter your address..."
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
                      >
                        {isGettingLocation ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.address && (
                      <p className="text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Phone Number *
                  </label>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      {...register("phone")}
                      type="tel"
                      className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                      placeholder="Your phone number..."
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you have lawn equipment available? *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                      <input
                        {...register("hasEquipment")}
                        type="radio"
                        value="yes"
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 font-medium text-gray-900">
                        Yes, I have equipment
                      </span>
                    </label>
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                      <input
                        {...register("hasEquipment")}
                        type="radio"
                        value="no"
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 font-medium text-gray-900">
                        No, please bring equipment
                      </span>
                    </label>
                  </div>
                  {errors.hasEquipment && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.hasEquipment.message}
                    </p>
                  )}
                </div>

                {/* Preferred Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Time (Optional)
                  </label>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      {...register("preferredTime")}
                      type="text"
                      className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                      placeholder="e.g., Weekends, After 5pm, Morning..."
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white resize-none"
                    placeholder="Any other details or special requests..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Updating Request...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Scissors className="w-5 h-5 mr-2" />
                        Update Request
                      </div>
                    )}
                  </button>

                  <Link
                    href="/my-requests"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
