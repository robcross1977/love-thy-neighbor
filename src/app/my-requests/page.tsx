"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Edit,
  Trash2,
  Scissors,
  Calendar,
  MessageSquare,
  Eye,
  Check,
  X,
} from "lucide-react";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  photoUrl?: string;
  address: string;
  urgency: string;
  status: string;
  isApproved?: boolean;
  isHighlighted: boolean;
  createdAt: string;
  category: {
    name: string;
    icon?: string;
  };
  responses: Array<{
    id: string;
    isAccepted: boolean;
    user: {
      id: string;
      name?: string;
    };
  }>;
}

/**
 * My Requests page for users to view and manage their help requests
 */
export default function MyRequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "open" | "completed"
  >("all");

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/api/auth/signin");
      return;
    }

    loadMyRequests();
  }, [session, status, router, filter]);

  const loadMyRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/my-requests?filter=${filter}`);
      const data = await response.json();

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        console.error("Error loading requests:", data.error);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveHelper = async (requestId: string, responseId: string) => {
    try {
      const response = await fetch(
        `/api/help-responses/${responseId}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approve: true }),
        }
      );

      if (response.ok) {
        loadMyRequests(); // Refresh the data
      }
    } catch (error) {
      console.error("Error approving helper:", error);
    }
  };

  const handleEditRequest = (request: HelpRequest) => {
    router.push(`/edit/${request.id}`);
  };

  const getStatusBadge = (status: string, isApproved?: boolean) => {
    if (isApproved === null || isApproved === undefined) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
          <Clock className="w-4 h-4 mr-2" />
          Pending Review
        </div>
      );
    }

    if (isApproved === false) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200">
          <XCircle className="w-4 h-4 mr-2" />
          Denied
        </div>
      );
    }

    // Approved requests show their status
    switch (status.toLowerCase()) {
      case "open":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
            <CheckCircle className="w-4 h-4 mr-2" />
            Open for Volunteers
          </div>
        );
      case "in_progress":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
            <Clock className="w-4 h-4 mr-2" />
            In Progress
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </div>
        );
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    console.log("Rendering urgency badge for:", urgency); // Debug log

    switch (urgency.toLowerCase()) {
      case "urgent":
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
          >
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
          </div>
        );
      case "high":
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#ea580c", color: "#ffffff" }}
          >
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
          </div>
        );
      case "medium":
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#d97706", color: "#ffffff" }}
          >
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
          </div>
        );
      case "low":
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
          >
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
          </div>
        );
      default:
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#4b5563", color: "#ffffff" }}
          >
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)} (DEBUG:{" "}
            {urgency})
          </div>
        );
    }
  };

  const getAcceptedHelpers = (responses: HelpRequest["responses"]) => {
    return responses.filter((r) => r.isAccepted);
  };

  const getPendingHelpers = (responses: HelpRequest["responses"]) => {
    return responses.filter((r) => !r.isAccepted);
  };

  if (status === "loading" || loading) {
    return (
      <div className="verse-fade-in">
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="verse-container py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">
                Loading your lawn care requests...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verse-fade-in">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header Section */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%227%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

          <div className="verse-container relative">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
                    <Scissors className="w-4 h-4 mr-2" />
                    My Requests
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    My Lawn Care Requests
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl">
                    Track and manage your lawn care requests, communicate with
                    volunteers, and keep your yard beautiful.
                  </p>
                </div>
                <Link
                  href="/create"
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <Scissors className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    New Request
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-white/50 backdrop-blur-sm border-y border-green-100">
          <div className="verse-container">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3">
                {[
                  { key: "all", label: "All Requests", icon: Eye },
                  { key: "pending", label: "Pending Review", icon: Clock },
                  { key: "approved", label: "Approved", icon: CheckCircle },
                  { key: "open", label: "Open", icon: MessageSquare },
                  { key: "completed", label: "Completed", icon: Check },
                ].map((filterOption) => {
                  const Icon = filterOption.icon;
                  return (
                    <button
                      key={filterOption.key}
                      onClick={() =>
                        setFilter(filterOption.key as typeof filter)
                      }
                      className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        filter === filterOption.key
                          ? "bg-green-600 text-white shadow-lg transform scale-105"
                          : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {filterOption.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Requests Section */}
        <section className="py-12">
          <div className="verse-container">
            <div className="max-w-6xl mx-auto">
              {requests.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                      <AlertCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {filter === "all"
                        ? "No requests yet"
                        : `No ${filter} requests found`}
                    </h3>
                    <p className="text-gray-600 text-lg mb-8">
                      {filter === "all"
                        ? "You haven't submitted any lawn care requests yet. Get started by creating your first request!"
                        : `You don't have any ${filter} requests at the moment.`}
                    </p>
                    <Link
                      href="/create"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      <Scissors className="w-5 h-5 mr-2" />
                      Create Your First Request
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid gap-8">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-100"
                    >
                      <div className="p-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                          <div className="flex flex-wrap items-center gap-3">
                            {getUrgencyBadge(request.urgency)}
                            {getStatusBadge(request.status, request.isApproved)}
                            {request.isHighlighted && (
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                                <Star className="w-4 h-4 mr-2" />
                                Featured
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                            {request.category.name}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              {request.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                              {request.description}
                            </p>

                            {/* Details */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-green-600" />
                                {request.address}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-green-600" />
                                {new Date(
                                  request.createdAt
                                ).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-green-600" />
                                {
                                  getAcceptedHelpers(request.responses).length
                                }{" "}
                                helper(s) accepted
                              </div>
                            </div>

                            {/* Pending Helpers - Show approve buttons */}
                            {getPendingHelpers(request.responses).length >
                              0 && (
                              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Volunteers Waiting for Approval:
                                </h4>
                                <div className="space-y-2">
                                  {getPendingHelpers(request.responses).map(
                                    (response) => (
                                      <div
                                        key={response.id}
                                        className="flex items-center justify-between bg-white p-3 rounded-lg"
                                      >
                                        <span className="text-blue-800 font-medium">
                                          {response.user.name ||
                                            "Anonymous Helper"}
                                        </span>
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() =>
                                              handleApproveHelper(
                                                request.id,
                                                response.id
                                              )
                                            }
                                            className="flex items-center px-3 py-1 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                          >
                                            <Check className="w-4 h-4 mr-1" />
                                            Approve
                                          </button>
                                          <button className="flex items-center px-3 py-1 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                                            <X className="w-4 h-4 mr-1" />
                                            Decline
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Accepted Helpers */}
                            {getAcceptedHelpers(request.responses).length >
                              0 && (
                              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approved Helpers:
                                </h4>
                                <div className="space-y-2">
                                  {getAcceptedHelpers(request.responses).map(
                                    (response) => (
                                      <div
                                        key={response.id}
                                        className="flex items-center justify-between bg-white p-3 rounded-lg"
                                      >
                                        <span className="text-green-800 font-medium">
                                          {response.user.name ||
                                            "Anonymous Helper"}
                                        </span>
                                        <div className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                                          Ready to help
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Photo */}
                          {request.photoUrl && (
                            <div className="md:col-span-1">
                              <img
                                src={request.photoUrl}
                                alt="Request photo"
                                className="w-full h-48 object-cover rounded-xl shadow-md"
                              />
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                          <button
                            onClick={() => handleEditRequest(request)}
                            className="flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Request
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Request
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
