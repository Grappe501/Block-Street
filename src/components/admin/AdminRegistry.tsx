"use client";

import relationshipTypes from "../../../data/registry/relationship-types.json";
import statusFramework from "../../../data/registry/status-framework.json";

const PHASE2_STEPS = [
  { step: "2.1", name: "Registry Doctrine", artifact: "ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md", status: "done" },
  { step: "2.2", name: "County Registry Model", artifact: "COUNTY_REGISTRY_MODEL.md", status: "done" },
  { step: "2.3", name: "Institution Registry Model", artifact: "INSTITUTION_REGISTRY_MODEL.md", status: "done" },
  { step: "2.4", name: "Relationship Graph", artifact: "ARKANSAS_RELATIONSHIP_GRAPH.md", status: "done" },
  { step: "2.5", name: "Status & Lifecycle", artifact: "CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md", status: "done" },
  { step: "2.6", name: "Outreach Intelligence & Mission Board", artifact: "STATEWIDE_OUTREACH_INTELLIGENCE.md", status: "done" },
  { step: "2.7", name: "Campus Page Personalization", artifact: "CAMPUS_PAGE_PERSONALIZATION_RULES.md", status: "pending" },
  { step: "2.8", name: "Source & Verification Protocol", artifact: "REGISTRY_SOURCE_AND_VERIFICATION_PROTOCOL.md", status: "pending" },
  { step: "2.9", name: "Registry Seed Data Plan", artifact: "REGISTRY_SEED_DATA_PLAN.md", status: "pending" },
  { step: "2.10", name: "Phase 2 Build Bible", artifact: "PHASE_2_ARKANSAS_ORGANIZING_REGISTRY_BUILD_BIBLE.md", status: "pending" },
];

const STATUS_STYLE: Record<string, string> = {
  done: "bg-green-100 text-green-800",
  in_progress: "bg-amber-100 text-amber-800",
  pending: "bg-slate-100 text-slate-600",
};

export function AdminRegistry() {
  const done = PHASE2_STEPS.filter((s) => s.status === "done").length;
  const countyStages = statusFramework.entityLifecycles.County.stages.slice(0, 4);
  const instStages = statusFramework.entityLifecycles.Institution.stages.filter((s) => s.legacy).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="card border-brand-300 bg-brand-50">
        <p className="text-xs font-semibold uppercase text-brand-700">PHASE-002 · Platform Operating System</p>
        <h2 className="mt-1 text-xl font-bold text-brand-950">Status-Driven Architecture</h2>
        <p className="mt-2 text-sm font-medium text-brand-900">{statusFramework.motto}</p>
        <p className="mt-1 text-sm text-brand-800">{statusFramework.principle}</p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-2xl font-bold text-brand-600">{done}/10</p>
            <p className="text-sm text-slate-600">Design steps</p>
          </div>
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <p className="text-xs font-semibold uppercase text-amber-800">Status Timeline [STS-M16]</p>
        <p className="mt-1 text-sm text-amber-900">
          Not just current status — full history of transitions. Know where things are and how they got there.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="font-bold text-slate-900">County Lifecycle (V1)</h3>
          <div className="mt-2 space-y-1">
            {countyStages.map((s) => (
              <p key={s.key} className="text-xs text-slate-600">
                <span className="font-mono text-brand-600">{s.key}</span> — {s.label}
              </p>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold text-slate-900">Institution Lifecycle (V1)</h3>
          <div className="mt-2 space-y-1">
            {instStages.map((s) => (
              <p key={s.key} className="text-xs text-slate-600">
                <span className="font-mono text-brand-600">{s.key}</span> — {s.label}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-purple-200 bg-purple-50">
        <p className="text-xs font-semibold uppercase text-purple-800">Graph V1 Edges</p>
        <ul className="mt-2 list-inside list-disc text-xs text-purple-900">
          {relationshipTypes.v1Edges.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Phase 2 Step Sequence</h2>
        <div className="mt-3 space-y-2">
          {PHASE2_STEPS.map((s) => (
            <div key={s.step} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <span className="font-mono text-xs text-brand-600">{s.step}</span>
                <p className="font-semibold text-slate-900">{s.name}</p>
                <p className="text-xs text-slate-500">{s.artifact}</p>
              </div>
              <span className={`badge ${STATUS_STYLE[s.status]}`}>{s.status.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Status: docs/phase-02/CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md · STS-001
      </p>
    </div>
  );
}
