"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  ExecutiveOptimizationBrief,
  OptimizationRecommendation,
  OrganizationHealthDimension,
} from "@/lib/civic-action/builds/11.1/optimization/contracts";
import { OptimizationCard } from "./OptimizationCard";
import { InstitutionHealthPanel } from "./InstitutionHealthPanel";
import { SimulationBuilder } from "./SimulationBuilder";

export function ImprovementDashboard() {
  const [brief, setBrief] = useState<ExecutiveOptimizationBrief | null>(null);
  const [health, setHealth] = useState<OrganizationHealthDimension[]>([]);
  const [training, setTraining] = useState<string[]>([]);
  const [community, setCommunity] = useState<{ title: string; summary: string }[]>([]);
  const [simResult, setSimResult] = useState<{ outcomes: string[]; risks: string[]; note: string } | null>(null);
  const [query, setQuery] = useState("");
  const [advisorAnswer, setAdvisorAnswer] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/v1/optimization")
      .then((r) => r.json())
      .then((d) => {
        setBrief(d.data?.executive_brief ?? null);
        setHealth(d.data?.optimization?.health_summary ?? []);
      });
    fetch("/api/v1/optimization/training")
      .then((r) => r.json())
      .then((d) => setTraining(d.data?.training_needs ?? []));
    fetch("/api/v1/optimization/community")
      .then((r) => r.json())
      .then((d) =>
        setCommunity((d.data?.community ?? []).map((c: { title: string; summary: string }) => ({ title: c.title, summary: c.summary })))
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleFeedback(id: string, action: "accepted" | "rejected" | "deferred") {
    await fetch("/api/v1/optimization/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optimization_id: id, action }),
    });
    load();
  }

  async function askAdvisor(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const res = await fetch("/api/v1/ai/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setAdvisorAnswer(data.data?.answer ?? data.answer ?? "No answer");
  }

  const opportunities = brief?.todays_opportunities ?? [];

  return (
    <div className="space-y-8">
      {brief && (
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Executive morning brief</h2>
          <p className="text-xs text-slate-500">Yesterday we learned · Today&apos;s opportunities · Advisory only</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Yesterday we learned</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {brief.yesterday_we_learned.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Emerging risks</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {brief.emerging_risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
          {brief.strategic_opportunities.length > 0 && (
            <p className="mt-4 text-sm text-slate-700">
              <span className="font-medium">Strategic opportunities:</span> {brief.strategic_opportunities.join(" · ")}
            </p>
          )}
        </section>
      )}

      {health.length > 0 && <InstitutionHealthPanel dimensions={health} />}

      {opportunities.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Suggested optimizations</h2>
          <div className="mt-4 space-y-3">
            {opportunities.map((r: OptimizationRecommendation) => (
              <OptimizationCard key={r.optimization_id} recommendation={r} onFeedback={handleFeedback} />
            ))}
          </div>
        </section>
      )}

      {training.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Training intelligence</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {training.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {community.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Community insights</h2>
          <ul className="mt-3 space-y-3">
            {community.map((c) => (
              <li key={c.title} className="text-sm">
                <span className="font-medium text-slate-900">{c.title}</span>
                <p className="text-slate-600">{c.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SimulationBuilder onResult={setSimResult} />
      {simResult && (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          <h3 className="font-semibold text-slate-900">Simulation results</h3>
          <ul className="mt-2 list-disc pl-5 text-slate-700">
            {simResult.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          {simResult.risks.length > 0 && (
            <>
              <h4 className="mt-3 font-medium text-slate-800">Risks</h4>
              <ul className="list-disc pl-5 text-slate-600">
                {simResult.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-2 text-xs text-slate-500">{simResult.note}</p>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Optimization advisor</h2>
        <form onSubmit={askAdvisor} className="mt-3 flex flex-wrap gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="How can we reduce approval delays?"
            className="min-w-[240px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900">
            Ask
          </button>
        </form>
        {advisorAnswer && <p className="mt-3 text-sm text-slate-700">{advisorAnswer}</p>}
      </section>
    </div>
  );
}
