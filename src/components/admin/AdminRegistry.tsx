"use client";

const PHASE2_STEPS = [
  { step: "2.1", name: "Registry Doctrine", artifact: "ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md", status: "done" },
  { step: "2.2", name: "County Registry Model", artifact: "COUNTY_REGISTRY_MODEL.md", status: "done" },
  { step: "2.3", name: "Institution Registry Model", artifact: "INSTITUTION_REGISTRY_MODEL.md", status: "done" },
  { step: "2.4", name: "Relationship Map (graph edges)", artifact: "COUNTY_INSTITUTION_RELATIONSHIP_MAP.md", status: "pending" },
  { step: "2.5", name: "Representation Status System", artifact: "REPRESENTATION_STATUS_SYSTEM.md", status: "pending" },
  { step: "2.6", name: "Outreach Gap Dashboard", artifact: "OUTREACH_GAP_DASHBOARD_REQUIREMENTS.md", status: "pending" },
  { step: "2.7", name: "Campus Page Personalization", artifact: "CAMPUS_PAGE_PERSONALIZATION_RULES.md", status: "pending" },
  { step: "2.8", name: "Source & Verification Protocol", artifact: "REGISTRY_SOURCE_AND_VERIFICATION_PROTOCOL.md", status: "pending" },
  { step: "2.9", name: "Registry Seed Data Plan", artifact: "REGISTRY_SEED_DATA_PLAN.md", status: "pending" },
  { step: "2.10", name: "Phase 2 Build Bible", artifact: "PHASE_2_ARKANSAS_ORGANIZING_REGISTRY_BUILD_BIBLE.md", status: "pending" },
];

const GRAPH_EDGES = [
  { from: "Institution", rel: "belongs_to", to: "County" },
  { from: "Institution", rel: "has_students", to: "Participants", note: "operational" },
  { from: "Institution", rel: "hosts", to: "Events", note: "future" },
  { from: "Institution", rel: "contains", to: "Committees", note: "future" },
  { from: "Institution", rel: "neighbors", to: "Institutions", note: "future" },
  { from: "Institution", rel: "participates_in", to: "Initiatives", note: "future" },
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
        <p className="text-xs font-semibold uppercase text-brand-700">PHASE-002 · Arkansas Organizing Registry (AOR)</p>
        <h2 className="mt-1 text-xl font-bold text-brand-950">The Digital Map of Arkansas</h2>
        <p className="mt-2 text-sm font-medium text-brand-900">
          The Registry is not a list. Ask the Registry first.
        </p>
        <p className="mt-1 text-sm text-brand-800">
          If it doesn&apos;t exist in the Registry, it doesn&apos;t exist in the platform.
        </p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-2xl font-bold text-brand-600">{done}/10</p>
            <p className="text-sm text-slate-600">Design steps</p>
          </div>
        </div>
      </div>

      <div className="card border-purple-200 bg-purple-50">
        <p className="text-xs font-semibold uppercase text-purple-800">Knowledge Graph [INST-M17]</p>
        <p className="mt-1 font-bold text-purple-950">Digital homes — not a directory</p>
        <p className="mt-1 text-sm text-purple-900 italic">
          &ldquo;Every campus page should feel like walking onto that campus.&rdquo;
        </p>
        <div className="mt-3 space-y-1">
          {GRAPH_EDGES.map((r) => (
            <p key={`${r.from}-${r.rel}`} className="font-mono text-xs text-purple-900">
              {r.from} <span className="text-purple-600">{r.rel}</span> {r.to}
              {r.note && <span className="ml-2 text-purple-500">({r.note})</span>}
            </p>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Guiding Principle [REG-D04]</h2>
        <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-800">
          One Arkansas. One Registry. One Source of Truth.
        </p>
        <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <p><strong>Registry defines:</strong> counties, institutions, status, relationships</p>
          <p><strong>Registry excludes:</strong> messages, events, profiles, committees</p>
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
        <h2 className="text-lg font-bold text-slate-900">Preliminary Seed Data</h2>
        <div className="mt-2 space-y-1 text-sm text-slate-600">
          <p>✓ counties.json — 75 nodes (minimal; full schema in COUNTY_REGISTRY_MODEL.md)</p>
          <p>✓ county-record.schema.json — JSON Schema graph node</p>
          <p>✓ institutions.json — 23 nodes (partial; Canonical Profile in INSTITUTION_REGISTRY_MODEL.md)</p>
          <p>✓ institution-record.schema.json — JSON Schema graph node</p>
          <p>○ Relationship graph — Step 2.4</p>
          <p>○ Netlify DB — after models approved</p>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Doctrine: docs/phase-02/ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md · REG-001, REG-002, REG-003
      </p>
    </div>
  );
}
