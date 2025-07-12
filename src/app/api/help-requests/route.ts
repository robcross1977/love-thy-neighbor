import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createHelpRequestSchema = z.object({
  helpType: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  category: z.string().min(1),
  urgency: z.enum(["low", "medium", "high", "urgent"]),
  address: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().min(10),
  photoUrl: z.string().optional(),
  estimatedDuration: z.string().optional(),
  skillsNeeded: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createHelpRequestSchema.parse(body);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name || "",
        },
      });
    }

    // Map urgency to database enum
    const urgencyMap = {
      low: "LOW",
      medium: "MEDIUM",
      high: "HIGH",
      urgent: "URGENT",
    } as const;

    // Find or create lawn care category
    let category = await prisma.category.findFirst({
      where: { name: "Lawn Care" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Lawn Care",
          icon: "🌱",
          description: "Lawn mowing, yard work, and outdoor maintenance",
        },
      });
    }

    // Create help request
    const helpRequest = await prisma.helpRequest.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        photoUrl: validatedData.photoUrl,
        categoryId: category.id,
        userId: user.id,
        latitude: validatedData.latitude || 0,
        longitude: validatedData.longitude || 0,
        address: validatedData.address,
        urgency: urgencyMap[validatedData.urgency],
        estimatedDuration: validatedData.estimatedDuration,
        skillsNeeded: validatedData.skillsNeeded
          ? [validatedData.skillsNeeded]
          : [],
        maxHelpers: 1,
        notes: validatedData.notes,
        phoneNumber: validatedData.phone,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: helpRequest,
    });
  } catch (error) {
    console.error("Error creating help request:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const urgency = searchParams.get("urgency");
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const radius = searchParams.get("radius") || "10"; // km

    const skip = (page - 1) * limit;

    let where: any = {
      status: "OPEN",
    };

    if (category && category !== "all") {
      where.category = {
        name: {
          contains: category,
          mode: "insensitive",
        },
      };
    }

    if (urgency && urgency !== "all") {
      where.urgency = urgency.toUpperCase();
    }

    // TODO: Add geospatial filtering when we have coordinates
    if (latitude && longitude && radius) {
      // This would need PostGIS or similar for proper geospatial queries
      // For now, we'll implement a simple bounding box
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusInDegrees = parseFloat(radius) / 111; // Rough conversion km to degrees

      where.latitude = {
        gte: lat - radiusInDegrees,
        lte: lat + radiusInDegrees,
      };
      where.longitude = {
        gte: lng - radiusInDegrees,
        lte: lng + radiusInDegrees,
      };
    }

    const helpRequests = await prisma.helpRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
        responses: {
          select: {
            id: true,
            isAccepted: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const total = await prisma.helpRequest.count({ where });

    return NextResponse.json({
      success: true,
      data: helpRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching help requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
