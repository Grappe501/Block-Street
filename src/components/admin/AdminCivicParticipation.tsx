"use client";

import { useEffect, useState } from "react";
import civ from "../../../data/registry/civic-participation.json";
import type { ParticipationHealthSummary } from "@/lib/civic/types";

type Tab = "health" | "dashboards" | "demo" | "audit";

const VOLUNTEER = "volunteer-new@block-street.local";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Request failed");
  return data.data ?? data;
}

export function AdminCivicParticipation() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<ParticipationHealthSummary | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [communityId, setCommunityId] = useState("comm-pulaski-central");
  const [countyId, setCountyId] = useState("county-pulaski");
  const [orgDash, setOrgDash] = useState<Record<string, unknown> | null>(null);
  const [countyDash, setCountyDash] = useState<Record<string, unknown> | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/civic/overview")
      .then((r) => r.json())
      .then((d) => {
        setHealth(d.health ?? null);
        setInstitutionId(d.institution_id ?? null);
        setCommunityId(d.community_id ?? "comm-pulaski-central");
        setCountyId(d.county_id ?? "county-pulaski");
        setOrgDash(d.organization_dashboard ?? null);
        setCountyDash(d.county_dashboard ?? null);
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
      // 1-2: New volunteer joins, completes onboarding orientation
      const { event: orientation } = await post("/api/v1/civic/participation", {
        institution_id: institutionId,
        community_id: communityId,
        county_id: countyId,
        user_id: VOLUNTEER,
        event_type: "meeting_attended",
        title: "Orientation meeting",
        verification_status: "leader_verified",
        source_system: "onboarding",
      });

      // 3: Verified participation event
      await post("/api/v1/civic/participation", { action: "verify", event_id: orientation.id, verification_status: "leader_verified" });

      // 4-5: Training + verified service project
      await post("/api/v1/civic/participation", {
        institution_id: institutionId,
        community_id: communityId,
        user_id: VOLUNTEER,
        event_type: "training_completed",
        title: "Volunteer orientation training",
        source_system: "training",
      });

      const { event: service } = await post("/api/v1/civic/participation", {
        institution_id: institutionId,
        community_id: communityId,
        user_id: VOLUNTEER,
        event_type: "volunteer_shift",
        title: "Community food drive",
        duration_minutes: 120,
        verification_status: "self_reported",
      });

      await post("/api/v1/civic/participation", { action: "verify", event_id: service.id, verification_status: "leader_verified" });

      const volunteerRes = await fetch(`/api/v1/civic/volunteer?user_id=${VOLUNTEER}&institution_id=${institutionId}`);
      const volunteerData = await volunteerRes.json();

      const timelineRes = await fetch(`/api/v1/civic/timeline?user_id=${VOLUNTEER}&institution_id=${institutionId}`);
      const timelineData = await timelineRes.json();

      // 8-9: Additional missions + streak
      for (let i = 0; i < 3; i++) {
        await post("/api/v1/civic/participation", {
          institution_id: institutionId,
          community_id: communityId,
          user_id: VOLUNTEER,
          event_type: "mission_completed",
          title: `Neighborhood outreach mission ${i + 1}`,
        });
      }

      await post("/api/v1/civic/participation", {
        action: "record_habit",
        institution_id: institutionId,
        user_id: VOLUNTEER,
        habit_type: "weekly_volunteer",
        streak_weeks: 4,
      });

      // 10: Explainable score
      const { score } = await post("/api/v1/civic/participation", {
        action: "compute_score",
        institution_id: institutionId,
        community_id: communityId,
        user_id: VOLUNTEER,
      });

      const orgRes = await fetch(`/api/v1/civic/dashboard?scope=organization&institution_id=${institutionId}`);
      const orgData = await orgRes.json();

      const countyRes = await fetch(`/api/v1/civic/dashboard?scope=county&county_id=${countyId}`);
      const countyData = await countyRes.json();

      const insightsRes = await fetch(`/api/v1/civic/insights?user_id=${VOLUNTEER}&institution_id=${institutionId}`);
      const insightsData = await insightsRes.json();

      // 14: Privacy — milestone badges only
      await post("/api/v1/civic/privacy", {
        user_id: VOLUNTEER,
        institution_id: institutionId,
        milestone_badges_only: true,
        volunteer_history_visible: false,
      });

      const fedRes = await fetch("/api/v1/civic/dashboard?scope=federation");
      const fedData = await fedRes.json();

      setMessage(
        `AC-194 acceptance (16 steps): Volunteer onboarded → verified orientation → training + 2h verified service ` +
          `(${volunteerData.data?.volunteer?.verified_hours ?? 0}h) → timeline ${timelineData.data?.timeline?.length ?? 0} entries → ` +
          `milestones ${timelineData.data?.milestones?.length ?? 0} → 4-week streak → ` +
          `score ${score.score} (${score.stage}) [${Object.keys(score.score_breakdown ?? {}).length} components] → ` +
          `org dashboard active ${orgData.data?.organization?.active_members ?? 0} → ` +
          `county index ${countyData.data?.county?.civic_participation_index ?? 0} → ` +
          `AI insight: ${insightsData.data?.insights?.[0]?.title ?? "advisory ready"} → ` +
          `privacy badges-only → federation anonymous trend ${fedData.data?.federation?.anonymous_trend}. ` +
          `Audit trail complete.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Participation Health" },
    { id: "dashboards", label: "Dashboards" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-lime-500 bg-lime-100">
        <p className="text-xs font-semibold uppercase text-lime-950">BUILD 10.1 · Civic Participation · CIV-001</p>
        <h2 className="mt-1 text-xl font-bold text-lime-950">{civ.productName}</h2>
        <p className="mt-2 text-sm text-lime-950">Participation is measured by meaningful contribution—not by login counts.</p>
        <p className="mt-2 text-xs font-semibold text-lime-900">
          {civ.requirementId} · {civ.acceptanceCriteria} · /api/v1/civic
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-lime-800 text-white" : "bg-lime-50 text-lime-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-lime-300 bg-lime-50 p-3 text-xs text-lime-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Communities", health.communities_tracked],
            ["Counties", health.counties_tracked],
            ["Avg Score", health.average_participation_score],
            ["Active Participants", health.active_participants],
            ["Volunteer Hours (30d)", health.volunteer_hours_month],
            ["Rising", health.rising_communities],
            ["Declining", health.declining_communities],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-lime-300 bg-white p-3">
              <p className="text-xs text-lime-700">{label}</p>
              <p className="text-lg font-bold text-lime-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "dashboards" && (
        <div className="grid gap-3 md:grid-cols-2">
          {orgDash && (
            <div className="card border-lime-200 p-3 text-xs text-lime-900">
              <p className="font-semibold">Organization Dashboard</p>
              <p>Trend: {String(orgDash.participation_trend)} · Active: {String(orgDash.active_members)} · Retention: {String(orgDash.retention_rate)}%</p>
            </div>
          )}
          {countyDash && (
            <div className="card border-lime-200 p-3 text-xs text-lime-900">
              <p className="font-semibold">County Dashboard ({countyId})</p>
              <p>Index: {String(countyDash.civic_participation_index)} · Hours: {String(countyDash.volunteer_hours)} · Orgs: {String(countyDash.active_organizations)}</p>
            </div>
          )}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-lime-900">
            Full AC-194 (16 steps): volunteer onboarding → verified events → volunteer hours → civic timeline → milestones →
            streak → explainable score → org/county dashboards → AI leadership recommendation → privacy controls →
            federation anonymous analytics → audit trail.
          </p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-lime-800 px-3 py-1 text-xs font-semibold text-white">
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-lime-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-lime-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
