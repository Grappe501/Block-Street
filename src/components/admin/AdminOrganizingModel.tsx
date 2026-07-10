"use client";

const LAYERS = [
  { id: "OM-L5", level: 5, name: "Statewide Network", desc: "Connects all — discovery, learning, training. Strengthens local, never replaces.", color: "bg-brand-950 text-white" },
  { id: "OM-L4", level: 4, name: "Working Groups", desc: "Committees, projects, volunteer teams. Temporary or permanent. v1.1+", color: "bg-brand-700 text-white" },
  { id: "OM-L3", level: 3, name: "Community", desc: "Campus OR county. Containers built from people — not the other way around.", color: "bg-brand-500 text-white" },
  { id: "OM-L2", level: 2, name: "Personal Network", desc: "Referral tree. Share link + QR. Primary growth mechanism.", color: "bg-brand-300 text-brand-950" },
  { id: "OM-L1", level: 1, name: "The Individual", desc: "ROOT ENTITY. Profile, dashboard, invite link, equal opportunity.", color: "bg-brand-100 text-brand-900" },
];

const HOMES = [
  { name: "My Network", v1: true },
  { name: "My Campus", v1: true },
  { name: "My County", v1: true },
  { name: "My Committees", v1: false },
  { name: "My Events", v1: false },
  { name: "My Growth", v1: false },
];

export function AdminOrganizingModel() {
  return (
    <div className="space-y-6">
      <div className="card border-brand-200 bg-brand-50">
        <p className="text-xs font-semibold uppercase text-brand-700">PHASE-001.5 · Database Foundation</p>
        <h2 className="mt-1 text-xl font-bold text-brand-950">Organizing Model</h2>
        <p className="mt-2 text-sm text-brand-900">
          <strong>People first.</strong> Most platforms organize around organizations. We organize around people.
          Communities are built from individuals — not the other way around.
        </p>
      </div>

      <div className="card">
        <p className="text-xs font-mono text-brand-600">OM-002</p>
        <p className="mt-1 text-lg font-bold text-slate-900">The individual is the center of the platform.</p>
        <p className="mt-2 text-sm text-slate-600">
          The software does not organize campuses — it helps people organize their campuses.
          The software does not organize counties — it helps people organize their counties.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Five Layers — Build Outward [OM-L1–L5]</h2>
        <div className="space-y-2">
          {LAYERS.map((layer) => (
            <div key={layer.id} className={`rounded-lg p-4 ${layer.color}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono opacity-80">{layer.id}</span>
                <span className="text-xs font-bold">Layer {layer.level}</span>
              </div>
              <p className="mt-1 font-bold">{layer.name}</p>
              <p className="mt-0.5 text-sm opacity-90">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card font-mono text-sm text-green-400 bg-slate-900 p-4">
        <pre>{`Emma
 ├── Noah → Olivia, Mason
 ├── Ava
 └── Liam`}</pre>
        <p className="mt-2 text-xs text-slate-400">Relationship-based growth [OM-003]</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Organizing Homes [OM-005]</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {HOMES.map((h) => (
            <div key={h.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span className="font-medium">{h.name}</span>
              <span className={`badge ${h.v1 ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"}`}>
                {h.v1 ? "V1" : "Later"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Database Root Entity [OM-010]</h2>
        <p className="mt-2 text-sm text-slate-600">Build order — individual first, outward:</p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm font-mono text-brand-700">
          <li>users (root)</li>
          <li>referrals</li>
          <li>counties + institutions (reference)</li>
          <li>user affiliations</li>
          <li>committees (v1.1)</li>
          <li>events (v1.2)</li>
        </ol>
      </div>

      <p className="text-sm text-slate-500">
        Full document: docs/build-steps/PHASE-001.5-ORGANIZING-MODEL.md
      </p>
    </div>
  );
}
