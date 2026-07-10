"use client";

export function AdminNorthStar() {
  const questions = [
    { id: "NS-Q1", q: "Does this help people build relationships?", ref: "NS-013" },
    { id: "NS-Q2", q: "Does this strengthen local communities?", ref: "NS-013" },
    { id: "NS-Q3", q: "Does this increase participation?", ref: "NS-013" },
    { id: "NS-Q4", q: "Can this scale to every county and educational institution?", ref: "NS-013" },
    { id: "NS-Q5", q: "Does this preserve equal opportunity for every organizing community?", ref: "NS-013" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-brand-200 bg-gradient-to-br from-brand-950 to-brand-800 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-200">PHASE-001.2 · NS-002</p>
        <h2 className="mt-2 text-xl font-bold">The North Star</h2>
        <p className="mt-4 text-lg text-brand-100">
          Every young Arkansan has an organizing home, a trusted network, and the tools to build
          relationships, develop leadership, strengthen their community, and participate in civic life.
        </p>
        <p className="mt-4 text-sm font-semibold text-white">
          Does this help us reach the North Star? If no — it doesn&apos;t belong in V1.
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Five North Star Questions [NS-013]</h2>
        <p className="mt-1 text-sm text-slate-500">Ask before approving any feature.</p>
        <div className="mt-4 space-y-3">
          {questions.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-mono text-brand-600">{item.id}</span>
              <p className="mt-1 font-medium text-slate-900">{item.q}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Success Metrics [NS-004]</h2>
        <p className="mt-2 text-sm text-slate-600">Not just registrations — network strength.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Relationships", "Participation", "Leadership", "Collaboration",
            "Local engagement", "Volunteerism", "Civic knowledge", "Mentoring",
          ].map((m) => (
            <span key={m} className="badge bg-brand-100 text-brand-800">{m}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Personal Network", ref: "NS-006", desc: "Share link, QR, relationship tree" },
          { title: "Campus", ref: "NS-007", desc: "\"This is my campus.\"" },
          { title: "County", ref: "NS-008", desc: "\"This is my county.\"" },
          { title: "Statewide", ref: "NS-009", desc: "Connect — not control" },
        ].map((v) => (
          <div key={v.ref} className="card !p-4">
            <span className="text-xs font-mono text-brand-600">{v.ref}</span>
            <p className="mt-1 font-bold text-slate-900">{v.title}</p>
            <p className="mt-1 text-sm text-slate-600">{v.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        Full document: docs/build-steps/PHASE-001.2-NORTH-STAR-OUTCOME.md
      </p>
    </div>
  );
}
