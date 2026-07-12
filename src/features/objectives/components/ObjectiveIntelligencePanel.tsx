"use client";

import { useEffect, useState } from "react";
import type { ObjectiveRecommendation } from "@/lib/civic-action/builds/11.2/intelligence";
import { ObjectiveRecommendationCard } from "./ObjectiveRecommendationCard";

export function ObjectiveIntelligencePanel({
  initiativeId,
  objectiveId,
}: {
  initiativeId: string;
  objectiveId: string;
}) {
  const [data, setData] = useState<{
    recommendations: ObjectiveRecommendation[];
    progress?: { progress_percent: number; trend: string; forecast_label: string };
    execution?: { velocity_label: string; blocked_missions: number };
  } | null>(null);

  useEffect(() => {
    fetch(`/api/v1/objectives/${objectiveId}/intelligence?initiative_id=${initiativeId}`)
      .then((r) => r.json())
      .then((json) => setData(json.data ?? json))
      .catch(() => setData(null));
  }, [initiativeId, objectiveId]);

  async function dismiss(id: string) {
    await fetch("/api/v1/intelligence/objectives/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation_id: id, action: "dismiss" }),
    });
    setData((d) =>
      d ? { ...d, recommendations: d.recommendations.filter((r) => r.recommendation_id !== id) } : d
    );
  }

  if (!data) {
    return <p className="text-sm text-slate-500">Loading execution intelligence…</p>;
  }

  return (
    <div className="space-y-6">
      {data.progress && (
        <section className="card">
          <h2 className="text-lg font-bold text-slate-900">Progress intelligence</h2>
          <p className="mt-2 text-sm text-slate-600">
            {data.progress.progress_percent}% · Trend: {data.progress.trend} · {data.progress.forecast_label}
          </p>
        </section>
      )}
      {data.execution && (
        <section className="card">
          <h2 className="text-lg font-bold text-slate-900">Execution intelligence</h2>
          <p className="mt-2 text-sm text-slate-600">
            Velocity: {data.execution.velocity_label} · Blocked missions: {data.execution.blocked_missions}
          </p>
        </section>
      )}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Recommendations</h2>
        {data.recommendations.length === 0 ? (
          <p className="text-sm text-slate-500">No advisory recommendations right now. Execution looks steady.</p>
        ) : (
          data.recommendations.map((r) => (
            <ObjectiveRecommendationCard key={r.recommendation_id} recommendation={r} onDismiss={dismiss} />
          ))
        )}
      </section>
    </div>
  );
}
