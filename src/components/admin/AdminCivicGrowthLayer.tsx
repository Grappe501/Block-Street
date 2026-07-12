"use client";

import cgiOs from "../../../data/civic-growth/civic-growth-operating-system.json";
import civ from "../../../data/registry/civic-participation.json";
import ldr from "../../../data/registry/leadership-development.json";
import rel from "../../../data/registry/community-relationship-intelligence.json";
import chd from "../../../data/registry/community-health.json";
import out from "../../../data/registry/civic-outcomes.json";
import intel from "../../../data/registry/strategic-intelligence.json";
import itl from "../../../data/registry/identity-trust-framework.json";
import { AdminIdentityTrustLayer } from "@/components/admin/AdminIdentityTrustLayer";
import { AdminCivicParticipation } from "@/components/admin/AdminCivicParticipation";
import { AdminLeadershipDevelopment } from "@/components/admin/AdminLeadershipDevelopment";
import { AdminCommunityRelationshipIntelligence } from "@/components/admin/AdminCommunityRelationshipIntelligence";
import { AdminCommunityHealth } from "@/components/admin/AdminCommunityHealth";
import { AdminCivicOutcomes } from "@/components/admin/AdminCivicOutcomes";
import { AdminStrategicIntelligence } from "@/components/admin/AdminStrategicIntelligence";

const PENDING_BUILDS = [
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
        <div className="card border-l-4 border-lime-500 bg-lime-100">
          <p className="text-xs font-semibold text-slate-800">10.1 Civic Participation Engine</p>
          <h3 className="mt-1 font-bold text-slate-950">{civ.productName}</h3>
          <p className="mt-2 font-mono text-xs text-slate-700">{civ.requirementId} · {civ.acceptanceCriteria}</p>
        </div>
        <div className="card border-l-4 border-amber-500 bg-amber-100">
          <p className="text-xs font-semibold text-slate-800">10.2 Leadership Development Engine</p>
          <h3 className="mt-1 font-bold text-slate-950">{ldr.productName}</h3>
          <p className="mt-2 font-mono text-xs text-slate-700">{ldr.requirementId} · {ldr.acceptanceCriteria}</p>
        </div>
        <div className="card border-l-4 border-violet-500 bg-violet-100">
          <p className="text-xs font-semibold text-slate-800">10.3 Community Relationship Intelligence</p>
          <h3 className="mt-1 font-bold text-slate-950">{rel.productName}</h3>
          <p className="mt-2 font-mono text-xs text-slate-700">{rel.requirementId} · {rel.acceptanceCriteria}</p>
        </div>
        <div className="card border-l-4 border-sky-500 bg-sky-100">
          <p className="text-xs font-semibold text-slate-800">10.4 Community Health & Civic Resilience</p>
          <h3 className="mt-1 font-bold text-slate-950">{chd.productName}</h3>
          <p className="mt-2 font-mono text-xs text-slate-700">{chd.requirementId} · {chd.acceptanceCriteria}</p>
        </div>
        <div className="card border-l-4 border-rose-500 bg-rose-100">
          <p className="text-xs font-semibold text-slate-800">10.5 Civic Outcomes & Impact</p>
          <h3 className="mt-1 font-bold text-slate-950">{out.productName}</h3>
          <p className="mt-2 font-mono text-xs text-slate-700">{out.requirementId} · {out.acceptanceCriteria}</p>
        </div>
        <div className="card border-l-4 border-indigo-600 bg-indigo-100 ring-2 ring-emerald-400">
          <p className="text-xs font-semibold text-slate-800">10.6A Identity Trust Layer</p>
          <h3 className="mt-1 font-bold text-slate-950">{itl.productName}</h3>
          <p className="mt-2 font-mono text-xs text-slate-700">{itl.requirementId} · {itl.acceptanceCriteria}</p>
        </div>
        <div className="card border-l-4 border-indigo-500 bg-indigo-50">
          <p className="text-xs font-semibold text-slate-800">10.6 Strategic Intelligence</p>
          <h3 className="mt-1 font-bold text-slate-950">{intel.productName}</h3>
          <p className="mt-2 font-mono text-xs text-slate-700">{intel.requirementId} · {intel.acceptanceCriteria}</p>
        </div>
        {PENDING_BUILDS.map((b) => (
          <div key={b.id} className="card border-l-4 border-slate-300 bg-slate-50">
            <p className="text-xs font-semibold text-slate-800">{b.id} {b.label}</p>
            <p className="mt-2 font-mono text-xs text-slate-600">{b.req} · {b.ac} · pending</p>
          </div>
        ))}
      </div>

      <AdminIdentityTrustLayer />
      <AdminStrategicIntelligence />
      <AdminCivicOutcomes />
      <AdminCommunityHealth />
      <AdminCommunityRelationshipIntelligence />
      <AdminLeadershipDevelopment />
      <AdminCivicParticipation />
    </div>
  );
}
