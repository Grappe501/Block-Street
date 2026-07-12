"use client";

import pgl from "../../../data/registry/personal-growth-leadership.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminPersonalGrowthLeadership() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-purple-300 bg-purple-50">
        <p className="text-xs font-semibold uppercase text-purple-800">PHASE-003.8 · Personal Growth & Leadership</p>
        <h2 className="mt-1 text-xl font-bold text-purple-950">{pgl.motto}</h2>
        <p className="mt-2 text-sm font-medium text-purple-900">{pgl.principle}</p>
        <p className="mt-1 text-xs text-purple-700">{pgl.purpose}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Growth Graph [PGL-M13]</h2>
        <p className="mt-1 text-sm text-brand-800">{pgl.growthGraph.description}</p>
        <p className="mt-2 text-sm italic text-brand-900">&ldquo;{pgl.growthGraph.coreQuestion}&rdquo;</p>
        <p className="mt-2 font-mono text-xs text-brand-700">{pgl.growthGraph.orchestrator}</p>
        <div className="mt-3 space-y-1 text-xs text-brand-900">
          {pgl.growthGraph.exampleChain.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              {i > 0 && <span className="text-brand-400">↓</span>}
              <span>{step}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-brand-700">{pgl.growthGraph.distinctFromTrustGraph}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Five Growth Domains [PGL-M04]</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {pgl.growthDomains.map((domain) => (
            <div key={domain.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold text-slate-900">{domain.label}</span>
              <p className="mt-1 text-xs text-slate-500">{domain.examples.slice(0, 3).join(" · ")}…</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Skills & Interests</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {pgl.skills.examples.slice(0, 8).map((s) => (
            <span key={s} className="badge bg-slate-100 text-slate-700 text-xs">{s}</span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {pgl.interests.examples.map((i) => (
            <span key={i} className="badge bg-indigo-100 text-indigo-800 text-xs">{i}</span>
          ))}
        </div>
      </div>

      <div className="card border-green-200 bg-green-50">
        <h2 className="text-lg font-bold text-green-950">Growth Philosophy</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {pgl.growthPhilosophy.channels.map((c) => (
            <span key={c} className="badge bg-green-100 text-green-800 text-xs">{c}</span>
          ))}
        </div>
        <p className="mt-2 text-xs text-green-800">Software: {pgl.growthPhilosophy.softwareRole}</p>
      </div>

      <div className="card border-rose-200 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-rose-900">{doneSteps + 1}/{peopleSystem.steps.length} steps after 3.8</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/PERSONAL_GROWTH_LEADERSHIP.md · PGL-001 · JRN-001 · CPP-001
      </p>
    </div>
  );
}
