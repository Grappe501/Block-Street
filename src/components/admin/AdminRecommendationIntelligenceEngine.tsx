"use client";

import { useCallback, useEffect, useState } from "react";
import rie from "../../../data/registry/recommendation-intelligence-engine.json";
import type { DailyBriefing, FeedbackAction, Recommendation } from "@/lib/recommendations/types";

export function AdminRecommendationIntelligenceEngine() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [category, setCategory] = useState("");
  const [telemetry, setTelemetry] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [dailyRes, recRes, fbRes] = await Promise.all([
      fetch("/api/recommendations/daily"),
      fetch(`/api/recommendations?limit=20${category ? `&category=${category}` : ""}`),
      fetch("/api/recommendations/feedback"),
    ]);
    setBriefing(await dailyRes.json());
    const recData = await recRes.json();
    setRecommendations(recData.recommendations || []);
    const fbData = await fbRes.json();
    setTelemetry(fbData.telemetry || null);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function sendFeedback(id: string, action: FeedbackAction) {
    await fetch("/api/recommendations/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ recommendationId: id, action, userId: "admin" }),
    });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card border-violet-400 bg-violet-100">
        <p className="text-xs font-semibold uppercase text-violet-900">BUILD 7.2 · Recommendation Intelligence Engine</p>
        <h2 className="mt-1 text-xl font-bold text-violet-950">{rie.productName}</h2>
        <p className="mt-2 text-sm text-violet-900">{rie.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-violet-800">
          {rie.requirementId} · {rie.acceptanceCriteria} · Advisory only
        </p>
      </div>

      {briefing && (
        <div className="card border-violet-200 bg-violet-50/50">
          <h2 className="text-lg font-bold text-violet-950">{briefing.greeting}</h2>
          <p className="mt-1 text-sm text-violet-900">Today&apos;s Intelligence</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-violet-950">{briefing.campaignHealthPercent}%</p>
              <p className="text-violet-700">Campaign Health</p>
            </div>
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-violet-950">{briefing.immediateActions}</p>
              <p className="text-violet-700">Immediate Actions</p>
            </div>
            <div className="rounded-lg bg-white p-2">
              <p className="font-bold text-violet-950">{briefing.highPriority}</p>
              <p className="text-violet-700">High Priority</p>
            </div>
          </div>
          <ol className="mt-3 list-inside list-decimal space-y-1 text-xs text-violet-900">
            {briefing.priorities.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="card border-violet-200 bg-white">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-violet-800">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded border border-violet-200 px-2 py-1 text-xs"
          >
            <option value="">All</option>
            {rie.recommendationCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {loading && <span className="text-xs text-violet-600">Loading…</span>}
        </div>
      </div>

      <div className="grid gap-3">
        {recommendations.map((r) => (
          <div
            key={r.id}
            className={`card border-l-4 ${
              r.status === "accepted"
                ? "border-emerald-400 bg-emerald-50/30"
                : r.status === "dismissed"
                  ? "border-slate-300 bg-slate-50 opacity-60"
                  : "border-violet-300 bg-violet-50/30"
            }`}
          >
            <div className="flex justify-between gap-2">
              <div>
                <p className="font-bold text-violet-950">{r.title}</p>
                <p className="text-xs text-violet-800">{r.subtitle}</p>
              </div>
              <span className="shrink-0 text-xs font-bold text-violet-700">{r.confidence}%</span>
            </div>
            <ul className="mt-2 list-inside list-disc text-xs text-violet-700">
              {r.evidence.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-violet-600">
              Score {r.score} · {r.priority} · {r.category}
              {r.campaignGoal ? ` · ${r.campaignGoal}` : ""}
            </p>
            {r.status === "active" && (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => sendFeedback(r.id, "accept")}
                  className="rounded bg-violet-600 px-2 py-1 text-xs text-white hover:bg-violet-700"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => sendFeedback(r.id, "dismiss")}
                  className="rounded border border-violet-300 px-2 py-1 text-xs text-violet-800"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => sendFeedback(r.id, "remind_later")}
                  className="rounded border border-violet-300 px-2 py-1 text-xs text-violet-800"
                >
                  Remind Later
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {telemetry && (
        <div className="card border-violet-200 bg-violet-50/50 text-xs text-violet-800">
          <p>
            Generated: {String(telemetry.recommendationsGenerated)} · Feedback: {String(telemetry.feedbackRecorded)} ·
            Accepted: {String(telemetry.accepted)} · Avg confidence: {String(telemetry.averageConfidence)}%
          </p>
        </div>
      )}
    </div>
  );
}
