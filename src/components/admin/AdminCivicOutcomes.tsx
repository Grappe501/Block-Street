"use client";

import { useEffect, useState } from "react";
import out from "../../../data/registry/civic-outcomes.json";
import type { OutcomeDashboard, OutcomeRecord } from "@/lib/civic-outcomes/types";

type Tab = "dashboard" | "outcomes" | "demo" | "audit";

const PROGRAM = "program-county-leadership";
const COMMUNITY = "community-pulaski-central";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Request failed");
  return data.data ?? data;
}

export function AdminCivicOutcomes() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [dashboard, setDashboard] = useState<OutcomeDashboard | null>(null);
  const [outcomes, setOutcomes] = useState<OutcomeRecord[]>([]);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/civic-outcomes/overview")
      .then((r) => r.json())
      .then((d) => {
        setDashboard(d.dashboard ?? null);
        setOutcomes(d.outcomes ?? []);
        setInstitutionId(d.institution_id ?? null);
        setAudit(d.audit ?? []);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runAcceptanceDemo() {
    if (!institutionId) return;
    setMessage(null);
    try {
      // 1: Baseline for volunteer retention and leadership
      await post("/api/v1/civic-outcomes/theory-of-change", {
        program_id: PROGRAM,
        institution_id: institutionId,
        resources: ["Staff", "Training curriculum", "Mentor network"],
        activities: ["Leadership cohorts", "Mentorship pairing", "Community projects"],
        outputs: ["Training sessions delivered", "Mentorship hours"],
        outcomes: ["Volunteer retention", "Active leaders"],
        long_term_impact: ["Improved community leadership capacity"],
      });

      const retention = await post("/api/v1/civic-outcomes/outcomes", {
        institution_id: institutionId,
        program_id: PROGRAM,
        community_id: COMMUNITY,
        outcome_type: "outcome",
        category: "volunteer_growth",
        domain: "volunteer_capacity",
        indicator: "volunteer_retention",
        baseline: 41,
        target_value: 75,
      });

      const leadership = await post("/api/v1/civic-outcomes/outcomes", {
        institution_id: institutionId,
        program_id: PROGRAM,
        community_id: COMMUNITY,
        outcome_type: "outcome",
        category: "leadership",
        domain: "leadership",
        indicator: "leadership_growth",
        baseline: 22,
        target_value: 65,
      });

      // 2-3: Outputs and verified evidence
      await post("/api/v1/civic-outcomes/outputs", {
        program_id: PROGRAM,
        institution_id: institutionId,
        output_type: "training_sessions",
        description: "Leadership training sessions delivered",
        quantity: 25,
      });

      await post("/api/v1/civic-outcomes/evidence", {
        outcome_record_id: retention.id,
        evidence_type: "participation_record",
        source: "civic_participation_engine",
        verification_level: "institution_verified",
        new_value: 58,
      });

      await post("/api/v1/civic-outcomes/evidence", {
        outcome_record_id: leadership.id,
        evidence_type: "assessment",
        source: "leadership_development_engine",
        verification_level: "leader_verified",
        new_value: 44,
      });

      // 4-5: Impact record + attribution
      const impact = await post("/api/v1/civic-outcomes/outcomes", {
        institution_id: institutionId,
        program_id: PROGRAM,
        community_id: COMMUNITY,
        outcome_type: "impact",
        category: "community_capacity",
        domain: "community_resilience",
        indicator: "community_leadership_capacity",
        baseline: 50,
        target_value: 85,
      });

      const attrRes = await fetch(`/api/v1/civic-outcomes/attribution?outcome_id=${retention.id}`);
      const attrData = await attrRes.json();

      // 6: Executive dashboard
      const analyticsRes = await fetch(`/api/v1/civic-outcomes/analytics?institution_id=${institutionId}`);
      const analyticsData = await analyticsRes.json();

      // 7: AI insights
      const insightsRes = await fetch(`/api/v1/civic-outcomes/insights?institution_id=${institutionId}&program_id=${PROGRAM}`);
      const insightsData = await insightsRes.json();

      // 8: Annual report
      const report = await post("/api/v1/civic-outcomes/reports", {
        report_type: "annual_impact",
        institution_id: institutionId,
        community_id: COMMUNITY,
      });

      // 9: Benchmarking
      const benchRes = await fetch(`/api/v1/civic-outcomes/benchmark?outcome_id=${retention.id}`);
      const benchData = await benchRes.json();

      // 10: Federation
      const fedRes = await fetch("/api/v1/civic-outcomes/federation");
      const fedData = await fedRes.json();

      // 11: Timeline
      await fetch(`/api/v1/civic-outcomes/timeline?outcome_id=${retention.id}`);

      const exec = analyticsData.data?.executive;
      const insight = insightsData.data?.[0]?.title ?? "advisory";

      setMessage(
        `AC-198 acceptance (12 steps): Baselines set (retention 41%→58%, leadership 22%→44%) → ` +
          `25 training outputs recorded → attribution ${attrData.data?.attribution_level ?? "—"} (${attrData.data?.confidence ?? "—"} confidence) → ` +
          `executive effectiveness ${exec?.program_effectiveness_percent ?? "—"}% → AI: ${insight} → ` +
          `report "${report.title}" → benchmark ${benchData.data?.percentile ?? "—"}th percentile → ` +
          `federation index ${fedData.data?.aggregate_impact_index ?? "—"}. Audit complete.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Impact Dashboard" },
    { id: "outcomes", label: "Outcomes" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-rose-500 bg-rose-100">
        <p className="text-xs font-semibold uppercase text-rose-950">BUILD 10.5 · Civic Outcomes & Impact · OUT-001</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">{out.productName}</h2>
        <p className="mt-2 text-sm text-rose-950">{out.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-rose-900">
          {out.requirementId} · {out.acceptanceCriteria} · /api/v1/civic-outcomes
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-rose-800 text-white" : "bg-rose-50 text-rose-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-rose-300 bg-rose-50 p-3 text-xs text-rose-950">{message}</p>}

      {tab === "dashboard" && dashboard && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Programs", dashboard.programs],
            ["Measured Outcomes", dashboard.measured_outcomes],
            ["Positive Trends", dashboard.positive_trends],
            ["Needs Attention", dashboard.needs_attention],
            ["Leadership Growth", `+${dashboard.leadership_growth_percent}%`],
            ["Volunteer Retention", `+${dashboard.volunteer_retention_percent}%`],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-rose-300 bg-white p-3">
              <p className="text-xs text-rose-700">{label}</p>
              <p className="text-lg font-bold text-rose-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "outcomes" && (
        <div className="card max-h-64 overflow-auto border-rose-200 p-3">
          {outcomes.length === 0 ? (
            <p className="text-xs text-rose-700">No outcomes yet — run acceptance demo.</p>
          ) : (
            outcomes.map((o) => (
              <p key={o.id} className="text-xs text-rose-800">
                {o.indicator} ({o.outcome_type}): {o.baseline} → {o.current_value} · {o.attribution_level} · {o.confidence_level}
              </p>
            ))
          )}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-rose-900">
            Full AC-198 (12 steps): baselines → outputs vs outcomes vs impact → verified evidence →
            attribution confidence → executive dashboard → AI evidence gaps → annual report →
            benchmarking → federation aggregates → audit trail.
          </p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-rose-800 px-3 py-1 text-xs font-semibold text-white">
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-rose-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-rose-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
