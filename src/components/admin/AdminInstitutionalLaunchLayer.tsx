"use client";

import ilsOs from "../../../data/institutional-launch/institutional-launch-operating-system.json";
import ils from "../../../data/registry/institutional-launch.json";
import prv from "../../../data/registry/institutional-provisioning.json";
import org from "../../../data/registry/organizational-modeling.json";
import { AdminInstitutionalProvisioning } from "@/components/admin/AdminInstitutionalProvisioning";
import { AdminInstitutionalOrganization } from "@/components/admin/AdminInstitutionalOrganization";

const STEPS: Array<
  | { step: { productName: string; requirementId: string; acceptanceCriteria: string }; label: string; accent: string; featured: boolean }
  | { label: string; accent: string; featured: boolean; pending: string }
> = [
  { step: prv, label: "9.1 Institutional Provisioning", accent: "border-amber-500 bg-amber-100", featured: false },
  { step: org, label: "9.2 Configuration & Org Modeling", accent: "border-indigo-500 bg-indigo-100", featured: true },
  { label: "9.3 Migration & Data Readiness", accent: "border-slate-300 bg-slate-50", featured: false, pending: "MIG-001" },
  { label: "9.4 Guided Onboarding", accent: "border-slate-300 bg-slate-50", featured: false, pending: "ONB-001" },
  { label: "9.5 Training & Certification", accent: "border-slate-300 bg-slate-50", featured: false, pending: "TRN-001" },
  { label: "9.6 Pilot & Acceptance", accent: "border-slate-300 bg-slate-50", featured: false, pending: "PLT-001" },
  { label: "9.7 Support & Success", accent: "border-slate-300 bg-slate-50", featured: false, pending: "SUP-001" },
  { label: "9.8 Adoption & Scale", accent: "border-slate-300 bg-slate-50", featured: false, pending: "SCL-001" },
];

export function AdminInstitutionalLaunchLayer() {
  return (
    <div className="space-y-6">
      <div className="card border-amber-400 bg-amber-50">
        <p className="text-xs font-semibold uppercase text-amber-950">PHASE-009 · Institutional Launch</p>
        <h2 className="mt-1 text-xl font-bold text-amber-950">{ilsOs.productName}</h2>
        <p className="mt-2 text-sm text-amber-950">{ilsOs.mission}</p>
        <p className="mt-2 text-xs font-semibold text-amber-900">
          {ilsOs.requirementId} · {ilsOs.stepsComplete}/{ilsOs.stepsTotal} steps · {ilsOs.phaseQuestion}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {STEPS.map((item) => (
          <div
            key={item.label}
            className={`card border-l-4 ${item.accent} ${item.featured ? "ring-2 ring-amber-400" : ""}`}
          >
            <p className="text-xs font-semibold text-slate-800">{item.label}</p>
            {"step" in item ? (
              <>
                <h3 className="mt-1 font-bold text-slate-950">{item.step.productName}</h3>
                <p className="mt-2 font-mono text-xs text-slate-700">
                  {item.step.requirementId} · {item.step.acceptanceCriteria}
                </p>
              </>
            ) : (
              <p className="mt-2 font-mono text-xs text-slate-600">{item.pending} · pending</p>
            )}
          </div>
        ))}
      </div>

      <AdminInstitutionalOrganization />
      <AdminInstitutionalProvisioning />
    </div>
  );
}
