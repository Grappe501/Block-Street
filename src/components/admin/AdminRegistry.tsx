"use client";

import relationshipTypes from "../../../data/registry/relationship-types.json";

const PHASE2_STEPS = [
  { step: "2.1", name: "Registry Doctrine", artifact: "ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md", status: "done" },
  { step: "2.2", name: "County Registry Model", artifact: "COUNTY_REGISTRY_MODEL.md", status: "done" },
  { step: "2.3", name: "Institution Registry Model", artifact: "INSTITUTION_REGISTRY_MODEL.md", status: "done" },
  { step: "2.4", name: "Relationship Graph", artifact: "ARKANSAS_RELATIONSHIP_GRAPH.md", status: "done" },
  { step: "2.5", name: "Representation Status System", artifact: "REPRESENTATION_STATUS_SYSTEM.md", status: "pending" },
  { step: "2.6", name: "Outreach Gap Dashboard", artifact: "OUTREACH_GAP_DASHBOARD_REQUIREMENTS.md", status: "pending" },
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

  return (
    <div className="space-y-6">
      <div className="card border-brand-300 bg-brand-50">
        <p className="text-xs font-semibold uppercase text-brand-700">PHASE-002 · Organizing Intelligence System</p>
        <h2 className="mt-1 text-xl font-bold text-brand-950">Digital Twin of Arkansas</h2>
        <p className="mt-2 text-sm font-medium text-brand-900">
          Not pages — a living network where everything is connected.
        </p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-2xl font-bold text-brand-600">{done}/10</p>
            <p className="text-sm text-slate-600">Design steps</p>
          </div>
        </div>
      </div>

      <div className="card border-purple-200 bg-purple-50">
        <p className="text-xs font-semibold uppercase text-purple-800">Relationship Graph [REL-M02]</p>
        <p className="mt-1 font-bold text-purple-950">
          Everything belongs somewhere. Everything connects to something.
        </p>
        <p className="mt-2 text-sm text-purple-900">V1 edges:</p>
        <ul className="mt-1 list-inside list-disc text-xs text-purple-900">
          {relationshipTypes.v1Edges.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Intelligence Layers</h2>
        <div className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <p><strong>Geographic:</strong> counties, regions, contains</p>
          <p><strong>Educational:</strong> institutions, attends, categories</p>
          <p><strong>Organizing:</strong> outreach gaps, participation</p>
          <p><strong>Network:</strong> invited_by, connected_to</p>
        </div>
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

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Registry Artifacts</h2>
        <div className="mt-2 space-y-1 text-sm text-slate-600">
          <p>✓ Node schemas: county, institution</p>
          <p>✓ Edge schema: relationship-record</p>
          <p>✓ relationship-types.json — canonical type catalog</p>
          <p>○ Edge materialization → Step 2.9 seed plan</p>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Graph: docs/phase-02/ARKANSAS_RELATIONSHIP_GRAPH.md · REL-001
      </p>
    </div>
  );
}
