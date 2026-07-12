"use client";

import { useEffect, useState } from "react";
import ldr from "../../../data/registry/leadership-development.json";
import type { LeadershipHealthSummary } from "@/lib/leadership/types";

type Tab = "health" | "pipeline" | "demo" | "audit";

const VOLUNTEER = "volunteer-emerging@block-street.local";
const MENTOR = "director@block-street.local";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Request failed");
  return data.data ?? data;
}

export function AdminLeadershipDevelopment() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<LeadershipHealthSummary | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [executive, setExecutive] = useState<Record<string, unknown> | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/leadership/overview")
      .then((r) => r.json())
      .then((d) => {
        setHealth(d.health ?? null);
        setInstitutionId(d.institution_id ?? null);
        setExecutive(d.executive ?? null);
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
      // 1-2: Consistent participation → verified evidence
      await post("/api/v1/leadership/evidence", {
        user_id: VOLUNTEER,
        institution_id: institutionId,
        competency: "Organization",
        activity_type: "organized_project",
        verification_level: "leader_verified",
      });
      await post("/api/v1/leadership/evidence", {
        user_id: VOLUNTEER,
        institution_id: institutionId,
        competency: "Coaching",
        activity_type: "mentored_volunteer",
        verification_level: "leader_verified",
      });

      // 3: Emerging leader identification
      const { emerging_leaders } = await post("/api/v1/leadership/profiles", {
        action: "identify_emerging",
        institution_id: institutionId,
        user_id: VOLUNTEER,
      });

      // 4: Assign mentor
      await post("/api/v1/leadership/mentorship", {
        mentor_id: MENTOR,
        mentee_id: VOLUNTEER,
        institution_id: institutionId,
      });

      // 5: Development plan
      const { plan } = await post("/api/v1/leadership/development-plans", {
        user_id: VOLUNTEER,
        institution_id: institutionId,
        mentor_id: MENTOR,
        target_stage: "team_leader",
      });

      // 6: Join county cohort
      const { cohort } = await post("/api/v1/leadership/cohorts", {
        institution_id: institutionId,
        name: "Pulaski County Leadership Cohort",
        cohort_type: "county",
        mentor_ids: [MENTOR],
      });
      await post("/api/v1/leadership/cohorts", {
        action: "join",
        cohort_id: cohort.id,
        user_id: VOLUNTEER,
        institution_id: institutionId,
      });

      // 7: Lead community meeting
      await post("/api/v1/leadership/evidence", {
        user_id: VOLUNTEER,
        institution_id: institutionId,
        competency: "Communication",
        activity_type: "led_meeting",
        verification_level: "leader_verified",
        impact_score: 5,
      });

      // 8-9: Score update
      const { profile, opportunities } = await post("/api/v1/leadership/profiles", {
        action: "compute_score",
        institution_id: institutionId,
        user_id: VOLUNTEER,
      });

      // 10: Team leader opportunity
      const teamLeader = opportunities?.[0]?.title ?? "pending";

      // 11: Executive dashboard
      const execRes = await fetch(`/api/v1/leadership/analytics?institution_id=${institutionId}`);
      const execData = await execRes.json();

      // 12: Succession plan
      const { plan: succession } = await post("/api/v1/leadership/succession", {
        institution_id: institutionId,
        role: "County Field Coordinator",
        current_leader_id: MENTOR,
        candidate_user_ids: [VOLUNTEER],
      });

      // 13: AI insights (advisory)
      const insightsRes = await fetch(`/api/v1/leadership/insights?user_id=${VOLUNTEER}&institution_id=${institutionId}`);
      const insightsData = await insightsRes.json();

      // 14: Privacy
      await post("/api/v1/leadership/insights", {
        user_id: VOLUNTEER,
        institution_id: institutionId,
        public_leadership_profile: true,
        achievement_sharing: true,
        evaluations_private: true,
      });

      // 15: Analytics health
      const healthData = execData.data?.health;

      setMessage(
        `AC-195 acceptance (16 steps): Verified evidence → Emerging Leader identified (${emerging_leaders?.length ?? 0}) → ` +
          `mentor ${MENTOR} assigned → development plan ${plan.id.slice(0, 12)}… → cohort joined → ` +
          `led meeting → score ${profile.leadership_score} (${profile.leadership_stage}) → ` +
          `opportunity: ${teamLeader} → executive pipeline ${execData.data?.executive?.pipeline_health} → ` +
          `succession candidate (${succession.risk_level}) → AI: ${insightsData.data?.insights?.[0]?.title ?? "advisory"} → ` +
          `privacy set → mentor capacity ${healthData?.mentor_capacity_percent ?? "—"}%. Audit complete.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Leadership Health" },
    { id: "pipeline", label: "Pipeline" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-amber-500 bg-amber-100">
        <p className="text-xs font-semibold uppercase text-amber-950">BUILD 10.2 · Leadership Development · LDR-001</p>
        <h2 className="mt-1 text-xl font-bold text-amber-950">{ldr.productName}</h2>
        <p className="mt-2 text-sm text-amber-950">{ldr.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-amber-900">
          {ldr.requirementId} · {ldr.acceptanceCriteria} · /api/v1/leadership
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-amber-800 text-white" : "bg-amber-50 text-amber-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Pipeline Depth", health.pipeline_depth],
            ["Emerging Leaders", health.emerging_leaders],
            ["Avg Leadership Score", health.average_leadership_score],
            ["Mentor Capacity", `${health.mentor_capacity_percent}%`],
            ["Succession Ready", `${health.succession_ready_percent}%`],
            ["High Risk Roles", health.high_risk_roles],
            ["Active Cohorts", health.cohorts_active],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-amber-300 bg-white p-3">
              <p className="text-xs text-amber-700">{label}</p>
              <p className="text-lg font-bold text-amber-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "pipeline" && executive && (
        <div className="card border-amber-200 p-3 text-xs text-amber-900">
          <p className="font-semibold">Executive Leadership Dashboard</p>
          <p>Pipeline: {String(executive.pipeline_health)} · Emerging: {String(executive.emerging_leaders)} · Succession: {String(executive.succession_health)}</p>
          <p>Mentors available: {String(executive.mentor_availability)} · Cohort progress: {String(executive.cohort_progress_percent)}%</p>
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-amber-900">
            Full AC-195 (16 steps): evidence → emerging leader → mentorship → development plan → cohort → lead meeting →
            score → team leader opportunity → executive dashboard → succession → AI advisory → privacy → analytics → audit.
          </p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-amber-800 px-3 py-1 text-xs font-semibold text-white">
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-amber-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-amber-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
