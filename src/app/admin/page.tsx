"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  X,
  Eye,
  Star,
  Clock,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  photoUrl?: string;
  address: string;
  urgency: string;
  isApproved?: boolean;
  isHighlighted: boolean;
  createdAt: string;
  user: {
    name?: string;
    email: string;
  };
  category: {
    name: string;
  };
}

/**
 * Admin dashboard for reviewing and approving help requests
 */
export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "pending" | "approved" | "denied" | "all"
  >("pending");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      if (status === "loading") return;

      if (!session?.user?.email) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/admin/check");
        const data = await response.json();

        if (!data.isAdmin) {
          router.push("/");
          return;
        }

        setIsAdmin(true);
        loadRequests();
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      }
    };

    checkAdminStatus();
  }, [session, status, router]);

  const loadRequests = async () => {
    try {
      const response = await fetch(`/api/admin/requests?filter=${filter}`);
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadRequests();
    }
  }, [filter, isAdmin]);

  const handleApprove = async (requestId: string) => {
    try {
      await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      loadRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleDeny = async (requestId: string) => {
    try {
      await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deny" }),
      });
      loadRequests();
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  const toggleHighlight = async (
    requestId: string,
    isCurrentlyHighlighted: boolean
  ) => {
    try {
      await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "highlight",
          highlight: !isCurrentlyHighlighted,
        }),
      });
      loadRequests();
    } catch (error) {
      console.error("Error toggling highlight:", error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
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
        return "var(--color-muted)";
    }
  };

  const getStatusBadge = (isApproved?: boolean) => {
    if (isApproved === null || isApproved === undefined) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
    if (isApproved) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Approved
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
        Denied
      </span>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="verse-container py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Admin Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Review and manage help requests
              </p>
            </div>

            {/* Loading State */}
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-600 mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Loading Dashboard
                </h3>
                <p className="text-gray-600">
                  Please wait while we load your admin dashboard...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="verse-fade-in">
      <div className="verse-container py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Review and manage community help requests
              </p>
            </div>
            <Link href="/" className="verse-button">
              Back to Home
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 mb-8 border-b">
            {(["pending", "approved", "denied", "all"] as const).map(
              (filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`pb-2 px-1 border-b-2 transition-colors capitalize ${
                    filter === filterType
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filterType}
                </button>
              )
            )}
          </div>

          {/* Requests List */}
          <div className="space-y-6">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No {filter} requests found
                </p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="verse-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span
                        className="px-3 py-1 text-sm rounded-full text-white font-medium"
                        style={{
                          backgroundColor: getUrgencyColor(request.urgency),
                        }}
                      >
                        {request.urgency}
                      </span>
                      {getStatusBadge(request.isApproved)}
                      {request.isHighlighted && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Highlighted
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {request.category.name}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">
                    {request.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {request.description}
                  </p>

                  {request.photoUrl && (
                    <div className="mb-4">
                      <img
                        src={request.photoUrl}
                        alt="Request photo"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {request.user.name || request.user.email}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {request.address}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {request.isApproved === null ||
                      request.isApproved === undefined ? (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeny(request.id)}
                            className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Deny
                          </button>
                        </>
                      ) : request.isApproved ? (
                        <button
                          onClick={() =>
                            toggleHighlight(request.id, request.isHighlighted)
                          }
                          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                            request.isHighlighted
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          {request.isHighlighted
                            ? "Remove Highlight"
                            : "Add Highlight"}
                        </button>
                      ) : null}
                    </div>

                    <button className="flex items-center px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
