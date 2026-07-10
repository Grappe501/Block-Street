"use client";

import outreach from "../../../data/registry/outreach-intelligence.json";

export function AdminOutreachMission() {
  return (
    <div className="space-y-6">
      <div className="card border-green-300 bg-green-50">
        <p className="text-xs font-semibold uppercase text-green-800">PHASE-002.6 · Statewide Mission Board</p>
        <h2 className="mt-1 text-xl font-bold text-green-950">Outreach Intelligence</h2>
        <p className="mt-2 text-sm font-medium text-green-900">{outreach.motto}</p>
        <p className="mt-1 text-sm text-green-800">{outreach.principle}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Primary Questions [OIS-M03]</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
          {outreach.primaryQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Mission Board Preview [OIS-M16]</h2>
        <p className="mt-1 text-sm text-brand-800">Opportunity cards — not chart-first analytics.</p>
        <div className="mt-4 space-y-3">
          {outreach.missionBoardExamples.map((card) => (
            <div key={card.title} className="rounded-lg border border-brand-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{card.title}</p>
                <span className="badge bg-amber-100 text-amber-800 text-xs">{card.priority}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Type: {card.type} · V1: {card.v1}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Dashboard Levels</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {outreach.dashboardLevels.map((d) => (
            <div key={d.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">{d.name}</p>
              <p className="text-slate-500">{d.audience}</p>
              <p className="mt-1 font-mono text-xs text-brand-600">{d.v1Route}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">State Metrics (query-driven)</h2>
        <div className="mt-2 space-y-1">
          {outreach.stateMetrics.map((m) => (
            <div key={m.id} className="flex justify-between text-xs">
              <span className="text-slate-700">{m.label}</span>
              <span className="font-mono text-slate-400">{m.v1 === "pending_db" ? "DB pending" : "registry"}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Full spec: docs/phase-02/STATEWIDE_OUTREACH_INTELLIGENCE.md · OIS-001
      </p>
    </div>
  );
}
