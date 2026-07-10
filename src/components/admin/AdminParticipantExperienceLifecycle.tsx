"use client";

import pel from "../../../data/registry/participant-experience-lifecycle.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminParticipantExperienceLifecycle() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-rose-300 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">PHASE-003.14 · Experience & Lifecycle · Required Reading</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">{pel.motto}</h2>
        <p className="mt-2 text-sm font-medium text-rose-900">{pel.principle}</p>
        <p className="mt-2 text-xs italic text-rose-700">{pel.coreQuestion}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Community Companion [PEL-M11]</h2>
        <p className="mt-1 text-sm text-brand-800">{pel.communityCompanion.description}</p>
        <p className="mt-2 text-xs text-brand-700">
          Voice: {pel.communityCompanion.personality.join(" · ")} — {pel.communityCompanion.voiceOf}
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-brand-900">
          {pel.communityCompanion.responsibilities.slice(0, 5).map((r) => (
            <li key={r}>{r.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Lifecycle Stages [PEL-M04]</h2>
        <div className="mt-3 space-y-2">
          {pel.lifecycleStages.map((s) => (
            <div key={s.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold text-slate-900">
                {s.stage}. {s.label}
              </span>
              <p className="mt-1 text-xs text-slate-600">{s.emotionalGoal}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Should Feel [PEL-M03]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {pel.shouldFeel.map((f) => (
            <span key={f} className="badge bg-emerald-100 text-emerald-900 capitalize">
              {f}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-700">Never Feel</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {pel.neverFeel.map((f) => (
            <span key={f} className="badge bg-red-100 text-red-800 capitalize">
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Evaluation Question [PEL-M13]</h2>
        <p className="mt-2 text-sm italic text-amber-900">&ldquo;{pel.evaluationQuestion}&rdquo;</p>
      </div>

      <div className="card border-violet-200 bg-violet-50">
        <h2 className="text-lg font-bold text-violet-950">Phase 3 Heart [PEL-M14]</h2>
        <ul className="mt-2 space-y-1 text-sm text-violet-900">
          <li>Phase 1 — {pel.phase3Heart.phase1}</li>
          <li>Phase 2 — {pel.phase3Heart.phase2}</li>
          <li>Phase 3 — {pel.phase3Heart.phase3}</li>
        </ul>
      </div>

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps + 1}/{peopleSystem.steps.length} steps after 3.14</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/PARTICIPANT_EXPERIENCE_LIFECYCLE.md · PEL-001 · JRN-001 · OBE-001 · CJT-M12
      </p>
    </div>
  );
}
