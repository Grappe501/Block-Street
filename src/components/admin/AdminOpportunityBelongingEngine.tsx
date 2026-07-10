"use client";

import obe from "../../../data/registry/opportunity-belonging-engine.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminOpportunityBelongingEngine() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-emerald-300 bg-emerald-50">
        <p className="text-xs font-semibold uppercase text-emerald-800">PHASE-003.13 · Opportunity & Belonging</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{obe.motto}</h2>
        <p className="mt-2 text-sm font-medium text-emerald-900">{obe.principle}</p>
        <p className="mt-2 text-xs italic text-emerald-700">Optimizes for: {obe.optimizeFor}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Community Marketplace [OBE-M12]</h2>
        <p className="mt-1 text-sm text-brand-800">{obe.communityMarketplace.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {obe.communityMarketplace.sections.slice(0, 6).map((s) => (
            <span key={s} className="badge bg-brand-100 text-brand-900 text-xs">
              {s.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-brand-700">
          Engine personalizes · Marketplace stays open and searchable
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Opportunity Categories [OBE-M04]</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {obe.categories.map((cat) => (
            <div key={cat.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold text-slate-900">{cat.label}</span>
              <p className="mt-1 text-xs text-slate-500">{cat.examples.slice(0, 3).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Explainability Required [OBE-M06]</h2>
        <div className="mt-2 space-y-1 text-sm italic text-amber-900">
          {obe.explainability.examples.map((e) => (
            <p key={e}>&ldquo;{e}&rdquo;</p>
          ))}
        </div>
      </div>

      <div className="card border-red-200 bg-red-50">
        <h2 className="text-lg font-bold text-red-950">Ethical — Avoid [OBE-M10]</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-red-900">
          {obe.ethicalRecommendations.avoid.map((a) => (
            <li key={a}>{a.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Philosophy Questions [OBE-M03]</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-800">
          {obe.philosophyQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-xs text-slate-600">{obe.orchestrator}</p>
      </div>

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps + 1}/{peopleSystem.steps.length} steps after 3.13</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/OPPORTUNITY_BELONGING_ENGINE.md · OBE-001 · PDT-001 · OIS-001 · PCC-M07
      </p>
    </div>
  );
}
