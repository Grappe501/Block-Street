"use client";

import { useEffect, useState } from "react";
import type { ExecutiveBrief } from "@/lib/civic-action/builds/11.1/intelligence";
import { RecommendationCard } from "./RecommendationCard";

export function ExecutiveBriefCard() {
  const [brief, setBrief] = useState<ExecutiveBrief | null>(null);

  useEffect(() => {
    fetch("/api/v1/intelligence/briefing")
      .then((r) => r.json())
      .then((d) => setBrief(d.data?.briefing ?? null));
  }, []);

  if (!brief) return null;

  return (
    <section className="rounded-xl border border-orange-200 bg-orange-50/50 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Executive brief</h2>
      <p className="text-xs text-slate-500">~{brief.reading_time_minutes} min read · advisory only</p>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Approvals waiting</dt>
          <dd className="text-xl font-semibold">{brief.approvals_waiting}</dd>
        </div>
        <div>
          <dt className="text-slate-500">At risk</dt>
          <dd className="text-xl font-semibold">{brief.initiatives_at_risk}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Critical risks</dt>
          <dd className="text-xl font-semibold">{brief.critical_risks.length}</dd>
        </div>
      </dl>
      {brief.todays_priorities.length > 0 && (
        <div className="mt-4 space-y-3">
          {brief.todays_priorities.map((r) => (
            <RecommendationCard key={r.recommendation_id} recommendation={r} />
          ))}
        </div>
      )}
    </section>
  );
}
