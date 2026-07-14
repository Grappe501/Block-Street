"use client";

import { useEffect, useState } from "react";
import cia from "../../../data/registry/civic-impact-analytics.json";
import type { CivicImpactOverview } from "@/lib/civic-impact-analytics/types";

export function AdminCivicImpactAnalytics() {
  const [overview, setOverview] = useState<CivicImpactOverview | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/civic-impact-analytics/overview")
      .then((r) => r.json())
      .then((d) => setOverview(d.overview ?? null));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runCycle() {
    setMessage(null);
    const res = await fetch("/api/admin/civic-impact-analytics/overview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acceptance_cycle", institution_id: "inst-block-street", county_id: "pulaski" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Cycle failed");
      return;
    }
    setMessage(
      `AC-201 cycle: composite ${data.scorecard?.composite_index} · resilience ${data.scorecard?.resilience_score} · social capital ${data.scorecard?.social_capital_score}`
    );
    refresh();
  }

  return (
    <div className="card border-l-4 border-fuchsia-500">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-fuchsia-900">10.8 · {cia.requirementId}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">{cia.productName}</h3>
          <p className="mt-1 text-sm text-slate-600">{cia.guidingPrinciple}</p>
          <p className="mt-2 font-mono text-xs text-slate-500">
            {cia.acceptanceCriteria} · {cia.acceptanceCriteriaMet ? "met" : "open"}
          </p>
        </div>
        <button type="button" onClick={() => void runCycle()} className="rounded bg-fuchsia-700 px-3 py-2 text-sm font-semibold text-white">
          Run AC-201 cycle
        </button>
      </div>

      {overview?.latest && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded border bg-white p-3 text-center">
            <p className="text-xs text-slate-500">Composite</p>
            <p className="text-xl font-bold">{overview.latest.composite_index}</p>
          </div>
          <div className="rounded border bg-white p-3 text-center">
            <p className="text-xs text-slate-500">Resilience</p>
            <p className="text-xl font-bold">{overview.latest.resilience_score}</p>
          </div>
          <div className="rounded border bg-white p-3 text-center">
            <p className="text-xs text-slate-500">Social capital</p>
            <p className="text-xl font-bold">{overview.latest.social_capital_score}</p>
          </div>
        </div>
      )}

      {overview?.latest && <p className="mt-3 text-sm text-slate-700">{overview.latest.narrative}</p>}
      {message && <p className="mt-3 text-sm text-fuchsia-900">{message}</p>}
    </div>
  );
}
