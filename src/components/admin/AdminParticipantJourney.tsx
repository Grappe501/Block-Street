"use client";

import journey from "../../../data/registry/participant-journey.json";
import identity from "../../../data/registry/participant-identity.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminParticipantJourney() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-indigo-300 bg-indigo-50">
        <p className="text-xs font-semibold uppercase text-indigo-800">PHASE-003.2 · Participant Journey Framework</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{journey.motto}</h2>
        <p className="mt-2 text-sm font-medium text-indigo-900">{journey.principle}</p>
        <p className="mt-1 text-xs text-indigo-700">{journey.purpose}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Orchestration Layer [JRN-M10]</h2>
        <p className="mt-1 text-sm text-brand-800">{journey.orchestrationLayer.description}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-brand-700">Inputs</p>
            <ul className="mt-1 list-inside list-disc text-xs text-brand-900">
              {journey.orchestrationLayer.inputs.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-brand-700">Outputs</p>
            <ul className="mt-1 list-inside list-disc text-xs text-brand-900">
              {journey.orchestrationLayer.outputs.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Nine Journey Stages [JRN-M04]</h2>
        <p className="mt-1 text-xs text-slate-500">Non-linear — growth, not rank</p>
        <div className="mt-3 space-y-2">
          {journey.stages.map((stage) => (
            <div key={stage.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  {stage.order}. {stage.label}
                </span>
                <span className="font-mono text-xs text-brand-600">{stage.key}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{stage.platformFocus}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Milestones [JRN-M07]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {journey.milestones.map((m) => (
            <span key={m.id} className="badge bg-slate-100 text-slate-700 text-xs">
              {m.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-green-200 bg-green-50">
        <h2 className="text-lg font-bold text-green-950">Next Step Examples [JRN-M08]</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-900">
          {journey.nextStepExamples.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="card border-rose-200 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">Identity Doctrine [3.1]</p>
        <p className="mt-1 text-sm text-rose-900">{identity.coreDesignQuestion}</p>
        <p className="mt-2 text-xs text-rose-700">Phase 3: {doneSteps}/{peopleSystem.steps.length} steps</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/PARTICIPANT_JOURNEY.md · JRN-001 · CPP-001
      </p>
    </div>
  );
}
