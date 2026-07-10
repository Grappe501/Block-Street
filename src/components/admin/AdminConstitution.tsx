"use client";

const PRINCIPLES = [
  { id: "CP-001", title: "Every Young Arkansan Has an Organizing Home", summary: "Institution, county, or personal network — reduce barriers." },
  { id: "CP-002", title: "Equal Standing", summary: "Every county, institution, participant — equal capabilities." },
  { id: "CP-003", title: "Relationships Come Before Technology", summary: "People are the purpose. Technology is infrastructure." },
  { id: "CP-004", title: "Local Communities Own Their Voice", summary: "Campus and county set priorities — platform connects, not directs." },
  { id: "CP-005", title: "Nonpartisan Infrastructure", summary: "No party or candidate promotion. Organizing tools only." },
  { id: "CP-006", title: "Leadership Is Earned", summary: "Service, initiative, mentorship — not assigned authority." },
  { id: "CP-007", title: "Privacy by Design", summary: "Minimal data. Clear use. Trust central." },
  { id: "CP-008", title: "Mobile First", summary: "Design for phones first. Desktop enhances." },
  { id: "CP-009", title: "Accessibility", summary: "Simple, clear, inclusive for all abilities." },
  { id: "CP-010", title: "Build for Expansion", summary: "Add schools, counties, features without redesign." },
  { id: "CP-011", title: "Visible Progress Builds Momentum", summary: "Show statewide progress — counties, schools, organizers." },
  { id: "CP-012", title: "Local Identity Matters", summary: "\"This space was built for people like me.\"" },
  { id: "CP-013", title: "The Platform Exists to Teach Leadership", summary: "Organizing + leadership development platform." },
  { id: "CP-014", title: "Continuous Improvement", summary: "Evolve features — preserve constitutional principles." },
  { id: "CP-015", title: "The Network Outlasts Individuals", summary: "Knowledge and capacity survive graduation." },
];

const CONSTITUTIONAL_TEST = [
  "Does it strengthen relationships?",
  "Does it preserve equal opportunity?",
  "Does it empower local communities?",
  "Does it protect participant trust?",
  "Does it help develop leaders?",
  "Can it scale across Arkansas?",
  "Does it align with the nonpartisan purpose?",
  "Does it improve the participant experience?",
  "Does it preserve future flexibility?",
  "Will this still make sense five years from now?",
];

export function AdminConstitution() {
  return (
    <div className="space-y-6">
      <div className="card border-amber-200 bg-amber-50">
        <p className="text-xs font-semibold uppercase text-amber-800">PHASE-001.3 · Immutable Doctrine</p>
        <h2 className="mt-1 text-xl font-bold text-amber-950">Platform Constitution</h2>
        <p className="mt-2 text-sm text-amber-900">
          15 principles [CP-001–CP-015]. Difficult to change. Guide every implementation regardless of who writes code.
        </p>
      </div>

      <div className="space-y-2">
        {PRINCIPLES.map((p, i) => (
          <div key={p.id} className="card !p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {i + 1}
              </span>
              <div>
                <span className="text-xs font-mono text-brand-600">{p.id}</span>
                <p className="font-bold text-slate-900">{p.title}</p>
                <p className="mt-0.5 text-sm text-slate-600">{p.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Constitutional Test [CT-001]</h2>
        <p className="mt-1 text-sm text-slate-500">Before approving any significant feature.</p>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-slate-700">
          {CONSTITUTIONAL_TEST.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </div>

      <p className="text-sm text-slate-500">
        Full document: docs/build-steps/PHASE-001.3-CORE-PRINCIPLES.md
      </p>
    </div>
  );
}
