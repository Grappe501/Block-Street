"use client";

import twin from "../../../data/registry/digital-twin-init.json";

export function AdminDigitalTwinInit() {
  const { bootstrapStatus, validationChecks, adoptionExamples } = twin;

  return (
    <div className="space-y-6">
      <div className="card border-teal-300 bg-teal-50">
        <p className="text-xs font-semibold uppercase text-teal-800">PHASE-002.9 · Digital Twin Initialization</p>
        <h2 className="mt-1 text-xl font-bold text-teal-950">Arkansas Already Built</h2>
        <p className="mt-2 text-sm font-medium text-teal-900">{twin.motto}</p>
        <p className="mt-1 text-sm text-teal-800">{twin.principle}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Bootstrap Status</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold text-slate-900">Counties</p>
            <p className="text-2xl font-bold text-brand-600">
              {bootstrapStatus.counties.current}/{bootstrapStatus.counties.target}
            </p>
            <p className="text-xs text-slate-500">{bootstrapStatus.counties.schemaLevel} schema</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold text-slate-900">Institutions</p>
            <p className="text-2xl font-bold text-brand-600">
              {bootstrapStatus.institutions.current} → V1 full set
            </p>
            <p className="text-xs text-slate-500">{bootstrapStatus.institutions.schemaLevel} schema</p>
          </div>
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">V1 Initialization Package [ADT-M03]</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-brand-900">
          {twin.initializationPackage.v1.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-semibold uppercase text-brand-700">Excludes (created by participation)</p>
        <p className="text-xs text-brand-800">{twin.initializationPackage.excludes.join(" · ")}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Adoption Story [ADT-M01]</h2>
        <div className="mt-3 space-y-2">
          {adoptionExamples.map((ex) => (
            <div key={ex.participant} className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-medium text-slate-900">{ex.participant}</p>
              <p className="text-slate-600">{ex.finds}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Validation Checks [ADT-M11]</h2>
        <div className="mt-2 space-y-1">
          {validationChecks.map((check) => (
            <div key={check.id} className="flex items-center justify-between text-xs">
              <span className="text-slate-700">{check.rule}</span>
              <span className={`badge ${check.blocking ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"}`}>
                {check.blocking ? "blocking" : "advisory"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Relationship Init [ADT-M07]</h2>
        <div className="mt-2 space-y-1 font-mono text-xs text-slate-600">
          {twin.relationshipInit.map((rel) => {
            const source = "source" in rel && rel.source ? rel.source : rel.sourceType ?? "";
            const dest =
              "destination" in rel && typeof rel.destination === "string"
                ? rel.destination
                : rel.destinationType ?? "";
            const countSuffix = "count" in rel && rel.count ? ` (${rel.count})` : "";
            return (
              <p key={rel.type}>
                {source} —{rel.type}→ {dest}
                {countSuffix}
              </p>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Full spec: docs/phase-02/ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md · ADT-001
      </p>
    </div>
  );
}
