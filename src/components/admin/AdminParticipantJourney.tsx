"use client";

import systems from "../../../data/living-systems.json";
import journey from "../../../data/registry/participant-journey.json";
import identity from "../../../data/registry/participant-identity.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminParticipantJourney() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-rose-300 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">Phase 3 — People & Relationship System</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">{identity.motto}</h2>
        <p className="mt-2 text-sm italic text-rose-900">{identity.phaseQuestion}</p>
        <p className="mt-2 text-xs text-rose-800">{doneSteps}/{peopleSystem.steps.length} design steps complete</p>
      </div>

      <div className="card border-purple-200 bg-purple-50">
        <h2 className="text-lg font-bold text-purple-950">Personal Mission [PRM-001]</h2>
        <p className="mt-1 text-sm text-purple-800">{identity.personalMission.description}</p>
        <div className="mt-3 space-y-2">
          {identity.personalMission.examples.map((ex) => (
            <blockquote key={ex} className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm italic text-slate-700">
              &ldquo;{ex}&rdquo;
            </blockquote>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Phase 3 Master Sequence</h2>
        <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
          {peopleSystem.steps.map((step) => (
            <div key={step.id} className="flex items-center justify-between text-xs">
              <span className="text-slate-700">
                <span className="font-mono text-brand-600">{step.id}</span> {step.name}
              </span>
              <span className={`badge ${step.status === "done" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Living Systems Stack</h2>
        <div className="mt-3 space-y-1">
          {systems.stack.slice(0, 4).map((layer) => (
            <div
              key={layer.phase}
              className={`rounded-lg border px-3 py-2 text-sm ${
                layer.status === "active" ? "border-brand-300 bg-brand-50" : "border-slate-200"
              }`}
            >
              <span className="font-mono text-xs text-brand-600">P{layer.phase}</span>{" "}
              <span className="font-semibold">{layer.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Journey Stages [JRN-M04]</h2>
        <div className="mt-3 flex flex-wrap items-center gap-1 text-sm">
          {journey.stages.map((stage, i) => (
            <span key={stage.key} className="flex items-center gap-1">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  stage.v1 === "target" || stage.v1 === "done"
                    ? "bg-brand-100 text-brand-800"
                    : stage.v1 === "signals" || stage.v1 === "partial"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {stage.label}
              </span>
              {i < journey.stages.length - 1 && <span className="text-slate-300">↓</span>}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Identity: docs/phase-03/PARTICIPANT_IDENTITY_DOCTRINE.md · PEP-001 · PRM-001
      </p>
    </div>
  );
}
