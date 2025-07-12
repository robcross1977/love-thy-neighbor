import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";

/**
 * Get current user's help requests
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all";

    const baseWhere = {
      userId: session.user.id,
    };

    let whereClause: typeof baseWhere & {
      isApproved?: boolean | null;
      status?: RequestStatus;
    } = baseWhere;

    // Apply filters
    switch (filter) {
      case "pending":
        whereClause = { ...baseWhere, isApproved: null };
        break;
      case "approved":
        whereClause = { ...baseWhere, isApproved: true };
        break;
      case "open":
        whereClause = {
          ...baseWhere,
          isApproved: true,
          status: RequestStatus.OPEN,
        };
        break;
      case "completed":
        whereClause = { ...baseWhere, status: RequestStatus.COMPLETED };
        break;
      case "all":
      default:
        whereClause = baseWhere;
        break;
    }

    const requests = await prisma.helpRequest.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
        responses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch requests",
      },
      { status: 500 }
    );
  }
}
