import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

/**
 * Approve or decline a helper response
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

    const { approve } = await request.json();
    const resolvedParams = await params;
    const responseId = resolvedParams.id;

    // Get the help response and verify ownership
    const helpResponse = await prisma.helpResponse.findUnique({
      where: { id: responseId },
      include: {
        helpRequest: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!helpResponse) {
      return NextResponse.json(
        { error: "Help response not found" },
        { status: 404 }
      );
    }

    // Verify the current user owns the original request
    if (helpResponse.helpRequest.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only approve responses to your own requests" },
        { status: 403 }
      );
    }

    // Update the response
    await prisma.helpResponse.update({
      where: { id: responseId },
      data: {
        isAccepted: approve,
        status: approve ? "ACCEPTED" : "DECLINED",
      },
    });

    return NextResponse.json({
      success: true,
      message: approve ? "Helper approved successfully" : "Helper declined",
    });
  } catch (error) {
    console.error("Error updating help response:", error);
    return NextResponse.json(
      { error: "Failed to update response" },
      { status: 500 }
    );
  }
}
