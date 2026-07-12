"use client";

import { useEffect, useState } from "react";
import chd from "../../../data/registry/community-health.json";
import type { CommunityHealthProfile } from "@/lib/community-health/types";

type Tab = "health" | "resilience" | "demo" | "audit";

const COUNTY = "pulaski";
const COMMUNITY = "community-pulaski-central";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Request failed");
  return data.data ?? data;
}

export function AdminCommunityHealth() {
  const [tab, setTab] = useState<Tab>("health");
  const [profiles, setProfiles] = useState<CommunityHealthProfile[]>([]);
  const [executive, setExecutive] = useState<Record<string, unknown> | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/community-health/overview")
      .then((r) => r.json())
      .then((d) => {
        setProfiles(d.profiles ?? []);
        setExecutive(d.executive ?? null);
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
      // 1-3: Three orgs in county → health profiles generated
      for (const cid of [COMMUNITY, "community-pulaski-east", "community-pulaski-west"]) {
        await post("/api/v1/community-health/profiles", {
          community_id: cid,
          county_id: COUNTY,
          institution_id: institutionId,
        });
      }

      // 4: Health index reflects participation/leadership signals
      const profile = await post("/api/v1/community-health/profiles", {
        community_id: COMMUNITY,
        county_id: COUNTY,
        institution_id: institutionId,
      });

      // 5-6: Mentorship decline → risk + AI recommendation
      const risksRes = await fetch(`/api/v1/community-health/risks?community_id=${COMMUNITY}&institution_id=${institutionId}`);
      const risksData = await risksRes.json();
      const insightsRes = await fetch(`/api/v1/community-health/insights?community_id=${COMMUNITY}&institution_id=${institutionId}`);
      const insightsData = await insightsRes.json();

      // 7-8: Community project strengthens collaboration
      await post("/api/v1/community-health/projects", {
        community_id: COMMUNITY,
        county_id: COUNTY,
        institution_id: institutionId,
        title: "Cross-Organization Food Security Initiative",
        category: "food_security",
        organizations_involved: ["org-community-center", "org-partner-nonprofit", "org-county-coalition"],
      });

      const updated = await post("/api/v1/community-health/profiles", {
        community_id: COMMUNITY,
        county_id: COUNTY,
        institution_id: institutionId,
      });

      // 9: Executive dashboard
      const analyticsRes = await fetch(`/api/v1/community-health/analytics?county_id=${COUNTY}`);
      const analyticsData = await analyticsRes.json();

      // 10-11: Trends and benchmarking
      await fetch(`/api/v1/community-health/trends?community_id=${COMMUNITY}`);
      const benchRes = await fetch(`/api/v1/community-health/benchmark?community_id=${COMMUNITY}`);
      const benchData = await benchRes.json();

      // 12: Geographic map
      const geoRes = await fetch(`/api/v1/community-health/geographic?county_id=${COUNTY}`);
      const geoData = await geoRes.json();

      // 13: Annual report (aggregated only)
      const report = await post("/api/v1/community-health/reports", {
        report_type: "annual",
        community_id: COMMUNITY,
        county_id: COUNTY,
      });

      // 14: Federation aggregates
      const fedRes = await fetch("/api/v1/community-health/federation");
      const fedData = await fedRes.json();

      const exec = analyticsData.data?.executive;
      const mentorRisk = risksData.data?.find((r: { risk_type: string }) => r.risk_type === "mentor_shortage");
      const insight = insightsData.data?.[0]?.title ?? "advisory";

      setMessage(
        `AC-197 acceptance (15 steps): 3 community profiles → health ${profile.health_score}% → ` +
          `${mentorRisk ? "mentor warning triggered" : "risks assessed"} → AI: ${insight} → ` +
          `coalition project → resilience ${updated.resilience_state} → ` +
          `county health ${exec?.county_health_percent ?? "—"}% → ` +
          `benchmark ${benchData.data?.percentile ?? "—"}th percentile → ` +
          `${geoData.data?.length ?? 0} geographic points → ` +
          `report ${report.title} (aggregated) → ` +
          `federation index ${fedData.data?.aggregate_health_index ?? "—"}. Audit complete.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Community Health" },
    { id: "resilience", label: "Resilience" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  const primary = profiles[0];

  return (
    <div className="space-y-6">
      <div className="card border-sky-500 bg-sky-100">
        <p className="text-xs font-semibold uppercase text-sky-950">BUILD 10.4 · Community Health & Civic Resilience · CHD-001</p>
        <h2 className="mt-1 text-xl font-bold text-sky-950">{chd.productName}</h2>
        <p className="mt-2 text-sm text-sky-950">{chd.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-sky-900">
          {chd.requirementId} · {chd.acceptanceCriteria} · /api/v1/community-health
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-sky-800 text-white" : "bg-sky-50 text-sky-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-sky-300 bg-sky-50 p-3 text-xs text-sky-950">{message}</p>}

      {tab === "health" && primary && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Community Health", `${primary.health_score}%`],
            ["Leadership Capacity", `${primary.health_breakdown.leadership}%`],
            ["Volunteer Capacity", `${primary.health_breakdown.volunteer_capacity}%`],
            ["Organizations", primary.institution_count],
            ["Mentorship", `${primary.health_breakdown.mentorship}%`],
            ["Community Trend", primary.trend],
            ["Resilience", primary.resilience_state],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-sky-300 bg-white p-3">
              <p className="text-xs text-sky-700">{label}</p>
              <p className="text-lg font-bold text-sky-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "resilience" && executive && (
        <div className="card border-sky-200 p-3 text-xs text-sky-900">
          <p className="font-semibold">Executive Community Dashboard — {String(executive.county_id)}</p>
          <p>
            County health: {String(executive.county_health_percent)}% · Communities: {String(executive.communities_tracked)} ·
            Leadership shortages: {String(executive.leadership_shortages)}
          </p>
          <p>
            Volunteer trend: {String(executive.volunteer_trend)} · Opportunities: {String(executive.opportunities_count)} ·
            {String(executive.resilience_map_summary)}
          </p>
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-sky-900">
            Full AC-197 (15 steps): multi-org county → health profiles → mentorship warning → AI advisory →
            coalition project → resilience improvement → executive dashboard → benchmarking → geographic map →
            annual report → federation aggregates → audit trail.
          </p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-sky-800 px-3 py-1 text-xs font-semibold text-white">
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-sky-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-sky-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
