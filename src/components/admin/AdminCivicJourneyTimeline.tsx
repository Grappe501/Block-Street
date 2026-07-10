"use client";

import cjt from "../../../data/registry/civic-journey-timeline.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminCivicJourneyTimeline() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-violet-300 bg-violet-50">
        <p className="text-xs font-semibold uppercase text-violet-800">PHASE-003.11 · Civic Journey Timeline</p>
        <h2 className="mt-1 text-xl font-bold text-violet-950">{cjt.motto}</h2>
        <p className="mt-2 text-sm font-medium text-violet-900">{cjt.principle}</p>
        <p className="mt-2 text-xs text-violet-700">{cjt.purpose}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Memory Moments [CJT-M12]</h2>
        <p className="mt-1 text-sm text-brand-800">{cjt.memoryMoments.description}</p>
        <p className="mt-2 font-mono text-xs text-brand-700">{cjt.memoryMoments.orchestrator}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-brand-900">
          {cjt.memoryMoments.examples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Timeline Categories [CJT-M04]</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {cjt.categories.map((cat) => (
            <div key={cat.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold text-slate-900">{cat.label}</span>
              <p className="mt-1 text-xs text-slate-500">{cat.examples.slice(0, 3).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Philosophy Questions [CJT-M03]</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-800">
          {cjt.philosophyQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Natural Narrative [CJT-M05]</h2>
        <div className="mt-2 space-y-1 text-sm italic text-amber-900">
          {cjt.experienceExamples.map((e) => (
            <p key={e}>&ldquo;{e}&rdquo;</p>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Privacy Views [CJT-M10]</h2>
        <div className="mt-2 space-y-2">
          {cjt.privacy.views.map((v) => (
            <div key={v.key} className="text-sm">
              <span className="badge bg-slate-100 text-slate-800">{v.key}</span>
              <span className="ml-2 text-slate-600">{v.content}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps + 1}/{peopleSystem.steps.length} steps after 3.11</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/CIVIC_JOURNEY_TIMELINE.md · CJT-001 · JRN-M09 · CPP-001 · CRA-M10
      </p>
    </div>
  );
}
