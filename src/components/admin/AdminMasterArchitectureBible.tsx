"use client";

import mab from "../../../data/registry/master-architecture-bible.json";

export function AdminMasterArchitectureBible() {
  const sections = Object.entries(mab.sections);
  const phases = Object.entries(mab.sixPhaseArchitectureComplete);

  return (
    <div className="space-y-6">
      <div className="card border-violet-400 bg-violet-100">
        <p className="text-xs font-semibold uppercase text-violet-900">VOLUME 0 · Master Architecture Bible</p>
        <h2 className="mt-1 text-xl font-bold text-violet-950">{mab.productName}</h2>
        <p className="mt-2 text-sm text-violet-900">{mab.longTermVision}</p>
        <p className="mt-2 text-xs font-semibold text-violet-800">
          {mab.requirementId} · {mab.status.replace(/([A-Z])/g, " $1").trim()} · Read before any code
        </p>
      </div>

      <div className="card border-violet-200 bg-violet-50/50">
        <h2 className="text-lg font-bold text-violet-950">Platform Shift [MAB-M01]</h2>
        <p className="mt-1 text-sm text-violet-900">
          From <span className="font-medium">{mab.platformShift.from}</span> to{" "}
          <span className="font-medium">{mab.platformShift.to}</span>
        </p>
        <p className="mt-2 text-xs italic text-violet-800">{mab.platformShift.distinction}</p>
      </div>

      <div className="card border-violet-200 bg-white">
        <h2 className="text-sm font-bold text-violet-950">Five Roles</h2>
        <p className="mt-1 text-xs text-violet-800">{mab.roles.join(" · ")}</p>
        <p className="mt-2 text-xs text-violet-700">{mab.conflictRule}</p>
      </div>

      <div className="card border-violet-200 bg-white">
        <h2 className="text-sm font-bold text-violet-950">Sections A–T</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {sections.map(([key, section]) => (
            <div key={key} className="rounded-lg border border-violet-100 p-2 text-xs text-violet-900">
              <span className="font-bold">{key}.</span> {section.title}
              <span className="ml-1 font-mono text-violet-600">[{section.requirementRef}]</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-violet-200 bg-violet-50/50">
        <h2 className="text-sm font-bold text-violet-950">20 Canonical Principles</h2>
        <ol className="mt-2 list-inside list-decimal space-y-0.5 text-xs text-violet-900">
          {mab.canonicalPrinciples.map((p) => (
            <li key={p.n}>{p.statement}</li>
          ))}
        </ol>
      </div>

      <div className="card border-amber-200 bg-amber-50/50">
        <h2 className="text-sm font-bold text-amber-950">Burt&apos;s First Rule [{mab.burtFirstRule.requirementRef}]</h2>
        <p className="mt-1 text-xs text-amber-800">Before implementing any feature, ask:</p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-amber-900">
          {mab.burtFirstRule.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </div>

      <div className="card border-violet-200 bg-white">
        <h2 className="text-sm font-bold text-violet-950">Six-Phase Architecture (Complete)</h2>
        <ul className="mt-2 space-y-1 text-xs text-violet-800">
          {phases.map(([key, name]) => (
            <li key={key}>
              <span className="font-medium capitalize">{key.replace(/phase(\d)/, "Phase $1")}</span> — {name}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-sm font-bold text-slate-900">Document</h2>
        <p className="mt-1 font-mono text-xs text-slate-600">{mab.docPath}</p>
        <p className="mt-1 text-xs text-slate-500">
          v1 scope · Target {mab.v1Scope.targetPagesOverTime} pages over time
        </p>
      </div>
    </div>
  );
}
