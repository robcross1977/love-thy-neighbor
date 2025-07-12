import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

/**
 * Get help requests for admin review
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "pending";

    const whereClause: { isApproved?: boolean | null } = {};

    switch (filter) {
      case "pending":
        whereClause.isApproved = null;
        break;
      case "approved":
        whereClause.isApproved = true;
        break;
      case "denied":
        whereClause.isApproved = false;
        break;
      case "all":
        // No additional filter
        break;
    }

    const requests = await prisma.helpRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            isVerified: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching admin requests:", error);

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
