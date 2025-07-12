"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Upload,
  X,
  Image,
  Scissors,
  Calendar,
  Home,
} from "lucide-react";
import React from "react";

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

export default function CreateRequestPage() {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedYardSize, setSelectedYardSize] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
      let photoUrl = null;

      // Upload photo first if one was selected
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

      // Prepare lawn care request data
      const requestData = {
        helpType: "lawn-care",
        title: data.title,
        description: data.description,
        category: "lawn-care",
        urgency: "medium", // Default for lawn care
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
        },${
          data.preferredTime ? `, Preferred Time: ${data.preferredTime}` : ""
        }${data.notes ? `, Additional Notes: ${data.notes}` : ""}`,
        ...(photoUrl ? { photoUrl } : {}),
      };

      const response = await fetch("/api/help-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request");
      }

      alert(
        "Lawn care request submitted successfully! Volunteers in your area will be notified."
      );
      window.location.href = "/";
    } catch (error) {
      console.error("Error submitting request:", error);
      alert(
        `There was an error submitting your request: ${
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

  return (
    <div className="verse-fade-in mb-16">
      <div className="verse-container py-12 pb-20">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold tracking-tight mb-4"
              style={{ color: "var(--color-primary)" }}
            >
              Request Lawn Care Help
            </h1>
            <p className="text-muted-foreground">
              Let your neighbors in Purcell and Lexington know how they can help
              you with lawn care needs.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Request Title *
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white"
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
              <label className="block text-sm font-medium mb-3">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white resize-none"
                placeholder="Provide details about what you need help with..."
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground ml-auto">
                  {descriptionLength}/500 characters
                </p>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Add a Photo (Optional)
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
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> a
                        photo
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 border-2 border-gray-400 rounded-lg overflow-hidden">
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
                    {uploadedPhoto?.name}
                  </p>
                </div>
              )}

              <p className="mt-1 text-sm text-muted-foreground">
                A photo can help neighbors better understand your situation and
                build trust.
              </p>
            </div>

            {/* Yard Size */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Yard Size *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {yardSizes.map((size) => (
                  <label
                    key={size.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedYardSize === size.value
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-gray-400 hover:border-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      {...register("yardSize")}
                      type="radio"
                      value={size.value}
                      className="sr-only"
                      onChange={() => setSelectedYardSize(size.value)}
                    />
                    <span className="text-sm font-medium">{size.label}</span>
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
              <label className="block text-sm font-medium mb-3">
                Service Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {serviceTypes.map((service) => (
                  <label
                    key={service.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedServiceType === service.value
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-gray-400 hover:border-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      {...register("serviceType")}
                      type="radio"
                      value={service.value}
                      className="sr-only"
                      onChange={() => setSelectedServiceType(service.value)}
                    />
                    <div className="flex items-center">
                      <Scissors className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        {service.label}
                      </span>
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
              <label className="block text-sm font-medium mb-3">
                Frequency *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {frequencies.map((freq) => (
                  <label
                    key={freq.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedFrequency === freq.value
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-gray-400 hover:border-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      {...register("frequency")}
                      type="radio"
                      value={freq.value}
                      className="sr-only"
                      onChange={() => setSelectedFrequency(freq.value)}
                    />
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{freq.label}</span>
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
              <label className="block text-sm font-medium mb-3">
                Location *
              </label>
              <div className="flex gap-3">
                <input
                  {...register("address")}
                  type="text"
                  className="flex-1 p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white"
                  placeholder="Enter your address..."
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 border-2 border-primary"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("phone")}
                  type="tel"
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white"
                  placeholder="(555) 123-4567"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                We need a phone number to verify requests and coordinate help.
              </p>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Equipment Available */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Do you have equipment to help? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watch("hasEquipment") === "Yes"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-gray-400 hover:border-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <input
                    {...register("hasEquipment")}
                    type="radio"
                    value="Yes"
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Yes</span>
                  </div>
                </label>
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watch("hasEquipment") === "No"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-gray-400 hover:border-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <input
                    {...register("hasEquipment")}
                    type="radio"
                    value="No"
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">No</span>
                  </div>
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
              <label className="block text-sm font-medium mb-3">
                Preferred Time (Optional)
              </label>
              <input
                {...register("preferredTime")}
                type="text"
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white"
                placeholder="e.g., 9 AM, 3 PM, anytime"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Additional notes (Optional)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full p-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white resize-none"
                placeholder="Any other details that might be helpful..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full verse-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Lawn Care Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
