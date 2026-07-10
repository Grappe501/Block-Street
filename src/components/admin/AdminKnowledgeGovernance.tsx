"use client";

import governance from "../../../data/registry/knowledge-governance.json";

const CLASS_COLORS: Record<string, string> = {
  A: "bg-blue-100 text-blue-800 border-blue-200",
  B: "bg-green-100 text-green-800 border-green-200",
  C: "bg-amber-100 text-amber-800 border-amber-200",
  D: "bg-slate-100 text-slate-700 border-slate-200",
};

export function AdminKnowledgeGovernance() {
  return (
    <div className="space-y-6">
      <div className="card border-indigo-300 bg-indigo-50">
        <p className="text-xs font-semibold uppercase text-indigo-800">PHASE-002.8 · Knowledge & Data Governance</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">Registry Credibility</h2>
        <p className="mt-2 text-sm font-medium text-indigo-900">{governance.motto}</p>
        <p className="mt-1 text-sm text-indigo-800">{governance.principle}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Four Classes of Data [KDG-M03]</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {governance.dataClasses.map((cls) => (
            <div key={cls.id} className={`rounded-lg border p-3 ${CLASS_COLORS[cls.id]}`}>
              <p className="font-semibold">Class {cls.id} — {cls.name}</p>
              <p className="mt-1 text-xs opacity-90">{cls.description}</p>
              <p className="mt-2 text-xs font-mono opacity-75">{cls.changeFrequency}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Knowledge Provenance [KDG-M10]</h2>
        <p className="mt-1 text-sm text-brand-800">
          The platform remembers <em>why</em> it believes something is true — not just the value.
        </p>
        <div className="mt-3 rounded-lg border border-brand-200 bg-white p-4 font-mono text-xs text-slate-700">
          <p className="text-slate-500">// Example: enrollment field</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(governance.provenanceExample, null, 2)}
          </pre>
        </div>
        <p className="mt-2 text-xs text-brand-700">
          Provenance fields: {governance.provenanceFields.join(" · ")}
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Source Confidence [KDG-M09]</h2>
        <div className="mt-2 space-y-1">
          {governance.confidenceLevels.map((level) => (
            <div key={level.key} className="flex items-center justify-between text-xs">
              <span className="text-slate-700">{level.label}</span>
              <span className="font-mono text-slate-400">
                review every {level.reviewCycleMonths}mo
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Approved Sources [KDG-M08]</h2>
        <div className="mt-2 space-y-1">
          {governance.approvedSources.map((src) => (
            <div key={src.id} className="flex justify-between text-xs">
              <span className="text-slate-700">{src.name}</span>
              <span className="font-mono text-brand-600">{src.confidenceDefault}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Review Workflow [KDG-M17]</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
          {governance.reviewWorkflow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">AI Rules [KDG-M16]</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900">
          {governance.aiRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-slate-500">
        Full spec: docs/phase-02/KNOWLEDGE_DATA_GOVERNANCE_FRAMEWORK.md · KDG-001
      </p>
    </div>
  );
}
