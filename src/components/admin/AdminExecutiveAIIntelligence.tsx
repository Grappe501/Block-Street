"use client";

import { useCallback, useEffect, useState } from "react";
import eail from "../../../data/registry/executive-ai-intelligence-layer.json";
import type { AIResponse, AuditEntry, MemoryEntry, MorningBrief } from "@/lib/ai/types";

const SAMPLE_PROMPTS = [
  "Summarize campaign health",
  "Why is Benton County slowing?",
  "Which counties need immediate attention?",
  "Who are our strongest education partners?",
];

export function AdminExecutiveAIIntelligence() {
  const [brief, setBrief] = useState<MorningBrief | null>(null);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [history, setHistory] = useState<AuditEntry[]>([]);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const [briefRes, memRes, histRes] = await Promise.all([
      fetch("/api/ai/chat"),
      fetch("/api/ai/memory"),
      fetch("/api/ai/history"),
    ]);
    const briefData = await briefRes.json();
    const memData = await memRes.json();
    const histData = await histRes.json();
    setBrief(briefData.brief);
    setMemory(memData.entries || []);
    setHistory(histData.history || []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function ask(p: string) {
    setLoading(true);
    setPrompt(p);
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: p, userId: "admin" }),
    });
    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card border-indigo-400 bg-indigo-100">
        <p className="text-xs font-semibold uppercase text-indigo-900">BUILD 7.6 · Executive AI Intelligence Layer · PHASE 7 CLOSEOUT</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{eail.productName}</h2>
        <p className="mt-2 text-sm text-indigo-900">{eail.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-indigo-800">
          {eail.requirementId} · {eail.acceptanceCriteria} · Implements {eail.implements}
        </p>
      </div>

      {brief && (
        <div className="card border-indigo-200 bg-indigo-50/50">
          <h2 className="text-lg font-bold text-indigo-950">{brief.greeting}</h2>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs md:grid-cols-7">
            <div className="rounded-lg bg-white p-2"><p className="font-bold">{brief.campaignHealthPercent}%</p><p>Campaign Health</p></div>
            <div className="rounded-lg bg-white p-2"><p className="font-bold">{brief.todaysPriorities}</p><p>Today&apos;s Priorities</p></div>
            <div className="rounded-lg bg-white p-2"><p className="font-bold">{brief.criticalDeadlines}</p><p>Critical Deadlines</p></div>
            <div className="rounded-lg bg-white p-2"><p className="font-bold text-xs">{brief.travel}</p><p>Travel</p></div>
            <div className="rounded-lg bg-white p-2"><p className="font-bold">{brief.volunteerAlerts}</p><p>Volunteer Alerts</p></div>
            <div className="rounded-lg bg-white p-2"><p className="font-bold">{brief.countyAlerts}</p><p>County Alerts</p></div>
            <div className="rounded-lg bg-white p-2"><p className="font-bold">{brief.recommendedCalls}</p><p>Recommended Calls</p></div>
          </div>
        </div>
      )}

      <div className="card border-indigo-200 bg-white">
        <h2 className="text-sm font-bold text-indigo-950">Executive AI Chat</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((p) => (
            <button key={p} type="button" onClick={() => ask(p)} className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-900 hover:bg-indigo-200">
              {p}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && prompt && ask(prompt)}
            placeholder="Ask the campaign strategist…"
            className="w-full rounded border border-indigo-200 px-3 py-2 text-sm"
          />
        </div>
        {loading && <p className="mt-2 text-xs text-indigo-600">Thinking…</p>}
        {response && (
          <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/30 p-3 text-xs text-indigo-900">
            <p className="whitespace-pre-wrap">{response.answer}</p>
            <p className="mt-2 text-indigo-700">
              Confidence {response.confidencePercent}% · {response.category}
              {response.requiresApproval && " · Approval required"}
            </p>
            <ul className="mt-2 list-inside list-disc text-indigo-600">
              {response.evidence.map((e, i) => (
                <li key={i}>{e.source}: {e.detail} ({e.type})</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card border-indigo-200 bg-indigo-50/50">
        <h2 className="text-sm font-bold text-indigo-950">AI Memory (inspectable · editable)</h2>
        <ul className="mt-2 space-y-1 text-xs text-indigo-900">
          {memory.map((m) => (
            <li key={m.id} className="rounded bg-white px-2 py-1">
              <span className="font-bold">{m.key}</span> — {m.value}
              <span className="text-indigo-600"> · {m.scope}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-indigo-200 bg-white">
        <h2 className="text-sm font-bold text-indigo-950">Audit Trail</h2>
        <ul className="mt-2 space-y-1 text-xs text-indigo-900">
          {history.map((h, i) => (
            <li key={i} className="rounded border border-indigo-100 px-2 py-1">
              <span className="font-mono text-indigo-600">{h.timestamp.slice(0, 19)}</span> · {h.action} · {h.category}
              <p className="text-indigo-700">{h.prompt}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-indigo-300 bg-indigo-100">
        <h2 className="text-sm font-bold text-indigo-950">Phase 7 Complete</h2>
        <p className="mt-1 text-xs text-indigo-900">
          7.1 Search · 7.2 Recommendations · 7.3 Analytics · 7.4 Missions · 7.5 Relationships · 7.6 Executive AI
        </p>
      </div>
    </div>
  );
}
