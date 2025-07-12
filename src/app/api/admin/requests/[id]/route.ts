import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

/**
 * Update help request status (approve/deny/highlight)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { action, highlight } = await request.json();
    const resolvedParams = await params;
    const requestId = resolvedParams.id;

    const updateData: { isApproved?: boolean; isHighlighted?: boolean } = {};

    switch (action) {
      case "approve":
        updateData.isApproved = true;
        break;
      case "deny":
        updateData.isApproved = false;
        updateData.isHighlighted = false; // Remove highlight if denied
        break;
      case "highlight":
        updateData.isHighlighted = highlight;
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedRequest = await prisma.helpRequest.update({
      where: { id: requestId },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error("Error updating request:", error);

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
