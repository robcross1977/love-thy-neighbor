import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Get highlighted (featured) help requests for the homepage
 */
export async function GET() {
  try {
    const highlightedRequests = await prisma.helpRequest.findMany({
      where: {
        isApproved: true,
        isHighlighted: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6, // Limit to 6 featured requests
    });

    // Transform data for frontend
    const transformedRequests = highlightedRequests.map((request) => ({
      id: request.id,
      title: request.title,
      description: request.description,
      icon: request.category.icon || getCategoryIcon(request.category.name),
      urgency: getUrgencyLabel(request.urgency),
      urgencyColor: getUrgencyColor(request.urgency),
      location: request.address.split(",")[0], // Just the city part
      category: request.category.name,
      userName: request.user.name || "Anonymous",
    }));

    return NextResponse.json({ requests: transformedRequests });
  } catch (error) {
    console.error("Error fetching highlighted requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch highlighted requests" },
      { status: 500 }
    );
  }
}

function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    "Food & Hunger": "🍞",
    "Medical & Prescription Help": "💊",
    "Elderly & Physical Assistance": "👴",
    "Financial Assistance": "💰",
  };
  return icons[categoryName] || "❓";
}

function getUrgencyLabel(urgency: string): string {
  switch (urgency.toLowerCase()) {
    case "urgent":
      return "Urgent";
    case "high":
      return "High Priority";
    case "medium":
      return "Medium Priority";
    case "low":
      return "Low Priority";
    default:
      return "Medium Priority";
  }
}

function getUrgencyColor(urgency: string): string {
  switch (urgency.toLowerCase()) {
    case "urgent":
      return "var(--color-help-urgent)";
    case "high":
      return "var(--color-help-high)";
    case "medium":
      return "var(--color-help-medium)";
    case "low":
      return "var(--color-help-low)";
    default:
      return "var(--color-help-medium)";
  }
}
