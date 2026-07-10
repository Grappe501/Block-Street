"use client";

const PHASE2_STEPS = [
  { step: "2.1", name: "Registry Purpose & Authority", artifact: "ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md", status: "done" },
  { step: "2.2", name: "County Registry Model", artifact: "COUNTY_REGISTRY_MODEL.md", status: "pending" },
  { step: "2.3", name: "Institution Registry Model", artifact: "INSTITUTION_REGISTRY_MODEL.md", status: "pending" },
  { step: "2.4", name: "County-Institution Relationship Map", artifact: "COUNTY_INSTITUTION_RELATIONSHIP_MAP.md", status: "pending" },
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
        <p className="text-xs font-semibold uppercase text-brand-700">PHASE-002 · Arkansas Organizing Registry</p>
        <h2 className="mt-1 text-xl font-bold text-brand-950">Canonical Data Foundation</h2>
        <p className="mt-2 text-sm text-brand-800">
          Defines what exists, where it belongs, and how representation and outreach gaps are tracked.
        </p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-2xl font-bold text-brand-600">{done}/10</p>
            <p className="text-sm text-slate-600">Design steps</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Registry Authority [REG-D02]</h2>
        <p className="mt-2 text-sm text-slate-600">
          Source of truth for 75 counties, institutions, campus/county hubs, representation status, and outreach priority.
        </p>
        <p className="mt-2 font-mono text-xs text-slate-500">data/registry/ → DB-COUNTIES, DB-INSTITUTIONS → pages & API</p>
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
        <h2 className="text-lg font-bold text-slate-900">Preliminary Seed Data</h2>
        <div className="mt-2 space-y-1 text-sm text-slate-600">
          <p>✓ counties.json — 75 counties (minimal schema, formal model in 2.2)</p>
          <p>✓ institutions.json — 23 colleges/universities (formal model in 2.3)</p>
          <p>○ Netlify DB — pending (after models approved)</p>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Doctrine: docs/phase-02/ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md · Requirements: REG-001, REG-002, REG-003
      </p>
    </div>
  );
}
