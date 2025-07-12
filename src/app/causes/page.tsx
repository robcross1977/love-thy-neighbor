"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  User,
  Scissors,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Heart,
} from "lucide-react";

interface LawnCareRequest {
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
  estimatedDuration?: string;
  category: {
    name: string;
    icon?: string;
  };
  user: {
    name?: string;
  };
}

/**
 * Volunteer page showing available lawn care requests
 */
export default function VolunteerPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<LawnCareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "urgent" | "high" | "medium">(
    "all"
  );

  useEffect(() => {
    loadLawnCareRequests();
  }, [filter]);

  const loadLawnCareRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/help-requests?category=lawn-care&status=open&approved=true${
          filter !== "all" ? `&urgency=${filter}` : ""
        }`
      );
      const data = await response.json();

      if (data.success) {
        setRequests(data.data || []);
      } else {
        console.error("Error loading requests:", data.error);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteer = () => {
    if (!session?.user) {
      router.push("/api/auth/signin");
      return;
    }

    // For now, just show an alert - in a real app this would create a help response
    alert(
      "Thank you for volunteering! The request owner will be notified and can contact you directly."
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "urgent":
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
          >
            Urgent
          </div>
        );
      case "high":
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#ea580c", color: "#ffffff" }}
          >
            High Priority
          </div>
        );
      case "medium":
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#d97706", color: "#ffffff" }}
          >
            Medium Priority
          </div>
        );
      case "low":
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
          >
            Low Priority
          </div>
        );
      default:
        return (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#4b5563", color: "#ffffff" }}
          >
            {urgency}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="verse-container py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Volunteer for Lawn Care
              </h1>
              <p className="text-xl text-gray-600">
                Help elderly neighbors in Purcell and Lexington
              </p>
            </div>

            {/* Loading State */}
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-600 mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Loading Requests
                </h3>
                <p className="text-gray-600">
                  Finding lawn care requests in your area...
                </p>
              </div>
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
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Volunteer Opportunities
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Help Elderly Neighbors with Lawn Care
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Make a difference in your community by helping elderly neighbors
                in{" "}
                <span className="font-semibold text-green-700">
                  Purcell and Lexington
                </span>{" "}
                keep their yards beautiful and well-maintained.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8">
          <div className="verse-container">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setFilter("all")}
                  className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filter === "all"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                  }`}
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  All Requests
                </button>
                <button
                  onClick={() => setFilter("urgent")}
                  className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filter === "urgent"
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Urgent
                </button>
                <button
                  onClick={() => setFilter("high")}
                  className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filter === "high"
                      ? "bg-orange-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                  }`}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  High Priority
                </button>
                <button
                  onClick={() => setFilter("medium")}
                  className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filter === "medium"
                      ? "bg-yellow-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Medium Priority
                </button>
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
                      <Scissors className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      No Lawn Care Requests Found
                    </h3>
                    <p className="text-gray-600 text-lg mb-8">
                      {filter === "all"
                        ? "There are currently no lawn care requests that need volunteers. Check back later!"
                        : `No ${filter} priority requests at the moment. Try viewing all requests.`}
                    </p>
                    <Link
                      href="/create"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Encourage Others to Request Help
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
                            {request.isHighlighted && (
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                                <CheckCircle className="w-4 h-4 mr-2" />
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
                                {request.user.name || "Anonymous"}
                              </div>
                              {request.estimatedDuration && (
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2 text-green-600" />
                                  {request.estimatedDuration}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Photo */}
                          {request.photoUrl && (
                            <div className="md:col-span-1">
                              <img
                                src={request.photoUrl}
                                alt="Lawn care request"
                                className="w-full h-48 object-cover rounded-xl shadow-md"
                              />
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-100">
                          <button
                            onClick={() => handleVolunteer()}
                            className="group relative px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                          >
                            <div className="flex items-center">
                              <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                              Volunteer to Help
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
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

        {/* Call to Action */}
        <section className="py-20">
          <div className="verse-container">
            <div className="max-w-4xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Every act of kindness helps build a stronger, more caring
                community. Your volunteer work makes a real difference in the
                lives of elderly neighbors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setFilter("urgent")}
                  className="px-8 py-4 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Help Urgent Requests
                </button>
                <Link
                  href="/create"
                  className="px-8 py-4 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 hover:shadow-md"
                >
                  Know Someone Who Needs Help?
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
