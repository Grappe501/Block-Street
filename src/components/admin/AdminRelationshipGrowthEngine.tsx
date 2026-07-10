"use client";

import rge from "../../../data/registry/relationship-growth-engine.json";
import prn from "../../../data/registry/personal-relationship-network.json";
import peopleSystem from "../../../data/people/people-relationship-system.json";

export function AdminRelationshipGrowthEngine() {
  const doneSteps = peopleSystem.steps.filter((s) => s.status === "done").length;
  const v1Methods = rge.invitationMethods.filter((m) => m.v1 === true);

  return (
    <div className="space-y-6">
      <div className="card border-emerald-300 bg-emerald-50">
        <p className="text-xs font-semibold uppercase text-emerald-800">PHASE-003.5 · Relationship Growth Engine</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{rge.motto}</h2>
        <p className="mt-2 text-sm font-medium text-emerald-900">{rge.principle}</p>
        <p className="mt-2 text-xs italic text-emerald-700">Core question: {rge.coreQuestion}</p>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Organizing Circles [RGE-M15]</h2>
        <p className="mt-1 text-sm text-brand-800">{rge.organizingCircles.description}</p>
        <p className="mt-2 text-xs text-brand-700">{rge.organizingCircles.notSurveillanceOrMassMessaging}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {rge.organizingCircles.exampleCircles.map((c) => (
            <span key={c} className="badge bg-brand-100 text-brand-800 text-xs">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Invitation Lifecycle [RGE-M09]</h2>
        <div className="mt-3 flex flex-wrap items-center gap-1 text-sm">
          {rge.invitationLifecycle.states.map((state, i) => (
            <span key={state.key} className="flex items-center gap-1">
              <span
                className={`rounded px-2 py-1 font-mono text-xs ${
                  state.v1 === true ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                }`}
              >
                {state.key}
              </span>
              {i < rge.invitationLifecycle.states.length - 1 && (
                <span className="text-slate-400">→</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Invitation Methods · V1</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {v1Methods.map((m) => (
            <span key={m.method} className="badge bg-green-100 text-green-800 text-xs">
              {m.method}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Personalized Landing [PAGE-SHARE]</h2>
        <p className="mt-1 font-mono text-xs text-amber-800">{rge.personalizedLanding.route}</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-900">
          {rge.personalizedLanding.v1Minimum.map((el) => (
            <li key={el}>{el}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Healthy Growth [RGE-M13]</h2>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-green-700">Reward</p>
            <ul className="mt-1 list-inside list-disc text-xs text-slate-700">
              {rge.healthyGrowth.reward.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-red-700">Avoid</p>
            <ul className="mt-1 list-inside list-disc text-xs text-slate-700">
              {rge.healthyGrowth.avoid.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card border-indigo-200 bg-indigo-50">
        <h2 className="text-lg font-bold text-indigo-950">PRN Integration</h2>
        <p className="mt-1 text-sm text-indigo-900">{prn.motto}</p>
        <p className="mt-2 font-mono text-xs text-indigo-700">{rge.referralAttribution.hook}</p>
      </div>

      <div className="card border-rose-200 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">Phase 3 Progress</p>
        <p className="mt-1 text-sm text-rose-900">{doneSteps}/{peopleSystem.steps.length} steps complete</p>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-03/RELATIONSHIP_GROWTH_ENGINE.md · RGE-001 · NET-002 · NET-003
      </p>
    </div>
  );
}
