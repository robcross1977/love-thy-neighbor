import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Debug endpoint to check database state
 */
export async function GET() {
  try {
    // Get all requests with their category and approval status
    const requests = await prisma.helpRequest.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get all categories
    const categories = await prisma.category.findMany();

    return NextResponse.json({
      success: true,
      data: {
        requests: requests.map((req) => ({
          id: req.id,
          title: req.title,
          category: req.category.name,
          status: req.status,
          isApproved: req.isApproved,
          isHighlighted: req.isHighlighted,
          urgency: req.urgency,
          userName: req.user.name,
          createdAt: req.createdAt,
        })),
        categories: categories,
        totalRequests: requests.length,
        approvedRequests: requests.filter((r) => r.isApproved === true).length,
        pendingRequests: requests.filter((r) => r.isApproved === null).length,
        deniedRequests: requests.filter((r) => r.isApproved === false).length,
      },
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug data" },
      { status: 500 }
    );
  }
}
