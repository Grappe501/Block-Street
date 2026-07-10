"use client";

import tps from "../../../data/registry/trust-privacy-safety.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminTrustPrivacySafety() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;
  const v1Controls = tps.participantControls.filter((c) => c.v1 === true || c.v1 === "basic" || c.v1 === "privateDefault" || c.v1 === "partial");

  return (
    <div className="space-y-6">
      <div className="card border-slate-400 bg-slate-100">
        <p className="text-xs font-semibold uppercase text-slate-700">PHASE-003.7 · Trust, Privacy & Digital Safety</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{tps.motto}</h2>
        <p className="mt-2 text-sm font-medium text-slate-900">{tps.principle}</p>
        <p className="mt-2 text-xs italic text-slate-600">{tps.whyItMatters}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Trust Center [TPS-M16]</h2>
        <p className="mt-1 text-sm text-brand-800">{tps.trustCenter.description}</p>
        <p className="mt-2 font-mono text-xs text-brand-700">
          {tps.trustCenter.route} [{tps.trustCenter.pageId}]
        </p>
        <p className="mt-2 font-mono text-xs text-brand-600">{tps.trustCenter.visibilityEngine}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tps.trustCenter.v1Sections.map((s) => (
            <span key={s} className="badge bg-brand-100 text-brand-800 text-xs">
              {s.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Visibility Levels [TPS-M07]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {tps.visibilityLevels.map((level) => (
            <span key={level.key} className="badge bg-indigo-100 text-indigo-800 text-xs">
              {level.label}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-slate-600">V1 Defaults</p>
          <div className="mt-2 space-y-1 text-sm">
            {tps.v1Defaults.map((d) => (
              <div key={d.element} className="flex justify-between rounded border border-slate-100 px-2 py-1">
                <span className="text-slate-700">{d.element}</span>
                <span className="font-mono text-xs text-slate-500">{d.default}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Data Minimization [TPS-M05]</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900">
          {tps.dataMinimization.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs font-semibold text-amber-800">{tps.dataMinimization.rule}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Trust Pillars [TPS-M03]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {tps.trustPillars.map((p) => (
            <span key={p} className="badge bg-green-100 text-green-800 text-xs">
              {p.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-rose-200 bg-rose-50">
        <h2 className="text-lg font-bold text-rose-950">Ethical Use — Prohibited</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-rose-900">
          {tps.ethicalUse.prohibited.map((p) => (
            <li key={p}>{p.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card border-green-200 bg-green-50">
        <p className="text-xs font-semibold uppercase text-green-800">V1 Critical Path</p>
        <p className="mt-1 text-sm text-green-900">
          Step 3.7 complete — Phase 3 V1 design path done ({v1Controls.length} controls in V1 scope)
        </p>
        <p className="mt-1 text-xs text-green-700">Phase 3: {doneSteps + 1}/{peopleSystem.steps.length} steps after 3.7</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/TRUST_PRIVACY_DIGITAL_SAFETY.md · SEC-001 · CP-007 · DG-004
      </p>
    </div>
  );
}
