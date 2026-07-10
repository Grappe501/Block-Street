"use client";

import cos from "../../../data/community/community-operating-system.json";
import doctrine from "../../../data/registry/community-doctrine.json";

export function AdminCommunityOperatingSystem() {
  const doneSteps = cos.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-teal-300 bg-teal-50">
        <p className="text-xs font-semibold uppercase text-teal-800">PHASE-004 · Community Operating System</p>
        <h2 className="mt-1 text-xl font-bold text-teal-950">{cos.phaseQuestion}</h2>
        <p className="mt-2 text-sm font-medium text-teal-900">{cos.principle}</p>
        <p className="mt-2 text-xs text-teal-700">{cos.concept}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Community Constitution [CMD-M07]</h2>
        <p className="mt-1 text-sm text-brand-800">{doctrine.communityConstitution.description}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {doctrine.communityConstitution.elements.map((el) => (
            <div key={el.key} className="rounded-lg border border-brand-200 bg-white p-2 text-sm">
              <span className="font-semibold text-brand-950">{el.label}</span>
              <p className="text-xs text-brand-700">{el.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Community Types [CMD-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {doctrine.communityTypes.map((t) => (
            <span key={t.key} className="badge bg-slate-100 text-slate-800 capitalize">
              {t.key.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Community OS Modules</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {cos.communityOSModules.map((m) => (
            <span key={m} className="badge bg-teal-100 text-teal-900 text-xs capitalize">
              {m.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Phase 4 Steps</h2>
        <div className="mt-2 space-y-1 text-sm">
          {cos.steps.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className={s.status === "done" ? "text-emerald-600" : "text-slate-400"}>
                {s.status === "done" ? "✓" : "○"}
              </span>
              <span className="font-mono text-xs text-slate-500">{s.id}</span>
              <span className="text-slate-800">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Phase Shift</h2>
        <p className="mt-1 text-sm text-amber-900">
          Phase 3: <strong>{cos.phaseShift.phase3}</strong> → Phase 4: <strong>{cos.phaseShift.phase4}</strong>
        </p>
      </div>

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps}/{cos.steps.length} Phase 4 steps</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-04/COMMUNITY_DOCTRINE.md · CMD-001 · COS-001 · CID-001 · CP-004
      </p>
    </div>
  );
}
