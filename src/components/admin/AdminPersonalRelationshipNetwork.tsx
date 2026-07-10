"use client";

import prn from "../../../data/registry/personal-relationship-network.json";
import hq from "../../../data/registry/personal-headquarters.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminPersonalRelationshipNetwork() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;
  const v1Types = prn.relationshipTypes.filter((t) => t.v1 === true);

  return (
    <div className="space-y-6">
      <div className="card border-violet-300 bg-violet-50">
        <p className="text-xs font-semibold uppercase text-violet-800">PHASE-003.4 · Personal Relationship Network</p>
        <h2 className="mt-1 text-xl font-bold text-violet-950">{prn.motto}</h2>
        <p className="mt-2 text-sm font-medium text-violet-900">{prn.principle}</p>
        <p className="mt-1 text-xs text-violet-700">{prn.signatureFeature}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Trust Graph [PRN-M16]</h2>
        <p className="mt-1 text-sm text-brand-800">{prn.trustGraph.description}</p>
        <p className="mt-2 text-sm italic text-brand-900">{prn.trustGraph.insight}</p>
        <p className="mt-2 font-mono text-xs text-brand-700">{prn.trustGraph.orchestrator}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {prn.trustGraph.signals.map((s) => (
            <span key={s} className="badge bg-brand-100 text-brand-800 text-xs">
              {s.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Auto-Provisioning [PRN-M04]</h2>
        <p className="mt-1 font-mono text-xs text-slate-600">{prn.autoProvisioning.hook}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {prn.autoProvisioning.assets.map((asset) => (
            <div key={asset.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold text-slate-900">{asset.id}</span>
              {"pattern" in asset && (
                <span className="ml-2 font-mono text-xs text-brand-600">{asset.pattern}</span>
              )}
              <p className="mt-1 text-xs text-slate-500">V1: {String(asset.v1)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Relationship Types [PRN-M06]</h2>
        <p className="mt-1 text-xs text-slate-500">{v1Types.length} types in V1 · extensible enum</p>
        <div className="mt-3 space-y-2">
          {prn.relationshipTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between rounded-lg border border-slate-200 p-2 text-sm">
              <span className="font-medium text-slate-900">{type.label}</span>
              <div className="text-right">
                <span className="font-mono text-xs text-slate-500">{type.edge}</span>
                <span className={`ml-2 badge text-xs ${type.v1 === true ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>
                  {String(type.v1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Relationship Strength [PRN-M07]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {prn.relationshipStrength.map((s) => (
            <span key={s.stage} className="badge bg-indigo-100 text-indigo-800 text-xs" title={s.meaning}>
              {s.stage}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Invitation Philosophy [NET-002]</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900">
          {prn.invitationPhilosophy.examples.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      </div>

      <div className="card border-green-200 bg-green-50">
        <h2 className="text-lg font-bold text-green-950">HQ Integration · My Network</h2>
        <p className="mt-1 text-sm text-green-900">
          Section: <span className="font-mono">{prn.hqIntegration.section}</span> ·{" "}
          {prn.hqIntegration.aggregator}
        </p>
        <p className="mt-1 text-xs text-green-700">
          Parent: {hq.platformCenter.aggregator}
        </p>
      </div>

      <div className="card border-rose-200 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-rose-900">{doneSteps}/{peopleSystem.steps.length} steps complete</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/PERSONAL_RELATIONSHIP_NETWORK.md · NET-001 · NET-002 · NET-003 · PRN-M01–M18
      </p>
    </div>
  );
}
