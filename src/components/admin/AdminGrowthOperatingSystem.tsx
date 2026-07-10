"use client";

import gos from "../../../data/growth/growth-operating-system.json";
import gcn from "../../../data/registry/growth-constitution.json";
import gosCert from "../../../data/registry/growth-operating-system-certification-network-readiness.json";

export function AdminGrowthOperatingSystem() {
  const doneSteps = gos.steps.filter((s) => s.status === "done").length;
  const genome = gosCert.communityGenome;
  const levels = gosCert.growthReadinessLevels;

  return (
    <div className="space-y-6">
      <div className="card border-green-400 bg-green-100">
        <p className="text-xs font-semibold uppercase text-green-900">PHASE-006 COMPLETE · Growth Operating System</p>
        <h2 className="mt-1 text-xl font-bold text-green-950">{gosCert.readinessQuestion}</h2>
        <p className="mt-2 text-sm text-green-900">{gosCert.purpose}</p>
        <p className="mt-2 text-xs font-semibold text-green-800">
          {doneSteps}/{gos.steps.length} steps · Six-phase architecture complete
        </p>
      </div>

      <div className="card border-emerald-300 bg-emerald-50">
        <p className="text-xs font-semibold uppercase text-emerald-800">PHASE-006.14 · Certification & Network Readiness</p>
        <h2 className="mt-1 text-lg font-bold text-emerald-950">{gosCert.guidingPrinciple}</h2>
        <p className="mt-1 text-xs text-emerald-800">{gosCert.certificationQuestion}</p>
      </div>

      <div className="card border-emerald-200 bg-white">
        <h2 className="text-lg font-bold text-emerald-950">Community Genome [GOS-M10]</h2>
        <p className="mt-1 text-sm text-emerald-900">{genome.description}</p>
        <p className="mt-2 text-xs text-emerald-700">{genome.elements.length} genome elements · Foundry instantiates</p>
      </div>

      <div className="card border-emerald-200 bg-emerald-50/50">
        <h2 className="text-sm font-bold text-emerald-950">Growth Readiness Levels</h2>
        <ul className="mt-2 space-y-1 text-xs text-emerald-800">
          {levels.levels.map((l) => (
            <li key={l.level}>
              <span className="font-medium">L{l.level} {l.name}</span> — {l.description}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-emerald-600">{gosCert.networkReadinessDashboard.route}</p>
      </div>

      <div className="card border-emerald-200 bg-white">
        <h2 className="text-sm font-bold text-emerald-950">12 Growth Capability Domains</h2>
        <p className="mt-1 text-xs text-emerald-800">
          {gosCert.requiredGrowthCapabilities.map((c) => c.label).join(" · ")}
        </p>
      </div>

      <div className="card border-indigo-200 bg-indigo-50/50">
        <h2 className="text-sm font-bold text-indigo-950">Factory Layer Complete — Volumes 1–6</h2>
        <p className="mt-1 text-xs text-indigo-900">
          Engineering, data, UX, AI, operations, and experience bibles [IVS-001]
        </p>
        <p className="mt-1 font-mono text-xs text-indigo-700">docs/master/VOLUMES-INDEX.md</p>
        <p className="mt-1 text-xs text-indigo-600">Phase 7 deferred until volumes expanded</p>
      </div>

      <div className="card border-violet-200 bg-violet-50/50">
        <h2 className="text-sm font-bold text-violet-950">Volume 0 Complete — Read Before Production Code</h2>
        <p className="mt-1 text-xs text-violet-900">
          Master Architecture Bible [{gosCert.masterArchitectureBibleRecommendation.requirementId}]
        </p>
        <p className="mt-1 font-mono text-xs text-violet-700">{gosCert.masterArchitectureBibleRecommendation.docPath}</p>
      </div>

      <div className="card border-emerald-200 bg-emerald-50/50">
        <h2 className="text-sm font-bold text-emerald-950">Growth Constitution · GCN</h2>
        <p className="mt-1 text-xs text-emerald-900">{gcn.guidingPrinciple}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Phase 6 Modules</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-800">
          {gos.steps.map((step) => (
            <li key={step.id} className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="font-medium">{step.id}</span>
              <span>{step.name}</span>
              <span className="text-xs text-slate-500">[{step.requirement}]</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-06/GROWTH_OPERATING_SYSTEM_CERTIFICATION_NETWORK_READINESS.md · GOS-001 · Phase 6 complete
      </p>
    </div>
  );
}
