"use client";

import hq from "../../../data/registry/personal-headquarters.json";
import identity from "../../../data/registry/participant-identity.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminPersonalHeadquarters() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;
  const v1Sections = hq.sections.filter((s) => s.v1 && s.v1 !== "placeholder");

  return (
    <div className="space-y-6">
      <div className="card border-amber-300 bg-amber-50">
        <p className="text-xs font-semibold uppercase text-amber-800">PHASE-003.3 · Personal Headquarters</p>
        <h2 className="mt-1 text-xl font-bold text-amber-950">{hq.motto}</h2>
        <p className="mt-2 text-sm font-medium text-amber-900">{hq.principle}</p>
        <p className="mt-1 text-xs text-amber-700">{hq.purpose}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Platform Center [PHQ-M18]</h2>
        <p className="mt-1 text-sm text-brand-800">{hq.platformCenter.description}</p>
        <p className="mt-2 font-mono text-xs text-brand-700">{hq.platformCenter.aggregator}</p>
        <p className="mt-2 text-xs text-brand-800">{hq.platformCenter.networkBoardRelationship}</p>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase text-brand-700">Three login questions</p>
          <ul className="mt-1 list-inside list-disc text-sm text-brand-900">
            {hq.loginQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Eight HQ Sections [PHQ-M05]</h2>
        <p className="mt-1 text-xs text-slate-500">Modular dashboard — not a profile page</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {hq.sections.map((section) => (
            <div key={section.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{section.label}</span>
                <span className="font-mono text-xs text-brand-600">{section.key}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                V1: {section.v1}
                {section.requirement && ` · ${section.requirement}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Quick Actions [PHQ-M14]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {hq.quickActions.map((action) => (
            <span
              key={action.id}
              className={`badge text-xs ${action.v1 ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}
            >
              {action.label}
              {!action.v1 && " (future)"}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-indigo-200 bg-indigo-50">
        <h2 className="text-lg font-bold text-indigo-950">Registration → HQ [USR-001]</h2>
        <div className="mt-2 space-y-2">
          {hq.registration.flows.map((flow) => (
            <div key={flow.path} className="text-sm text-indigo-900">
              <span className="font-semibold capitalize">{flow.path}:</span>{" "}
              {flow.steps.join(" → ")}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-indigo-700">Route: {hq.routes.path} [{hq.routes.primary}]</p>
      </div>

      <div className="card border-green-200 bg-green-50">
        <h2 className="text-lg font-bold text-green-950">V1 Scope (Jul 12–14)</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-900">
          <li>{v1Sections.length} core sections + calendar placeholder</li>
          <li>Mission edit [PRM-001] · Passport seed [CPP-001]</li>
          <li>County/campus cards · Invite + QR stub [NET-002/003]</li>
          <li>Journey stage + next-step cards [JRN-001]</li>
        </ul>
      </div>

      <div className="card border-rose-200 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">Identity Doctrine [3.1]</p>
        <p className="mt-1 text-sm text-rose-900">{identity.coreDesignQuestion}</p>
        <p className="mt-2 text-xs text-rose-700">Phase 3: {doneSteps}/{peopleSystem.steps.length} steps</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/PARTICIPANT_PROFILE_SYSTEM.md · PHQ-001 · USR-001 · USR-002
      </p>
    </div>
  );
}
