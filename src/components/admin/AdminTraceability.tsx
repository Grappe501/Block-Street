"use client";

import { useState } from "react";
import registry from "../../../data/requirements-registry.json";

const STATUS_STYLE: Record<string, string> = {
  done: "bg-green-100 text-green-800",
  in_progress: "bg-amber-100 text-amber-800",
  pending: "bg-slate-100 text-slate-600",
  approved: "bg-blue-100 text-blue-800",
};

export function AdminTraceability() {
  const [filter, setFilter] = useState<string>("all");
  const { requirements, pages, databaseObjects, apiEndpoints, domainPrefixes, traceabilityChain, summary, motto } = registry;

  const filtered =
    filter === "all"
      ? requirements
      : requirements.filter((r) => r.implementationStatus === filter);

  return (
    <div className="space-y-6">
      <div className="card border-red-300 bg-red-50">
        <p className="text-xs font-semibold uppercase text-red-800">PHASE-001.9 · Production Code Gate</p>
        <h2 className="mt-1 text-xl font-bold text-red-950">Master Traceability System</h2>
        <p className="mt-2 text-lg font-semibold text-red-900">&ldquo;{motto}&rdquo;</p>
        <p className="mt-2 text-sm text-red-800">
          Mandatory before Burt writes production code. Every feature must trace to an approved requirement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-brand-600">{summary.totalRequirements}</p>
          <p className="text-sm text-slate-600">Requirements</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{summary.done}</p>
          <p className="text-sm text-slate-600">Implemented</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-amber-600">{summary.inProgress}</p>
          <p className="text-sm text-slate-600">In Progress</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-600">{summary.criticalPending}</p>
          <p className="text-sm text-slate-600">Critical Pending</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Traceability Chain [TR-003]</h2>
        <p className="mt-2 font-mono text-xs leading-relaxed text-slate-600">
          {traceabilityChain.join(" → ")}
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Burt Verification Checklist [TR-BR]</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
          <li>Requirement exists in registry</li>
          <li>Requirement approved</li>
          <li>Dependencies complete</li>
          <li>Acceptance criteria defined</li>
          <li>Test cases identified</li>
          <li>Documentation location established</li>
        </ol>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">Requirements Registry</h2>
          <div className="flex gap-1">
            {(["all", "done", "in_progress", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-2 py-1 text-xs font-medium ${
                  filter === f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 space-y-3">
          {filtered.map((req) => (
            <div key={req.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-sm font-bold text-brand-600">{req.id}</span>
                  <p className="font-semibold text-slate-900">{req.title}</p>
                  <p className="text-sm text-slate-500">{req.purpose}</p>
                </div>
                <span className={`badge ${STATUS_STYLE[req.implementationStatus]}`}>
                  {req.implementationStatus.replace("_", " ")}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1 text-xs">
                <span className="badge bg-purple-50 text-purple-700">Principle: {req.principle}</span>
                <span className="badge bg-slate-100 text-slate-600">Priority: {req.priority}</span>
              </div>
              {req.trace && (
                <div className="mt-2 rounded bg-slate-50 p-2 font-mono text-xs text-slate-600">
                  {req.trace.database && <span className="mr-3">{req.trace.database}</span>}
                  {req.trace.api && <span className="mr-3">{req.trace.api}</span>}
                  {req.trace.frontend && <span className="mr-3">{req.trace.frontend}</span>}
                  {req.trace.test && <span className="mr-3">{req.trace.test}</span>}
                  {req.trace.doc && <span>{req.trace.doc}</span>}
                </div>
              )}
              <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
                {req.acceptanceCriteria.slice(0, 2).map((c) => (
                  <li key={c}>{c}</li>
                ))}
                {req.acceptanceCriteria.length > 2 && (
                  <li>+{req.acceptanceCriteria.length - 2} more criteria</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h3 className="font-bold text-slate-900">Pages [TR-010]</h3>
          <div className="mt-2 space-y-1">
            {pages.map((p) => (
              <div key={p.id} className="flex justify-between text-xs">
                <span className="font-mono text-brand-600">{p.id}</span>
                <span className={`badge ${STATUS_STYLE[p.status]}`}>{p.status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold text-slate-900">Database [TR-011]</h3>
          <div className="mt-2 space-y-1">
            {databaseObjects.map((d) => (
              <div key={d.id} className="flex justify-between text-xs">
                <span className="font-mono text-brand-600">{d.id}</span>
                <span className={`badge ${STATUS_STYLE[d.status]}`}>{d.status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold text-slate-900">API [TR-012]</h3>
          <div className="mt-2 space-y-1">
            {apiEndpoints.map((a) => (
              <div key={a.id} className="text-xs">
                <span className="font-mono text-brand-600">{a.id}</span>
                <span className="ml-2 text-slate-500">{a.method} {a.path}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Domain Prefixes [TR-005]</h2>
        <div className="mt-2 flex flex-wrap gap-1">
          {domainPrefixes.map((d) => (
            <span key={d.prefix} className="badge bg-slate-100 text-slate-700" title={d.domain}>
              {d.prefix}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Full document: docs/build-steps/PHASE-001.9-MASTER-TRACEABILITY.md · Registry: data/requirements-registry.json
      </p>
    </div>
  );
}
