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
        <p className="text-xs font-semibold uppercase text-rose-800">PHASE-003.1 · Participant Identity Doctrine</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">{identity.importance}</h2>
        <p className="mt-2 text-sm italic text-rose-900">{identity.phaseArc}</p>
        <p className="mt-3 text-sm font-semibold text-rose-950">&ldquo;{identity.coreDesignQuestion}&rdquo;</p>
        <p className="mt-1 text-xs text-rose-700">Not: {identity.legacyQuestion}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Civic Passport [CPP-001]</h2>
        <p className="mt-1 text-sm text-brand-800">{identity.civicPassport.description}</p>
        <p className="mt-2 text-xs font-medium text-brand-700">
          Not a {identity.civicPassport.notA} — a {identity.civicPassport.isA}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {identity.civicPassport.stamps.map((stamp) => (
            <span key={stamp} className="badge bg-white text-brand-800 border border-brand-200 text-xs">
              {stamp.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Five Identity Layers [PEP-M06]</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {identity.identityLayers.map((layer) => (
            <div key={layer.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold capitalize text-slate-900">{layer.id}</p>
              <p className="italic text-brand-700">{layer.question}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-green-200 bg-green-50">
        <h2 className="text-lg font-bold text-green-950">The Participant Promise [PEP-M18]</h2>
        <ul className="mt-2 space-y-1 text-sm text-green-900">
          {identity.participantPromise.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Phase 3 Sequence ({doneSteps}/{peopleSystem.steps.length})</h2>
        <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
          {peopleSystem.steps.map((step) => (
            <div key={step.id} className="flex justify-between text-xs">
              <span><span className="font-mono text-brand-600">{step.id}</span> {step.name}</span>
              <span className={`badge ${step.status === "done" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>{step.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Journey Stages</h2>
        <div className="mt-2 flex flex-wrap items-center gap-1 text-xs">
          {journey.stages.map((stage, i) => (
            <span key={stage.key} className="flex items-center gap-1">
              <span className="rounded-full bg-slate-100 px-2 py-1">{stage.label}</span>
              {i < journey.stages.length - 1 && <span className="text-slate-300">↓</span>}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/PARTICIPANT_IDENTITY_DOCTRINE.md · PEP-001 · CPP-001 · PRM-001
      </p>
    </div>
  );
}
