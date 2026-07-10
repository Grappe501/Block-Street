"use client";

import aos from "../../../data/action/action-operating-system.json";
import acn from "../../../data/registry/action-constitution.json";
import aosr from "../../../data/registry/action-operating-system-certification-readiness.json";
import opis from "../../../data/registry/operational-intelligence-system.json";

export function AdminActionOperatingSystem() {
  const doneSteps = aos.steps.filter((s) => s.status === "done").length;
  const phaseComplete = doneSteps === aos.steps.length;
  const mrd = aosr.movementReadinessDashboard;
  const readinessLevels = aosr.readinessLevels;

  return (
    <div className="space-y-6">
      <div className="card border-orange-300 bg-orange-50">
        <p className="text-xs font-semibold uppercase text-orange-800">PHASE-005 · Action Operating System</p>
        <h2 className="mt-1 text-xl font-bold text-orange-950">{acn.guidingPrinciple}</h2>
        <p className="mt-2 text-xs italic text-orange-700">
          {doneSteps}/{aos.steps.length} steps complete
          {phaseComplete && " · Phase 5 complete"}
        </p>
      </div>

      <div className="card border-emerald-300 bg-emerald-50">
        <p className="text-xs font-semibold uppercase text-emerald-800">PHASE-005.14 · Certification & Readiness</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{aosr.guidingPrinciple}</h2>
        <p className="mt-2 text-sm font-medium text-emerald-900">{aosr.readinessQuestion}</p>
        <p className="mt-1 text-xs text-emerald-800">{aosr.principle}</p>
      </div>

      <div className="card border-emerald-200 bg-white">
        <h2 className="text-lg font-bold text-emerald-950">Movement Readiness Dashboard [AOS-M09]</h2>
        <p className="mt-1 text-sm text-emerald-900">{mrd.description}</p>
        <p className="mt-2 text-xs text-emerald-800">{mrd.route}</p>
        <ul className="mt-3 space-y-2 text-xs text-emerald-900">
          {mrd.dimensions.map((d) => (
            <li key={d.key}>
              <span className="font-medium">{d.label}</span>
              <span className="text-emerald-700"> · {d.signals.length} signals</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-emerald-200 bg-emerald-50/50">
        <h2 className="text-sm font-bold text-emerald-950">Readiness Levels [AOS-M05]</h2>
        <ul className="mt-2 space-y-1 text-xs text-emerald-900">
          {readinessLevels.map((l) => (
            <li key={l.level}>
              <span className="font-medium">L{l.level} — {l.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-emerald-200 bg-emerald-50/50">
        <h2 className="text-sm font-bold text-emerald-950">Required Capabilities [AOS-M04]</h2>
        <p className="mt-1 text-xs text-emerald-900">{aosr.requiredCapabilities.length} operational domains</p>
      </div>

      <div className="card border-violet-200 bg-violet-50/50">
        <h2 className="text-sm font-bold text-violet-950">Operations Center · OPIS</h2>
        <p className="mt-1 text-xs text-violet-900">{opis.operationsCenter.description}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Phase 5 Modules</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-800">
          {aos.steps.map((step) => (
            <li key={step.id} className="flex items-center gap-2">
              <span className={step.status === "done" ? "text-green-600" : "text-slate-400"}>
                {step.status === "done" ? "✓" : "○"}
              </span>
              <span className="font-medium">{step.id}</span>
              <span>{step.name}</span>
              <span className="text-xs text-slate-500">[{step.requirement}]</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-05/ACTION_OPERATING_SYSTEM_CERTIFICATION_READINESS.md · AOS-001 · Movement Readiness Dashboard
      </p>
    </div>
  );
}
