"use client";

import { useEffect, useState } from "react";
import intel from "../../../data/registry/strategic-intelligence.json";
import type { StrategicDashboard } from "@/lib/strategic-intelligence/types";

type Tab = "dashboard" | "decisions" | "demo" | "audit";

const COUNTY = "pulaski";
const REVIEWER = "director@block-street.local";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Request failed");
  return data.data ?? data;
}

export function AdminStrategicIntelligence() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [dashboard, setDashboard] = useState<StrategicDashboard | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/strategic-intelligence/overview")
      .then((r) => r.json())
      .then((d) => {
        setDashboard(d.dashboard ?? null);
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
      // 1-2: Aggregate data and generate insights
      const cycle = await post("/api/v1/strategic-intelligence/cycle", {
        institution_id: institutionId,
        county_id: COUNTY,
      });

      // 3: Early warning with concern level
      const mentorWarning = cycle.warnings?.find((w: { warning_type: string }) =>
        w.warning_type.includes("mentor")
      );

      // 4: AI recommendation
      const mentorRec = cycle.recommendations?.find((r: { recommendation_type: string }) =>
        r.recommendation_type === "mentor_development"
      );

      // 5-6: Decision support + scenario comparison
      let decisionSupport = null;
      if (mentorRec) {
        const dsRes = await fetch(`/api/v1/strategic-intelligence/decision-support?recommendation_id=${mentorRec.id}`);
        decisionSupport = (await dsRes.json()).data;
      }

      const withCohort = await post("/api/v1/strategic-intelligence/scenarios", {
        institution_id: institutionId,
        name: "With mentor development cohort",
        assumptions: ["6 new mentors trained", "Mentor load redistributed"],
        inputs: { new_mentors: 6, cohort_duration_months: 6 },
        expected_outcomes: ["Mentorship capacity +40%", "Burnout risk reduced"],
      });

      const withoutCohort = await post("/api/v1/strategic-intelligence/scenarios", {
        institution_id: institutionId,
        name: "Without additional mentor recruitment",
        assumptions: ["Current mentor load continues", "No new recruitment"],
        inputs: { new_mentors: 0 },
        expected_outcomes: ["Mentorship capacity stable or declining", "Burnout risk increases"],
      });

      const compareRes = await fetch(
        `/api/v1/strategic-intelligence/scenarios?institution_id=${institutionId}&compare=${withCohort.id},${withoutCohort.id}`
      );
      const compareData = await compareRes.json();

      // 7: Leader approves recommendation
      let decision = null;
      if (mentorRec) {
        decision = await post("/api/v1/strategic-intelligence/decisions", {
          institution_id: institutionId,
          recommendation_id: mentorRec.id,
          reviewer_id: REVIEWER,
          decision: "approved",
          rationale: "Mentorship capacity critical for county leadership pipeline",
          evidence_reviewed: mentorWarning?.supporting_evidence ?? [],
        });
      }

      // 8-9: Cohort launched → outcome recorded (simulated 6 months later)
      if (decision && mentorRec) {
        await post("/api/v1/strategic-intelligence/decisions", {
          action: "record_outcome",
          institution_id: institutionId,
          recommendation_id: mentorRec.id,
          decision_id: decision.id,
          success: true,
          outcome_notes: "Mentor development cohort launched; mentorship capacity improved",
          lessons_learned: "Early mentor recruitment prevents burnout; redistribute load proactively",
        });
      }

      // 10-11: Executive dashboard + learning
      const analyticsRes = await fetch(`/api/v1/strategic-intelligence/analytics?institution_id=${institutionId}`);
      const analyticsData = await analyticsRes.json();
      const learningRes = await fetch(`/api/v1/strategic-intelligence/learning?institution_id=${institutionId}`);
      const learningData = await learningRes.json();

      // 12: Federation best practices
      const fedRes = await fetch("/api/v1/strategic-intelligence/federation");
      const fedData = await fedRes.json();

      // 13-14: Advisor uses learning
      const advisorRes = await fetch(`/api/v1/strategic-intelligence/advisor?institution_id=${institutionId}`);
      const advisorData = await advisorRes.json();

      const exec = analyticsData.data;
      const warningLevel = mentorWarning?.warning_level ?? "—";
      const recSummary = mentorRec?.summary ?? "—";

      setMessage(
        `AC-199 acceptance (15 steps): Intelligence cycle (${cycle.insights?.length ?? 0} insights) → ` +
          `warning "${mentorWarning?.title ?? "assessed"}" (${warningLevel}) → ` +
          `AI: ${recSummary} → ` +
          `scenario comparison (${compareData.data?.comparison?.length ?? 0} scenarios) → ` +
          `decision approved → cohort outcome recorded → ` +
          `learning entries: ${learningData.data?.length ?? 0} → ` +
          `federation practices: ${fedData.data?.emerging_best_practices?.length ?? 0} → ` +
          `advisor: ${advisorData.data?.[0]?.answer?.slice(0, 60) ?? "—"}… Audit complete.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Strategic Dashboard" },
    { id: "decisions", label: "Planning" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-indigo-500 bg-indigo-100">
        <p className="text-xs font-semibold uppercase text-indigo-950">BUILD 10.6 · Strategic Intelligence · INT-002</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{intel.productName}</h2>
        <p className="mt-2 text-sm text-indigo-950">{intel.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-indigo-900">
          {intel.requirementId} · {intel.acceptanceCriteria} · /api/v1/strategic-intelligence
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-indigo-800 text-white" : "bg-indigo-50 text-indigo-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-indigo-300 bg-indigo-50 p-3 text-xs text-indigo-950">{message}</p>}

      {tab === "dashboard" && dashboard && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Strategic Opportunities", dashboard.strategic_opportunities],
            ["High Risks", dashboard.high_risks],
            ["Active Warnings", dashboard.active_warnings],
            ["Leadership Forecast", dashboard.leadership_forecast],
            ["Volunteer Trend", dashboard.volunteer_trend],
            ["Community Capacity", dashboard.community_capacity],
            ["Top Recommendation", dashboard.top_recommendation ?? "—"],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-indigo-300 bg-white p-3">
              <p className="text-xs text-indigo-700">{label}</p>
              <p className="text-sm font-bold text-indigo-950">{String(value)}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "decisions" && (
        <div className="card border-indigo-200 p-3 text-xs text-indigo-900">
          <p className="font-semibold">Decision Support Center</p>
          <p>Every recommendation requires human approval. Evidence, confidence, alternatives, and tradeoffs are always visible.</p>
          <p className="mt-2">No autonomous execution. Complete audit trail for all decisions.</p>
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-indigo-900">
            Full AC-199 (15 steps): intelligence cycle → mentorship warning → AI recommendation →
            decision support → scenario comparison → leader approval → cohort outcome →
            institutional learning → federation best practices → updated advisor → audit trail.
          </p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-indigo-800 px-3 py-1 text-xs font-semibold text-white">
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-indigo-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-indigo-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
