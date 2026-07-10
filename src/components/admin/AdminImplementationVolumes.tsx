"use client";

import ivs from "../../../data/registry/implementation-volumes.json";
import eab from "../../../data/registry/engineering-architecture-bible.json";

export function AdminImplementationVolumes() {
  const vol1 = ivs.volumes.find((v) => v.volume === 1);

  return (
    <div className="space-y-6">
      <div className="card border-indigo-400 bg-indigo-100">
        <p className="text-xs font-semibold uppercase text-indigo-900">Factory Layer · Implementation Volumes 1–7</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{ivs.purpose}</h2>
        <p className="mt-2 text-sm text-indigo-900">{ivs.naturalPause.statement}</p>
        <p className="mt-2 text-xs font-semibold text-indigo-800">
          Volume 1: {eab.stepsComplete}/{eab.stepsTotal} · Volume 2: complete · Volume 3: 14/14 · Volume 4: 1/14 · Volumes 5–7: v1 · Phase 7 deferred
        </p>
      </div>

      <div className="card border-amber-200 bg-amber-50/50">
        <h2 className="text-sm font-bold text-amber-950">The Natural Pause</h2>
        <p className="mt-1 text-xs text-amber-900">
          <span className="font-medium">Product design complete:</span> {ivs.naturalPause.productDesignComplete}
        </p>
        <p className="mt-1 text-xs text-amber-900">
          <span className="font-medium">Factory design cycle:</span> {ivs.naturalPause.factoryDesignCycle}
        </p>
        <p className="mt-2 text-xs text-amber-700">{ivs.docPath}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ivs.volumes.map((vol) => (
          <div key={vol.volume} className="card border-indigo-200 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600">Volume {vol.volume}</span>
              <span className={`badge text-xs ${vol.status === "in_progress" ? "bg-amber-100 text-amber-800" : vol.status === "scaffold" ? "bg-violet-100 text-violet-800" : vol.status === "complete" ? "bg-emerald-100 text-emerald-800" : "bg-green-100 text-green-800"}`}>
                {vol.status === "scaffold" || vol.status === "in_progress" || vol.status === "complete"
                  ? `${vol.stepsComplete ?? 0}/${vol.stepsTotal ?? 14}`
                  : "v1"}
              </span>
            </div>
            <h3 className="mt-1 font-bold text-indigo-950">{vol.name}</h3>
            <p className="text-xs text-indigo-700">{vol.subtitle}</p>
            {vol.masterSequencePath && (
              <p className="mt-1 font-mono text-xs text-slate-400">{vol.masterSequencePath}</p>
            )}
            <p className="mt-2 font-mono text-xs text-slate-500">{vol.requirementId}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-sm font-bold text-slate-900">Alignment Goal</h2>
        <p className="mt-1 text-xs text-slate-600">{ivs.alignmentGoal.join(" · ")}</p>
      </div>
    </div>
  );
}
