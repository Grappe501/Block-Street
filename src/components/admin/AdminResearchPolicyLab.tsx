"use client";

import { useEffect, useState } from "react";
import rpl from "../../../data/registry/research-policy-lab.json";
import type { ResearchLabOverview } from "@/lib/research-policy-lab/types";

export function AdminResearchPolicyLab() {
  const [overview, setOverview] = useState<ResearchLabOverview | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/research-policy-lab/overview")
      .then((r) => r.json())
      .then((d) => setOverview(d.overview ?? null));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runDemo() {
    setMessage(null);
    const res = await fetch("/api/admin/research-policy-lab/overview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acceptance_demo" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Demo failed");
      return;
    }
    setMessage(`AC-200 demo: workspace ${data.workspace?.id} · brief ${data.brief?.status}`);
    refresh();
  }

  return (
    <div className="card border-l-4 border-teal-500">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-800">10.7 · {rpl.requirementId}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">{rpl.productName}</h3>
          <p className="mt-1 text-sm text-slate-600">{rpl.guidingPrinciple}</p>
          <p className="mt-2 font-mono text-xs text-slate-500">
            {rpl.acceptanceCriteria} · {rpl.acceptanceCriteriaMet ? "met" : "open"}
          </p>
        </div>
        <button type="button" onClick={() => void runDemo()} className="rounded bg-teal-700 px-3 py-2 text-sm font-semibold text-white">
          Run AC-200 demo
        </button>
      </div>

      {overview && (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded border bg-white p-3 text-center">
            <p className="text-xs text-slate-500">Workspaces</p>
            <p className="text-xl font-bold">{overview.workspace_count}</p>
          </div>
          <div className="rounded border bg-white p-3 text-center">
            <p className="text-xs text-slate-500">Active</p>
            <p className="text-xl font-bold">{overview.active_workspaces}</p>
          </div>
          <div className="rounded border bg-white p-3 text-center">
            <p className="text-xs text-slate-500">In review</p>
            <p className="text-xl font-bold">{overview.briefs_in_review}</p>
          </div>
          <div className="rounded border bg-white p-3 text-center">
            <p className="text-xs text-slate-500">Min cohort</p>
            <p className="text-xl font-bold">{overview.min_cohort_size}</p>
          </div>
        </div>
      )}

      {overview && (
        <p className="mt-3 text-xs text-slate-600">
          PII export prohibited: <strong>{overview.pii_export_prohibited ? "yes" : "no"}</strong>
        </p>
      )}
      {message && <p className="mt-3 text-sm text-teal-900">{message}</p>}
    </div>
  );
}
