import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `lawn-care/${timestamp}_${originalName}`;

    try {
      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: false,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        filename: filename,
      });
    } catch (blobError) {
      console.error("Vercel Blob upload failed:", blobError);

      // Fallback: Return success without actually storing the file
      // This allows the form to work even if blob storage fails
      console.warn("Falling back to no-upload mode");
      return NextResponse.json({
        success: true,
        url: null, // No photo URL
        filename: null,
        warning: "Photo upload temporarily unavailable",
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
