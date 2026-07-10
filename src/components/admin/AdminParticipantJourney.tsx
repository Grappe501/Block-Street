"use client";

import systems from "../../../data/living-systems.json";
import journey from "../../../data/registry/participant-journey.json";

export function AdminParticipantJourney() {
  return (
    <div className="space-y-6">
      <div className="card border-rose-300 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">Living Systems · Participant Journey</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">One Step Forward</h2>
        <p className="mt-2 text-sm font-medium text-rose-900">{journey.motto}</p>
        <p className="mt-1 text-sm text-rose-800">{journey.principle}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Living Systems Stack</h2>
        <div className="mt-3 space-y-1">
          {systems.stack.map((layer) => (
            <div
              key={layer.phase}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                layer.status === "complete"
                  ? "border-green-200 bg-green-50"
                  : layer.status === "active"
                    ? "border-brand-300 bg-brand-50"
                    : "border-slate-200 bg-white"
              }`}
            >
              <span>
                <span className="font-mono text-xs text-brand-600">P{layer.phase}</span>{" "}
                <span className="font-semibold">{layer.name}</span>
                <span className="ml-2 text-slate-500 italic">{layer.question}</span>
              </span>
              <span className="badge text-xs">{layer.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Three Pillars [JRN-M03]</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {journey.threePillars.map((p) => (
            <div key={p.id} className="rounded-lg border border-brand-200 bg-white p-3 text-sm">
              <p className="font-bold capitalize text-brand-900">{p.id}</p>
              <p className="text-xs text-slate-500">{p.source}</p>
              <p className="mt-1 font-medium text-slate-800">{p.question}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Journey Stages [JRN-M04]</h2>
        <div className="mt-3 flex flex-wrap items-center gap-1 text-sm">
          {journey.stages.map((stage, i) => (
            <span key={stage.key} className="flex items-center gap-1">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  stage.v1 === "target" || stage.v1 === "done"
                    ? "bg-brand-100 text-brand-800"
                    : stage.v1 === "signals" || stage.v1 === "partial"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {stage.label}
              </span>
              {i < journey.stages.length - 1 && <span className="text-slate-300">↓</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Suggested Next Actions [JRN-M10]</h2>
        <div className="mt-2 space-y-1">
          {journey.nextActionsByStage.map((item) => (
            <div key={item.stage} className="flex justify-between text-xs">
              <span className="font-mono text-brand-600">{item.stage}</span>
              <span className="text-slate-700">{item.action}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Living Systems: docs/master/LIVING-SYSTEMS-ARCHITECTURE.md · Journey: JRN-001
      </p>
    </div>
  );
}
