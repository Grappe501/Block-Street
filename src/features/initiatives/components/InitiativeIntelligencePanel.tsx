"use client";

import { useEffect, useState } from "react";
import type { InitiativeRecommendation } from "@/lib/civic-action/builds/11.1/intelligence";
import { RecommendationCard } from "./RecommendationCard";

export function InitiativeIntelligencePanel({ initiativeId }: { initiativeId: string }) {
  const [recommendations, setRecommendations] = useState<InitiativeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/initiatives/${initiativeId}/intelligence`)
      .then((r) => r.json())
      .then((d) => setRecommendations(d.data?.recommendations ?? []))
      .finally(() => setLoading(false));
  }, [initiativeId]);

  async function dismiss(id: string) {
    await fetch("/api/v1/intelligence/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation_id: id, action: "dismiss" }),
    });
    setRecommendations((prev) => prev.filter((r) => r.recommendation_id !== id));
  }

  if (loading) return <p className="text-sm text-slate-500">Loading intelligence…</p>;

  if (recommendations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        No advisory recommendations right now. The platform will surface duplicates, risks, and capacity signals as patterns emerge.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Based on everything we know, here is what you may want to review next. Every item is explainable and dismissible.
      </p>
      {recommendations.map((r) => (
        <RecommendationCard key={r.recommendation_id} recommendation={r} onDismiss={dismiss} />
      ))}
    </div>
  );
}
