"use client";

import cra from "../../../data/registry/community-recognition-appreciation.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminCommunityRecognitionAppreciation() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-rose-300 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">PHASE-003.9 · Community Recognition & Appreciation</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">{cra.motto}</h2>
        <p className="mt-2 text-sm font-medium text-rose-900">{cra.principle}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2 text-xs">
          <p className="rounded border border-red-200 bg-red-50 p-2 text-red-900">
            <span className="font-semibold">Gamification:</span> {cra.distinction.gamification}
          </p>
          <p className="rounded border border-green-200 bg-green-50 p-2 text-green-900">
            <span className="font-semibold">Appreciation:</span> {cra.distinction.appreciation}
          </p>
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Community Gratitude [CRA-M13]</h2>
        <p className="mt-1 text-sm text-brand-800">{cra.communityGratitude.description}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm italic text-brand-900">
          {cra.communityGratitude.exampleMessages.map((msg) => (
            <li key={msg}>&ldquo;{msg}&rdquo;</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-brand-700">{cra.communityGratitude.distinctFromScores}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Milestone Categories [CRA-M05]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {cra.milestoneCategories.map((cat) => (
            <span key={cat.key} className="badge bg-indigo-100 text-indigo-800 text-xs">
              {cat.label}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-1">
          {cra.milestones.slice(0, 6).map((m) => (
            <div key={m.id} className="flex justify-between text-sm">
              <span className="text-slate-800">{m.label}</span>
              <span className="font-mono text-xs text-slate-500">{m.category}</span>
            </div>
          ))}
          <p className="text-xs text-slate-500">+{cra.milestones.length - 6} more in catalog</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Principles [CRA-M12]</h2>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-red-700">Avoid</p>
            <ul className="mt-1 list-inside list-disc text-xs text-slate-700">
              {cra.avoid.map((a) => (
                <li key={a}>{a.replace(/([A-Z])/g, " $1").trim()}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-green-700">Encourage</p>
            <ul className="mt-1 list-inside list-disc text-xs text-slate-700">
              {cra.encourage.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Appreciation Board [CRA-M11]</h2>
        <p className="mt-1 text-sm text-amber-900">{cra.appreciationBoard.description}</p>
        <p className="mt-2 text-xs text-amber-700">V1: {cra.appreciationBoard.v1}</p>
      </div>

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps + 1}/{peopleSystem.steps.length} steps after 3.9</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/COMMUNITY_RECOGNITION_APPRECIATION.md · CRA-001 · CPP-001 · JRN-001
      </p>
    </div>
  );
}
