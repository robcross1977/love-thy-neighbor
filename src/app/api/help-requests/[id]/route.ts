import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { UrgencyLevel } from "@prisma/client";
import { z } from "zod";

/**
 * Get a single help request
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const requestId = resolvedParams.id;

    // Get the help request
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: requestId },
      include: {
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!helpRequest) {
      return NextResponse.json(
        { error: "Help request not found" },
        { status: 404 }
      );
    }

    // Verify the current user owns the request
    if (helpRequest.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only view your own requests" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      request: helpRequest,
    });
  } catch (error) {
    console.error("Error fetching help request:", error);
    return NextResponse.json(
      { error: "Failed to fetch request" },
      { status: 500 }
    );
  }
}

const updateHelpRequestSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  urgency: z.enum(["low", "medium", "high", "urgent"]).optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  estimatedDuration: z.string().optional(),
  skillsNeeded: z.string().optional(),
  notes: z.string().optional(),
  photoUrl: z.string().optional(),
});

/**
 * Update a help request
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateHelpRequestSchema.parse(body);
    const resolvedParams = await params;
    const requestId = resolvedParams.id;

    // Get the help request and verify ownership
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: requestId },
      select: { userId: true },
    });

    if (!helpRequest) {
      return NextResponse.json(
        { error: "Help request not found" },
        { status: 404 }
      );
    }

    // Verify the current user owns the request
    if (helpRequest.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own requests" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: {
      title?: string;
      description?: string;
      urgency?: UrgencyLevel;
      address?: string;
      latitude?: number;
      longitude?: number;
      phoneNumber?: string;
      estimatedDuration?: string;
      skillsNeeded?: string[];
      notes?: string;
      photoUrl?: string;
    } = {};

    if (validatedData.title) {
      updateData.title = validatedData.title;
    }

    if (validatedData.description) {
      updateData.description = validatedData.description;
    }

    if (validatedData.urgency) {
      // Map urgency to database enum
      const urgencyMap = {
        low: UrgencyLevel.LOW,
        medium: UrgencyLevel.MEDIUM,
        high: UrgencyLevel.HIGH,
        urgent: UrgencyLevel.URGENT,
      } as const;
      updateData.urgency = urgencyMap[validatedData.urgency];
    }

    if (validatedData.address) {
      updateData.address = validatedData.address;
    }

    if (validatedData.latitude) {
      updateData.latitude = validatedData.latitude;
    }

    if (validatedData.longitude) {
      updateData.longitude = validatedData.longitude;
    }

    if (validatedData.phone) {
      updateData.phoneNumber = validatedData.phone;
    }

    if (validatedData.estimatedDuration) {
      updateData.estimatedDuration = validatedData.estimatedDuration;
    }

    if (validatedData.skillsNeeded) {
      updateData.skillsNeeded = [validatedData.skillsNeeded];
    }

    if (validatedData.notes) {
      updateData.notes = validatedData.notes;
    }

    if (validatedData.photoUrl) {
      updateData.photoUrl = validatedData.photoUrl;
    }

    // Update the request
    const updatedRequest = await prisma.helpRequest.update({
      where: { id: requestId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating help request:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
