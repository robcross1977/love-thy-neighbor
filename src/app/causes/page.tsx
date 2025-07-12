"use client";

import { useState } from "react";
import { Heart, DollarSign, Share2 } from "lucide-react";

interface Cause {
  id: string;
  title: string;
  description: string;
  category: "food" | "medical" | "elderly" | "financial";
  urgency: "low" | "medium" | "high" | "urgent";
  goal: number;
  raised: number;
  helpersNeeded: number;
  helpersCommitted: number;
  location: string;
  organizer: string;
  image?: string;
  updates: string[];
}

const mockCauses: Cause[] = [
  {
    id: "1",
    title: "Winter Food Drive for Local Families",
    description:
      "Help provide groceries and warm meals for 25 families struggling with food insecurity this winter. We're collecting non-perishable items and funds for fresh produce.",
    category: "food",
    urgency: "high",
    goal: 2500,
    raised: 1200,
    helpersNeeded: 15,
    helpersCommitted: 8,
    location: "Downtown Community Center",
    organizer: "Sarah Martinez",
    updates: [
      "12 families have already received assistance",
      "Local grocery store donated 200 lbs of canned goods",
      "Still need volunteers for food sorting this Saturday",
    ],
  },
  {
    id: "2",
    title: "Prescription Fund for Mrs. Johnson",
    description:
      "Mrs. Johnson, 78, needs help affording her diabetes medication after losing her insurance coverage. The monthly cost is $340.",
    category: "medical",
    urgency: "urgent",
    goal: 1020, // 3 months worth
    raised: 680,
    helpersNeeded: 5,
    helpersCommitted: 12,
    location: "Oak Street neighborhood",
    organizer: "Community Health Volunteers",
    updates: [
      "Pharmacy has agreed to hold medication until funds are raised",
      "Mrs. Johnson's daughter sends her heartfelt thanks",
      "Only $340 more needed for next month's supply",
    ],
  },
  {
    id: "3",
    title: "Yard Work for Elderly Veterans",
    description:
      "Monthly lawn care and basic yard maintenance for 8 elderly veterans in our community who can no longer handle these tasks themselves.",
    category: "elderly",
    urgency: "medium",
    goal: 0, // volunteer-based
    raised: 0,
    helpersNeeded: 12,
    helpersCommitted: 4,
    location: "Various neighborhoods",
    organizer: "Veterans Support Network",
    updates: [
      "Spring cleanup scheduled for next weekend",
      "Tool lending library available for volunteers",
      "4 veterans have already received help this month",
    ],
  },
];

const categoryConfig = {
  food: {
    icon: "🍞",
    color: "var(--color-help-urgent)",
    label: "Food & Hunger",
  },
  medical: {
    icon: "💊",
    color: "var(--color-help-urgent)",
    label: "Medical Help",
  },
  elderly: {
    icon: "👴",
    color: "var(--color-help-high)",
    label: "Elderly Care",
  },
  financial: {
    icon: "💰",
    color: "var(--color-help-high)",
    label: "Financial Aid",
  },
};

const urgencyConfig = {
  low: { color: "var(--color-help-low)", label: "Low Priority" },
  medium: { color: "var(--color-help-medium)", label: "Medium Priority" },
  high: { color: "var(--color-help-high)", label: "High Priority" },
  urgent: { color: "var(--color-help-urgent)", label: "Urgent" },
};

export default function CausesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [shareMessage, setShareMessage] = useState<string>("");

  const filteredCauses =
    selectedCategory === "all"
      ? mockCauses
      : mockCauses.filter((cause) => cause.category === selectedCategory);

  const handleShare = (cause: Cause, platform: string) => {
    const message = `Help support: ${
      cause.title
    }\n\nGoal: $${cause.goal.toLocaleString()}\nRaised: $${cause.raised.toLocaleString()}\n\nEvery contribution makes a difference! #LoveThyNeighbor #CommunityHelp`;

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}&quote=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        message
      )}&url=${encodeURIComponent(window.location.href)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}`,
    };

    if (urls[platform as keyof typeof urls]) {
      window.open(
        urls[platform as keyof typeof urls],
        "_blank",
        "width=600,height=400"
      );
    }
  };

  const handleContribute = (cause: Cause, type: "food" | "money") => {
    // This would integrate with payment processing or food coordination
    alert(
      `Thank you for wanting to contribute ${type} to "${cause.title}"! Integration with payment/coordination system would go here.`
    );
  };

  return (
    <div className="verse-fade-in">
      {/* Header */}
      <section className="verse-container py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Neighbors Who Need Help
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Real people in Purcell and Lexington who need support. You can help
            by contributing food, money, or sharing their story.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="verse-container pb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Neighbors
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>
      </section>

      {/* Causes List */}
      <section className="verse-container pb-16">
        <div className="grid gap-8 max-w-4xl mx-auto">
          {filteredCauses.map((cause) => {
            const category = categoryConfig[cause.category];
            const urgency = urgencyConfig[cause.urgency];
            const progressPercentage =
              cause.goal > 0 ? (cause.raised / cause.goal) * 100 : 0;
            const helpersPercentage =
              (cause.helpersCommitted / cause.helpersNeeded) * 100;

            return (
              <div key={cause.id} className="verse-card">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{category.icon}</span>
                      <h2 className="text-xl font-semibold">{cause.title}</h2>
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: urgency.color + "20",
                          color: urgency.color,
                        }}
                      >
                        {urgency.label}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {cause.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📍 {cause.location}</span>
                      <span>👤 {cause.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                {cause.goal > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Financial Goal
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ${cause.raised.toLocaleString()} / $
                        {cause.goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(progressPercentage, 100)}%`,
                          backgroundColor: "var(--color-accent)",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Helpers Needed</span>
                    <span className="text-sm text-muted-foreground">
                      {cause.helpersCommitted} / {cause.helpersNeeded} committed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(helpersPercentage, 100)}%`,
                        backgroundColor: "var(--color-primary)",
                      }}
                    />
                  </div>
                </div>

                {/* Recent Updates */}
                {cause.updates.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Recent Updates</h4>
                    <ul className="space-y-1">
                      {cause.updates.slice(0, 2).map((update, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          {update}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleContribute(cause, "food")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    Contribute Food
                  </button>

                  {cause.goal > 0 && (
                    <button
                      onClick={() => handleContribute(cause, "money")}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
                    >
                      <DollarSign className="w-4 h-4" />
                      Donate Money
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShareMessage(
                          shareMessage === cause.id ? "" : cause.id
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>

                    {shareMessage === cause.id && (
                      <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-md shadow-lg p-3 z-10 min-w-[200px]">
                        <p className="text-sm font-medium mb-2">Share on:</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShare(cause, "facebook")}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare(cause, "twitter")}
                            className="px-3 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600"
                          >
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare(cause, "linkedin")}
                            className="px-3 py-1 text-xs bg-blue-700 text-white rounded hover:bg-blue-800"
                          >
                            LinkedIn
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="verse-container py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: "var(--color-primary)" }}
          >
            Know Someone Who Needs Help?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            See a neighbor in need? Help organize community support to make a
            real difference in their life.
          </p>
          <button className="verse-button">Start Helping Someone</button>
        </div>
      </section>
    </div>
  );
}
