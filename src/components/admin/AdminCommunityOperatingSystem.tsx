"use client";

import cos from "../../../data/community/community-operating-system.json";
import ccn from "../../../data/registry/community-constitution.json";

export function AdminCommunityOperatingSystem() {
  const doneSteps = cos.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-teal-300 bg-teal-50">
        <p className="text-xs font-semibold uppercase text-teal-800">PHASE-004 · Community Operating System</p>
        <h2 className="mt-1 text-xl font-bold text-teal-950">{ccn.motto}</h2>
        <p className="mt-2 text-sm font-medium text-teal-900">{ccn.principle}</p>
        <p className="mt-2 text-xs italic text-teal-700">Movement infrastructure — required reading for Burt</p>
      </div>

      <div className="card border-violet-200 bg-violet-50">
        <h2 className="text-lg font-bold text-violet-950">Constitutional Hierarchy [CCN-M03]</h2>
        <div className="mt-3 space-y-1 font-mono text-sm text-violet-900">
          {ccn.constitutionalHierarchy.map((layer, i) => (
            <div key={layer.layer} className="flex items-center gap-2">
              {i > 0 && <span className="text-violet-400">↓</span>}
              <span className="font-semibold capitalize">{layer.layer.replace(/([A-Z])/g, " $1").trim()}</span>
              <span className="text-xs text-violet-600">({layer.ref})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Community Charters [CCN-M17]</h2>
        <p className="mt-1 text-sm text-brand-800">{ccn.communityCharters.description}</p>
        <p className="mt-2 text-xs text-brand-700">
          <strong>Constitution:</strong> {ccn.communityCharters.constitutionVsCharter.constitution}
        </p>
        <p className="mt-1 text-xs text-brand-700">
          <strong>Charter:</strong> {ccn.communityCharters.constitutionVsCharter.charter}
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-brand-900">
          {ccn.communityCharters.elements.slice(0, 6).map((el) => (
            <li key={el}>{el.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Community Rights [CCN-M07]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ccn.communityRights.slice(0, 6).map((r) => (
            <span key={r} className="badge bg-emerald-100 text-emerald-900 text-xs capitalize">
              {r.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Equal Standing [CCN-M05]</h2>
        <p className="mt-1 text-sm text-slate-700">
          Same architectural support for every community — differs by participation, not importance.
        </p>
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

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps}/{cos.steps.length} Phase 4 steps</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-04/COMMUNITY_CONSTITUTION.md · CCN-001 · COS-001 · CP-004 · CID-001
      </p>
    </div>
  );
}
