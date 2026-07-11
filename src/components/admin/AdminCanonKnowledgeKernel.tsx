/**
 * @canon COS-ARCH-000001
 * @requirements CKK-001
 */
"use client";

import ckk from "../../../data/registry/canonical-knowledge-kernel.json";
import readiness from "../../../data/canon/canon_readiness.json";
import validation from "../../../data/canon/canon_validation.json";

export function AdminCanonKnowledgeKernel() {
  const metrics = [
    { key: "architectureCoverage", label: "Architecture Coverage" },
    { key: "requirementTraceability", label: "Requirement Traceability" },
    { key: "implementationCoverage", label: "Implementation Coverage" },
    { key: "testCoverageByRequirement", label: "Test Coverage by Requirement" },
    { key: "documentationCoverage", label: "Documentation Coverage" },
    { key: "securityClassificationCoverage", label: "Security Classification" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="card border-indigo-400 bg-indigo-100">
        <p className="text-xs font-semibold uppercase text-indigo-900">COS Canon · Constitutional Infrastructure</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{ckk.productName}</h2>
        <p className="mt-2 text-sm text-indigo-900">{ckk.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-indigo-800">
          {ckk.documentId} · {ckk.requirementId} · {ckk.acceptanceCriteria} · Bootstrap Stage {ckk.bootstrap.currentStage}/{ckk.bootstrap.stagesTotal}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card border-indigo-200 bg-white">
          <p className="text-xs font-semibold text-indigo-700">Canon Objects</p>
          <p className="text-2xl font-bold text-indigo-950">{ckk.bootstrap.objectCount}</p>
        </div>
        <div className="card border-indigo-200 bg-white">
          <p className="text-xs font-semibold text-indigo-700">Relationships</p>
          <p className="text-2xl font-bold text-indigo-950">{ckk.bootstrap.relationshipCount}</p>
        </div>
        <div className="card border-indigo-200 bg-white">
          <p className="text-xs font-semibold text-indigo-700">Validation</p>
          <p className={`text-2xl font-bold ${validation.passed ? "text-emerald-700" : "text-amber-700"}`}>
            {validation.passed ? "PASSED" : "REVIEW"}
          </p>
        </div>
      </div>

      <div className="card border-indigo-200 bg-indigo-50/50">
        <h2 className="text-sm font-bold text-indigo-950">Ten Kernel Layers</h2>
        <ol className="mt-2 list-inside list-decimal space-y-0.5 text-xs text-indigo-900">
          {ckk.kernelLayers.layers.map((layer) => (
            <li key={layer}>{layer}</li>
          ))}
        </ol>
      </div>

      <div className="card border-indigo-200 bg-white">
        <h2 className="text-sm font-bold text-indigo-950">Canon Health (Evidence-Based)</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {metrics.map(({ key, label }) => {
            const m = readiness[key as keyof typeof readiness];
            if (!m || typeof m !== "object" || !("percent" in m)) return null;
            return (
              <div key={key} className="rounded-lg border border-indigo-100 p-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-indigo-900">{label}</span>
                  <span className="font-bold text-indigo-700">{m.percent}%</span>
                </div>
                <p className="text-indigo-600">
                  {m.numerator}/{m.denominator} · {m.label}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-indigo-600">
          Orphans: {readiness.orphanObjectCount} · Calculated: {new Date(readiness.calculatedAt).toLocaleString()}
        </p>
      </div>

      <div className="card border-indigo-200 bg-white">
        <h2 className="text-sm font-bold text-indigo-950">CLI Commands</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ckk.cliCommands.map((cmd) => (
            <code key={cmd} className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-900">
              npm run {cmd}
            </code>
          ))}
        </div>
      </div>

      <div className="card border-indigo-200 bg-indigo-50/50">
        <h2 className="text-sm font-bold text-indigo-950">COS Canon · Canon Twin</h2>
        <p className="mt-1 text-xs text-indigo-900">
          <span className="font-mono">{ckk.cosCanon.canonId}</span> — {ckk.cosCanon.name}
        </p>
        <p className="mt-1 text-xs text-indigo-900">
          <span className="font-mono">{ckk.canonTwin.canonId}</span> — {ckk.canonTwin.name}
        </p>
        <p className="mt-2 text-xs italic text-indigo-800">
          CKK governed by COS Canon · Recommended before Volume 6 implementation
        </p>
      </div>
    </div>
  );
}
