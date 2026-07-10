"use client";

const BOUNDARIES = [
  { id: "DG-001", title: "Independent Platform", summary: "Not official site of any institution, government, or party." },
  { id: "DG-002", title: "Respect for IP", summary: "No logos/seals/mascots without permission. Facts OK. Color inspiration only." },
  { id: "DG-003", title: "Nonpartisan Platform", summary: "No endorsement of parties, candidates, or ballot measures." },
  { id: "DG-004", title: "Youth Safety & Privacy", summary: "Minimize data. Clear usage. Safeguards. Age-appropriate design." },
  { id: "DG-005", title: "Local Independence", summary: "Connect, support, inform — never centrally control." },
  { id: "DG-006", title: "Equal Opportunity", summary: "No permanent institutional advantages." },
  { id: "DG-007", title: "Transparent Growth", summary: "Value mentorship & impact — not referral counts alone." },
  { id: "DG-008", title: "No Vendor Lock-In", summary: "Exportable data. Open standards. Documented architecture." },
  { id: "DG-009", title: "Versioned Growth", summary: "Extend architecture — never rebuild from scratch." },
  { id: "DG-010", title: "Public Info & Attribution", summary: "Reliable sources. Periodic review. Accurate data." },
  { id: "DG-011", title: "Inclusive Participation", summary: "Reduce barriers: tech, geography, disability, experience." },
  { id: "DG-012", title: "Human-Centered Technology", summary: "Digital strengthens real-world community." },
  { id: "DG-013", title: "Scalable Architecture", summary: "Design for all counties, all institutions, growth." },
  { id: "DG-014", title: "Measured Innovation", summary: "Design → document → implement → evaluate → improve." },
  { id: "DG-015", title: "Mission Before Features", summary: "Technically possible ≠ should be built." },
];

export function AdminGuardrails() {
  return (
    <div className="space-y-6">
      <div className="card border-red-200 bg-red-50">
        <p className="text-xs font-semibold uppercase text-red-800">PHASE-001.4 · Mandatory Guardrails</p>
        <h2 className="mt-1 text-xl font-bold text-red-950">Design Guardrails</h2>
        <p className="mt-2 text-sm text-red-900">
          Conflict with guardrails → redesign or constitutional change approval. Never silent drift.
        </p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <p className="text-xs font-semibold uppercase text-brand-700">Standing Doctrine [ED-001]</p>
        <p className="mt-2 text-lg font-bold text-brand-900">
          Design First · Build Second · Validate Third · Iterate Fourth
        </p>
        <p className="mt-2 text-sm text-brand-800">
          No implementation without approved design. No feature without validation against Constitution + Guardrails.
        </p>
      </div>

      <div className="space-y-2">
        {BOUNDARIES.map((b) => (
          <div key={b.id} className="card !p-4">
            <span className="text-xs font-mono text-red-600">{b.id}</span>
            <p className="font-bold text-slate-900">{b.title}</p>
            <p className="mt-0.5 text-sm text-slate-600">{b.summary}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Conflict Resolution [BG-001]</h2>
        <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-slate-700">
          <li>Platform Constitution [CP-*]</li>
          <li>Design Guardrails [DG-*]</li>
          <li>North Star [NS-*]</li>
          <li>Feature request / convenience</li>
        </ol>
      </div>

      <p className="text-sm text-slate-500">
        Full document: docs/build-steps/PHASE-001.4-PLATFORM-BOUNDARIES.md
      </p>
    </div>
  );
}
