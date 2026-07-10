"use client";

import pcc from "../../../data/registry/personal-command-center.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminPersonalCommandCenter() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;
  const v1Widgets = pcc.widgets.filter((w) => w.v1 && !String(w.v1).includes("placeholder") && w.v1 !== "hiddenPlaceholder");

  return (
    <div className="space-y-6">
      <div className="card border-sky-300 bg-sky-50">
        <p className="text-xs font-semibold uppercase text-sky-800">PHASE-003.6 · Personal Command Center</p>
        <h2 className="mt-1 text-xl font-bold text-sky-950">{pcc.motto}</h2>
        <p className="mt-2 text-sm font-medium text-sky-900">{pcc.principle}</p>
        <p className="mt-1 text-xs text-sky-700">{pcc.purpose}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Phase Arc — Everything Comes Together</h2>
        <div className="mt-2 space-y-1 text-sm text-brand-900">
          {Object.entries(pcc.phaseArc).map(([step, role]) => (
            <p key={step}>
              <span className="font-semibold">{step}:</span> {role}
            </p>
          ))}
        </div>
        <p className="mt-2 text-xs text-brand-700">{pcc.hqIntegration.onePageNotTwoHomes}</p>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Morning Brief [PCC-M17]</h2>
        <p className="mt-1 text-sm text-amber-900">{pcc.morningBrief.description}</p>
        <p className="mt-2 font-mono text-xs text-amber-800">{pcc.morningBrief.orchestrator}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-amber-900">
          {pcc.morningBrief.exampleItems.slice(0, 4).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Six Login Questions [PCC-M03]</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {pcc.sixQuestions.map((q) => (
            <div key={q.question} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-slate-900">{q.question}</p>
              <p className="mt-1 text-xs text-slate-500">{q.widgets.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Widget Registry [PCC-M05]</h2>
        <p className="mt-1 text-xs text-slate-500">{v1Widgets.length} core widgets in V1 · modular architecture</p>
        <div className="mt-3 space-y-2">
          {pcc.widgets.map((widget) => (
            <div key={widget.key} className="flex items-center justify-between rounded-lg border border-slate-200 p-2 text-sm">
              <span className="font-medium text-slate-900">{widget.label}</span>
              <div className="text-right">
                <span className="font-mono text-xs text-brand-600">{widget.key}</span>
                <span className="ml-2 badge bg-slate-100 text-slate-600 text-xs">V1: {String(widget.v1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-green-200 bg-green-50">
        <h2 className="text-lg font-bold text-green-950">Route & Aggregator</h2>
        <p className="mt-1 font-mono text-sm text-green-900">
          {pcc.routes.path} [{pcc.routes.primary}]
        </p>
        <p className="mt-1 font-mono text-xs text-green-700">{pcc.hqIntegration.aggregator}</p>
        <p className="mt-2 text-xs text-green-800">Retires: {pcc.routes.retires.join(", ")}</p>
      </div>

      <div className="card border-rose-200 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-rose-900">{doneSteps}/{peopleSystem.steps.length} steps complete</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/PERSONAL_COMMAND_CENTER.md · PCC-001 · PHQ-001 · NET-001 · OIS-001
      </p>
    </div>
  );
}
