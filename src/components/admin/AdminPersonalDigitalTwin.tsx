"use client";

import pdt from "../../../data/registry/personal-digital-twin.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminPersonalDigitalTwin() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-indigo-300 bg-indigo-50">
        <p className="text-xs font-semibold uppercase text-indigo-800">PHASE-003.12 · Personal Digital Twin</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{pdt.motto}</h2>
        <p className="mt-2 text-sm font-medium text-indigo-900">{pdt.principle}</p>
        <p className="mt-2 text-xs text-indigo-700">
          ADT-001 = Arkansas landscape · PDT-001 = participant journey within it
        </p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Participant Context Engine [PDT-M12]</h2>
        <p className="mt-1 text-sm italic text-brand-800">&ldquo;{pdt.participantContextEngine.question}&rdquo;</p>
        <p className="mt-2 font-mono text-xs text-brand-700">{pdt.participantContextEngine.orchestrator}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-brand-900">
          {pdt.participantContextEngine.benefits.map((b) => (
            <li key={b}>{b.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Core Components [PDT-M04]</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {pdt.coreComponents.map((c) => (
            <div key={c.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold capitalize text-slate-900">{c.key}</span>
              <p className="mt-1 text-xs text-slate-500">{c.includes.slice(0, 3).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Relationship Graph [PDT-M06]</h2>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-100">
          {`Participant\n│\n${pdt.relationshipGraph.exampleEdges.map((e) => `├── ${e}`).join("\n")}`}
        </pre>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Explainability [PDT-M09]</h2>
        <div className="mt-2 space-y-1 text-sm italic text-amber-900">
          {pdt.explainability.examples.map((e) => (
            <p key={e}>&ldquo;{e}&rdquo;</p>
          ))}
        </div>
      </div>

      <div className="card border-red-200 bg-red-50">
        <h2 className="text-lg font-bold text-red-950">Not This [PDT-M03]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {pdt.notThis.map((n) => (
            <span key={n} className="badge bg-red-100 text-red-800 capitalize">
              Not {n}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps + 1}/{peopleSystem.steps.length} steps after 3.12</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/PERSONAL_DIGITAL_TWIN.md · PDT-001 · REL-001 · ADT-001 · Step 3.13 consumes context
      </p>
    </div>
  );
}
