"use client";

import launchReadiness from "../../../data/launch-readiness.json";

const STATUS_STYLE: Record<string, string> = {
  done: "bg-green-100 text-green-800",
  in_progress: "bg-amber-100 text-amber-800",
  pending: "bg-slate-100 text-slate-600",
  partial: "bg-amber-100 text-amber-800",
};

export function AdminLaunchReadiness() {
  const { missionQuestions, pillars, checklist, summary, leaderTestMinimum, explicitlyNotRequired } = launchReadiness;

  return (
    <div className="space-y-6">
      <div className={`card ${summary.launchReady ? "border-green-300 bg-green-50" : "border-amber-300 bg-amber-50"}`}>
        <p className="text-xs font-semibold uppercase text-slate-600">PHASE-001.7 · Launch Success Definition</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">V1 Launch Readiness</h2>
        <div className="mt-4 flex items-center gap-6">
          <div>
            <p className="text-3xl font-bold text-brand-600">{summary.done}/{summary.total ?? 10}</p>
            <p className="text-sm text-slate-600">Checklist done</p>
          </div>
          <div>
            <p className={`text-lg font-bold ${summary.launchReady ? "text-green-700" : "text-amber-700"}`}>
              {summary.launchReady ? "LAUNCH READY" : "NOT YET"}
            </p>
            <p className="text-sm text-slate-600">Target: Jul 14 · Leader test: Jul 12</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Three Questions [LS-002]</h2>
        <div className="mt-3 space-y-2">
          {missionQuestions.map((q) => (
            <div key={q.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span><span className="font-mono text-brand-600">{q.id}</span> {q.question}</span>
              <span className={`badge ${STATUS_STYLE[q.status]}`}>{q.status.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Seven Launch Pillars</h2>
        <div className="mt-3 space-y-2">
          {pillars.map((p) => (
            <div key={p.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brand-600">{p.id}</span>
                <span className={`badge ${STATUS_STYLE[p.status]}`}>{p.status.replace("_", " ")}</span>
              </div>
              <p className="font-semibold text-slate-900">{p.name}</p>
              <p className="text-sm text-slate-500">{p.notes}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Launch Checklist [LS-CHK]</h2>
        <div className="mt-3 space-y-1">
          {checklist.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded px-2 py-1.5 text-sm hover:bg-slate-50">
              <span className={c.status === "done" ? "text-green-600" : "text-slate-300"}>
                {c.status === "done" ? "✓" : "○"}
              </span>
              <span className="flex-1">{c.item}</span>
              <span className={`badge text-xs ${STATUS_STYLE[c.status]}`}>{c.status.replace("_", " ")}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-amber-800">
          Jul 12 minimum: items {leaderTestMinimum.join(", ")} must work.
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">NOT Required for V1 [LS-DEF]</h2>
        <div className="mt-2 flex flex-wrap gap-1">
          {explicitlyNotRequired.map((item) => (
            <span key={item} className="badge bg-slate-100 text-slate-600">{item}</span>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">Full document: docs/build-steps/PHASE-001.7-LAUNCH-SUCCESS-DEFINITION.md</p>
    </div>
  );
}
