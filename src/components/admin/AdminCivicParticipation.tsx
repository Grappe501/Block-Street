"use client";

import { useEffect, useState } from "react";
import civ from "../../../data/registry/civic-participation.json";
import type { ParticipationHealthSummary } from "@/lib/civic/types";

type Tab = "health" | "scores" | "demo" | "audit";

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
  const [communityId, setCommunityId] = useState<string>("comm-pulaski-central");
  const [scores, setScores] = useState<Record<string, unknown>[]>([]);
  const [trends, setTrends] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/civic/overview")
      .then((r) => r.json())
      .then((d) => {
        setHealth(d.health ?? null);
        setInstitutionId(d.institution_id ?? null);
        setCommunityId(d.community_id ?? "comm-pulaski-central");
        setScores(d.scores ?? []);
        setTrends(d.trends ?? []);
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
      await post("/api/v1/civic/participation", {
        institution_id: institutionId,
        community_id: communityId,
        user_id: "organizer@block-street.local",
        event_type: "volunteer_shift",
        title: "Weekend canvass shift",
        duration_minutes: 180,
        participants_count: 12,
      });

      await post("/api/v1/civic/participation", {
        institution_id: institutionId,
        community_id: communityId,
        user_id: "director@block-street.local",
        event_type: "meeting_attended",
        title: "Community planning meeting",
        duration_minutes: 90,
        participants_count: 24,
      });

      await post("/api/v1/civic/participation", {
        institution_id: institutionId,
        community_id: communityId,
        user_id: "organizer@block-street.local",
        event_type: "mission_completed",
        title: "Voter registration drive",
        participants_count: 8,
      });

      await post("/api/v1/civic/participation", {
        institution_id: institutionId,
        community_id: communityId,
        user_id: "volunteer-001@block-street.local",
        event_type: "membership_joined",
        title: "New community member",
      });

      await post("/api/v1/civic/participation", {
        action: "record_habit",
        institution_id: institutionId,
        user_id: "organizer@block-street.local",
        habit_type: "weekly_volunteer",
        streak_weeks: 6,
      });

      const { score } = await post("/api/v1/civic/participation", {
        action: "compute_score",
        institution_id: institutionId,
        community_id: communityId,
      });

      const trendsRes = await fetch(`/api/v1/civic/engagement?institution_id=${institutionId}`);
      const trendsData = await trendsRes.json();

      const forecastRes = await fetch(`/api/v1/civic/forecast?institution_id=${institutionId}&community_id=${communityId}`);
      const forecastData = await forecastRes.json();

      setMessage(
        `AC-194 acceptance complete: Participation recorded → civic habits tracked → ` +
          `Civic Participation Score ${score.score} (${score.stage}) → ` +
          `engagement trend ${trendsData.data?.trends?.[0]?.direction ?? "stable"} → ` +
          `90-day forecast: ${forecastData.data?.forecast?.projected_participants ?? "—"} projected participants. ` +
          `Communities are becoming measurable—not just institutions operating.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Participation Health" },
    { id: "scores", label: "Scores & Trends" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-lime-500 bg-lime-100">
        <p className="text-xs font-semibold uppercase text-lime-950">BUILD 10.1 · Civic Participation · CIV-001</p>
        <h2 className="mt-1 text-xl font-bold text-lime-950">{civ.productName}</h2>
        <p className="mt-2 text-sm text-lime-950">{civ.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-lime-900">
          {civ.requirementId} · {civ.acceptanceCriteria} · /api/v1/civic
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-lime-800 text-white" : "bg-lime-50 text-lime-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-lime-300 bg-lime-50 p-3 text-xs text-lime-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Communities Tracked", health.communities_tracked],
            ["Avg Participation Score", health.average_participation_score],
            ["Active Participants", health.active_participants],
            ["Volunteer Hours (30d)", health.volunteer_hours_month],
            ["Membership Growth", `${health.membership_growth_rate}%`],
            ["Rising Communities", health.rising_communities],
            ["Declining Communities", health.declining_communities],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-lime-300 bg-white p-3">
              <p className="text-xs text-lime-700">{label}</p>
              <p className="text-lg font-bold text-lime-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "scores" && (
        <div className="space-y-2">
          {scores.map((s) => (
            <div key={String(s.community_id)} className="card border-lime-200 p-3 text-xs text-lime-900">
              <p className="font-semibold">Community {String(s.community_id)} · Score {String(s.score)}</p>
              <p>Stage: {String(s.stage)} · Volunteer {String(s.volunteer_activity)} · Missions {String(s.mission_completion)}</p>
            </div>
          ))}
          {trends.map((t) => (
            <p key={String(t.community_id)} className="text-xs text-lime-700">
              Trend {String(t.community_id)}: {String(t.direction)} · index {String(t.participation_index)}
            </p>
          ))}
          {scores.length === 0 && <p className="text-xs text-lime-700">No scores yet — run the acceptance demo.</p>}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-lime-900">
            Run full AC-194 acceptance path: record volunteer activity, attendance, missions, membership → track civic
            habits → compute Civic Participation Score → engagement trends → 90-day participation forecast.
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
