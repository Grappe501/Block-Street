"use client";

import cgiOs from "../../../data/civic-growth/civic-growth-operating-system.json";
import civ from "../../../data/registry/civic-participation.json";
import { AdminCivicParticipation } from "@/components/admin/AdminCivicParticipation";

const PENDING_BUILDS = [
  { id: "10.2", label: "Leadership Development", req: "LDR-001", ac: "AC-195" },
  { id: "10.3", label: "Community Relationship Graph", req: "REL-001", ac: "AC-196" },
  { id: "10.4", label: "Community Health Dashboard", req: "CHD-001", ac: "AC-197" },
  { id: "10.5", label: "Civic Outcomes Engine", req: "OUT-001", ac: "AC-198" },
  { id: "10.6", label: "Strategic Intelligence", req: "INT-002", ac: "AC-199" },
  { id: "10.7", label: "Research & Policy Lab", req: "RPL-001", ac: "AC-200" },
  { id: "10.8", label: "Civic Impact Analytics", req: "CIA-001", ac: "AC-201" },
];

export function AdminCivicGrowthLayer() {
  return (
    <div className="space-y-6">
      <div className="card border-emerald-400 bg-emerald-50">
        <p className="text-xs font-semibold uppercase text-emerald-950">PHASE-010 · Civic Intelligence</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{cgiOs.productName}</h2>
        <p className="mt-2 text-sm text-emerald-950">{cgiOs.mission}</p>
        <p className="mt-2 text-xs font-semibold text-emerald-900">
          {cgiOs.requirementId} · {cgiOs.stepsComplete}/{cgiOs.stepsTotal} steps · {cgiOs.phaseQuestion}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card border-l-4 border-lime-500 bg-lime-100 ring-2 ring-emerald-400">
          <p className="text-xs font-semibold text-slate-800">10.1 Civic Participation Engine</p>
          <h3 className="mt-1 font-bold text-slate-950">{civ.productName}</h3>
          <p className="mt-2 font-mono text-xs text-slate-700">
            {civ.requirementId} · {civ.acceptanceCriteria}
          </p>
        </div>
        {PENDING_BUILDS.map((b) => (
          <div key={b.id} className="card border-l-4 border-slate-300 bg-slate-50">
            <p className="text-xs font-semibold text-slate-800">
              {b.id} {b.label}
            </p>
            <p className="mt-2 font-mono text-xs text-slate-600">
              {b.req} · {b.ac} · pending
            </p>
          </div>
        ))}
      </div>

      <AdminCivicParticipation />
    </div>
  );
}
