"use client";

import { useCallback, useEffect, useState } from "react";
import lmb from "../../../data/registry/live-mission-board.json";
import type { Mission, MissionDashboard, MissionTemplate } from "@/lib/missions/types";

function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export function AdminLiveMissionBoard() {
  const [dashboard, setDashboard] = useState<MissionDashboard | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [recommended, setRecommended] = useState<Mission[]>([]);
  const [templates, setTemplates] = useState<MissionTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [allRes, recRes, tplRes] = await Promise.all([
      fetch("/api/missions/today"),
      fetch("/api/missions/recommended"),
      fetch("/api/missions/templates"),
    ]);
    const allData = await allRes.json();
    setDashboard(allData.dashboard);
    setMissions(allData.missions || []);
    const recData = await recRes.json();
    setRecommended(recData.missions || []);
    const tplData = await tplRes.json();
    setTemplates(tplData.templates || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function completeMission(id: string) {
    await fetch(`/api/missions/${id}/complete`, { method: "POST" });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card border-rose-400 bg-rose-100">
        <p className="text-xs font-semibold uppercase text-rose-900">BUILD 7.4 · Live Mission Board</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">{lmb.productName}</h2>
        <p className="mt-2 text-sm text-rose-900">{lmb.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-rose-800">
          {lmb.requirementId} · {lmb.acceptanceCriteria} · Implements {lmb.implements}
        </p>
      </div>

      {dashboard && (
        <div className="card border-rose-200 bg-rose-50/50">
          <h2 className="text-lg font-bold text-rose-950">Mission Dashboard</h2>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs md:grid-cols-6">
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-rose-950">{dashboard.todaysMissions}</p>
              <p className="text-rose-700">Today&apos;s Missions</p>
            </div>
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-rose-950">{dashboard.highPriority}</p>
              <p className="text-rose-700">High Priority</p>
            </div>
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-rose-950">{dashboard.waiting}</p>
              <p className="text-rose-700">Waiting</p>
            </div>
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-rose-950">{dashboard.completedToday}</p>
              <p className="text-rose-700">Completed Today</p>
            </div>
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-rose-950">{dashboard.upcomingDeadlines}</p>
              <p className="text-rose-700">Upcoming Deadlines</p>
            </div>
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-rose-950">{dashboard.missionHealthPercent}%</p>
              <p className="text-rose-700">Mission Health</p>
            </div>
          </div>
        </div>
      )}

      <div className="card border-rose-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-rose-950">Today&apos;s Mission Cards (OIS-M16)</h2>
          {loading && <span className="text-xs text-rose-600">Loading…</span>}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {missions.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border p-3 text-xs ${
                m.status === "blocked" ? "border-red-300 bg-red-50" : "border-rose-100 bg-rose-50/30"
              }`}
            >
              <p className="font-bold text-rose-950">{m.title}</p>
              <p className="text-rose-700">{stars(m.impactStars)} · {m.impact} impact</p>
              <div className="mt-2 grid grid-cols-2 gap-1 text-rose-800">
                <span>Priority: <strong>{m.priorityLabel}</strong></span>
                <span>County: {m.county || "—"}</span>
                <span>Owner: {m.owner}</span>
                <span>Time: {m.estimatedHours}h</span>
                <span>Progress: {m.progressPercent}%</span>
                <span>Health: {m.healthPercent}%</span>
              </div>
              <p className="mt-1 text-rose-600">
                {m.status} · source: {m.source} · risk: {m.risk}
              </p>
              {m.dependencies.length > 0 && (
                <p className="mt-1 text-red-700">
                  Blocked: {m.dependencies.filter((d) => !d.satisfied).map((d) => d.title).join(", ") || "none"}
                </p>
              )}
              {m.status !== "completed" && (
                <button
                  type="button"
                  onClick={() => completeMission(m.id)}
                  className="mt-2 rounded bg-rose-600 px-2 py-1 text-white hover:bg-rose-700"
                >
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card border-rose-200 bg-rose-50/50">
        <h2 className="text-sm font-bold text-rose-950">Recommended / Auto-Generated</h2>
        <ul className="mt-2 space-y-1 text-xs text-rose-900">
          {recommended.map((m) => (
            <li key={m.id} className="rounded bg-white px-2 py-1">
              <span className="font-bold">{m.title}</span> — {m.source} · {m.priorityLabel} · {m.county || "statewide"}
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-rose-200 bg-white">
        <h2 className="text-sm font-bold text-rose-950">Mission Templates</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {templates.map((t) => (
            <div key={t.id} className="rounded border border-rose-100 p-2 text-xs">
              <p className="font-bold text-rose-950">{t.name}</p>
              <p className="text-rose-700">{t.type} · {t.estimatedHours}h · {t.checklist.length} steps</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
