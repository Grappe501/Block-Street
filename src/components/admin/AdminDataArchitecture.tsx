"use client";

import dab from "../../../data/registry/data-architecture-bible.json";
import ced from "../../../data/registry/canonical-entity-dictionary.json";
import mdd from "../../../data/registry/master-data-dictionary.json";
import dphil from "../../../data/registry/data-philosophy.json";

export function AdminDataArchitecture() {
  const doneSteps = dab.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-emerald-400 bg-emerald-100">
        <p className="text-xs font-semibold uppercase text-emerald-800">VOLUME 2 · Data Architecture Bible</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{dab.productName}</h2>
        <p className="mt-2 text-sm text-emerald-900">What is the data model that powers everything?</p>
        <p className="mt-2 text-xs font-semibold text-emerald-800">
          {doneSteps}/{dab.stepsTotal} steps · {dab.status.replace("_", " ")}
        </p>
      </div>

      <div className="card border-teal-300 bg-teal-50">
        <p className="text-xs font-semibold uppercase text-teal-800">VOLUME-002.1 · Data Philosophy</p>
        <h2 className="mt-1 text-lg font-bold text-teal-950">Canonical Model Principles</h2>
        <p className="mt-1 text-xs text-teal-900">{dphil.guidingPrinciple}</p>
        <p className="mt-2 text-xs text-teal-700">SQL canonical · graph/search/AI derived · config vs data separation</p>
      </div>

      <div className="card border-cyan-300 bg-cyan-50">
        <p className="text-xs font-semibold uppercase text-cyan-800">VOLUME-002.2 · Entity Dictionary</p>
        <h2 className="mt-1 text-lg font-bold text-cyan-950">Canonical Entities</h2>
        <p className="mt-2 text-xs font-semibold text-cyan-800">{ced.entityCount} primary entities</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {ced.entities.slice(0, 8).map((e) => (
            <span key={e.id} className="badge bg-cyan-100 text-cyan-800">{e.name}</span>
          ))}
          <span className="badge bg-cyan-200 text-cyan-900">+{ced.entityCount - 8} more</span>
        </div>
      </div>

      <div className="card border-sky-300 bg-sky-50">
        <p className="text-xs font-semibold uppercase text-sky-800">VOLUME-002.4 · Schema Blueprint</p>
        <h2 className="mt-1 text-lg font-bold text-sky-950">Postgres Domains</h2>
        <p className="mt-2 text-xs font-semibold text-sky-800">
          {dab.schemaDomains.length} schemas · {mdd.tableCount}+ tables
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {dab.schemaDomains.map((s) => (
            <span key={s} className="badge bg-sky-100 text-sky-800 font-mono text-xs">{s}</span>
          ))}
        </div>
      </div>

      <div className="card border-indigo-300 bg-indigo-50">
        <p className="text-xs font-semibold uppercase text-indigo-800">VOLUME-002.14 · Master Data Dictionary</p>
        <h2 className="mt-1 text-lg font-bold text-indigo-950">Governance & Registry</h2>
        <p className="mt-2 text-xs text-indigo-800">
          {mdd.coreEnumCount} core enums · migration governance · stewardship rules
        </p>
        <p className="mt-1 text-xs text-indigo-700">Signature graphs: {dab.signatureGraphs.join(", ")}</p>
      </div>

      <div className="card border-slate-300 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-900">Volume 2 Step Sequence</h3>
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          {dab.steps.map((step) => (
            <li key={step.id} className="flex justify-between gap-2">
              <span>{step.id} {step.name}</span>
              <span className={step.status === "done" ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                {step.status === "done" ? "✓" : "pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
