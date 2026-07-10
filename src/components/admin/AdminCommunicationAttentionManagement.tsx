"use client";

import cam from "../../../data/registry/communication-attention-management.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminCommunicationAttentionManagement() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-cyan-300 bg-cyan-50">
        <p className="text-xs font-semibold uppercase text-cyan-800">PHASE-003.10 · Communication & Attention</p>
        <h2 className="mt-1 text-xl font-bold text-cyan-950">{cam.motto}</h2>
        <p className="mt-2 text-sm font-medium text-cyan-900">{cam.principle}</p>
        <p className="mt-2 text-xs italic text-cyan-700">{cam.constitutionalAlignment}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Attention Budget [CAM-M13]</h2>
        <p className="mt-1 text-sm text-brand-800">{cam.attentionBudget.description}</p>
        <p className="mt-2 font-mono text-xs text-brand-700">{cam.attentionBudget.orchestrator}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-brand-900">
          {cam.attentionBudget.behaviors.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Communication Types [CAM-M04]</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {cam.communicationTypes.map((type) => (
            <div key={type.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold text-slate-900">{type.label}</span>
              <p className="mt-1 text-xs text-slate-500">{type.examples.slice(0, 3).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Priority Levels [CAM-M11]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {cam.priorityLevels.map((p) => (
            <span key={p.key} className="badge bg-slate-100 text-slate-800 text-xs" title={p.defaultDelivery}>
              {p.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Smart Digest [CAM-M08]</h2>
        <div className="mt-2 space-y-1 text-sm text-amber-900">
          {cam.smartDigest.options.map((d) => (
            <p key={d.id}>
              <span className="font-semibold">{d.id}</span> — {d.cadence}
            </p>
          ))}
        </div>
      </div>

      <div className="card border-red-200 bg-red-50">
        <h2 className="text-lg font-bold text-red-950">Attention Protection — Avoid</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-red-900">
          {cam.attentionProtection.avoid.map((a) => (
            <li key={a}>{a.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps + 1}/{peopleSystem.steps.length} steps after 3.10</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md · CAM-001 · MSG-001 · PCC-M17
      </p>
    </div>
  );
}
