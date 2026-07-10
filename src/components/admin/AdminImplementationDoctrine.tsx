"use client";

const LIFECYCLE = [
  { phase: "1", name: "Design", items: "Requirements · Architecture · Approval" },
  { phase: "2", name: "Implementation", items: "Database · Backend · Frontend · Testing" },
  { phase: "3", name: "Validation", items: "Manual review · Functional · Acceptance · Performance" },
  { phase: "4", name: "Feedback", items: "Observe · Collect · Identify friction · Prioritize" },
  { phase: "5", name: "Version Next", items: "Plan · Design · Implement · Repeat" },
];

const FOUNDATIONS = [
  "Identity",
  "Registry",
  "Relationships",
  "Communities",
  "Recruitment",
  "Communication",
  "Analytics",
  "Enhancement",
];

const IMPL_QUESTIONS = [
  "Has this been designed?",
  "Is the architecture approved?",
  "Does this align with the Constitution?",
  "Does it strengthen organizing?",
  "Can it scale?",
  "Can future versions extend it?",
];

const QUALITY = [
  "Functional correctness",
  "Responsive design",
  "Accessibility review",
  "Performance review",
  "Security review",
  "Documentation completeness",
  "Acceptance testing",
];

const BURT_DUTIES = [
  "Read approved documentation first",
  "Implement one vertical capability at a time",
  "Maintain documentation",
  "Report implementation observations",
  "Never silently change approved design",
];

export function AdminImplementationDoctrine() {
  return (
    <div className="space-y-6">
      <div className="card border-brand-300 bg-brand-50">
        <p className="text-xs font-semibold uppercase text-brand-700">PHASE-001.8 · Burt&apos;s Operating Manual</p>
        <h2 className="mt-1 text-xl font-bold text-brand-950">Implementation Doctrine</h2>
        <p className="mt-2 text-lg font-semibold text-brand-900">
          Design completely. Build deliberately. Validate thoroughly. Improve continuously.
        </p>
        <p className="mt-2 text-sm text-brand-800">
          Steps 1.1–1.7 define <em>what</em> we build. This defines <em>how</em> Burt builds it.
        </p>
      </div>

      <div className="card border-green-300 bg-green-50">
        <p className="text-xs font-semibold uppercase text-green-800">Phase 1 Complete (9 Steps)</p>
        <p className="mt-1 font-bold text-green-950">Constitution + Traceability Gate Active</p>
        <p className="mt-1 text-sm text-green-800">
          Before production code: verify requirement in data/requirements-registry.json [TR-BR]
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Golden Rule [ED-GR]</h2>
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-900">
          Never begin implementing a capability that has not first been designed and approved.
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Development Lifecycle [ED-LC]</h2>
        <div className="mt-3 space-y-2">
          {LIFECYCLE.map((l) => (
            <div key={l.phase} className="rounded-lg border border-slate-200 p-3">
              <span className="font-mono text-xs text-brand-600">Phase {l.phase}</span>
              <p className="font-semibold text-slate-900">{l.name}</p>
              <p className="text-sm text-slate-500">{l.items}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Vertical Slice [ED-VS]</h2>
        <p className="mt-2 text-sm text-slate-600">
          Complete one capability end-to-end before starting the next:
        </p>
        <p className="mt-2 font-mono text-xs text-slate-700">
          DB → API → Admin → Public → Search → Mobile → Testing → Docs → Complete
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Stable Foundations [ED-SF]</h2>
        <div className="mt-2 flex flex-wrap gap-1">
          {FOUNDATIONS.map((f, i) => (
            <span key={f} className="badge bg-slate-100 text-slate-700">
              {i + 1}. {f}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Before Writing Code [ED-IQ]</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
          {IMPL_QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-amber-800">If any answer is &quot;no&quot; → pause implementation.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-bold text-slate-900">Burt [ED-BR]</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
            {BURT_DUTIES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="text-lg font-bold text-slate-900">Steve [ED-SR]</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>Mission, vision, requirements</li>
            <li>Architecture approval</li>
            <li>Version priorities</li>
            <li>Strategic direction</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Quality Standards [ED-QS]</h2>
        <div className="mt-2 flex flex-wrap gap-1">
          {QUALITY.map((q) => (
            <span key={q} className="badge bg-green-50 text-green-800">{q}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Final Deliverable [ED-FD]</h2>
        <p className="mt-2 text-sm text-slate-600">Every completed implementation concludes with:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
          <li>What was built</li>
          <li>What changed</li>
          <li>What was deferred</li>
          <li>Known limitations</li>
          <li>Recommendations for Version 2</li>
        </ul>
      </div>

      <p className="text-sm text-slate-500">
        Full document: docs/build-steps/PHASE-001.8-IMPLEMENTATION-DOCTRINE.md · Build Bible: docs/build-steps/BUILD-BIBLE.md
      </p>
    </div>
  );
}
