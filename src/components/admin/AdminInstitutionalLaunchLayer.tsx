"use client";

import ilsOs from "../../../data/institutional-launch/institutional-launch-operating-system.json";
import ils from "../../../data/registry/institutional-launch.json";
import prv from "../../../data/registry/institutional-provisioning.json";
import org from "../../../data/registry/organizational-modeling.json";
import mig from "../../../data/registry/data-migration.json";
import onb from "../../../data/registry/guided-onboarding.json";
import trn from "../../../data/registry/training-certification.json";
import plt from "../../../data/registry/pilot-acceptance.json";
import ops from "../../../data/registry/operational-operations.json";
import { AdminInstitutionalProvisioning } from "@/components/admin/AdminInstitutionalProvisioning";
import { AdminInstitutionalOrganization } from "@/components/admin/AdminInstitutionalOrganization";
import { AdminInstitutionalMigration } from "@/components/admin/AdminInstitutionalMigration";
import { AdminInstitutionalOnboarding } from "@/components/admin/AdminInstitutionalOnboarding";
import { AdminInstitutionalTraining } from "@/components/admin/AdminInstitutionalTraining";
import { AdminInstitutionalPilot } from "@/components/admin/AdminInstitutionalPilot";
import { AdminInstitutionalOperations } from "@/components/admin/AdminInstitutionalOperations";

const STEPS: Array<
  | { step: { productName: string; requirementId: string; acceptanceCriteria: string }; label: string; accent: string; featured: boolean }
  | { label: string; accent: string; featured: boolean; pending: string }
> = [
  { step: prv, label: "9.1 Institutional Provisioning", accent: "border-amber-500 bg-amber-100", featured: false },
  { step: org, label: "9.2 Configuration & Org Modeling", accent: "border-indigo-500 bg-indigo-100", featured: false },
  { step: mig, label: "9.3 Migration & Data Readiness", accent: "border-slate-500 bg-slate-100", featured: false },
  { step: onb, label: "9.4 Guided Onboarding", accent: "border-emerald-500 bg-emerald-100", featured: false },
  { step: trn, label: "9.5 Training & Certification", accent: "border-violet-500 bg-violet-100", featured: false },
  { step: plt, label: "9.6 Pilot & Acceptance", accent: "border-rose-500 bg-rose-100", featured: false },
  { step: ops, label: "9.7 Operational Launch", accent: "border-teal-500 bg-teal-100", featured: true },
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

      <AdminInstitutionalOperations />
      <AdminInstitutionalPilot />
      <AdminInstitutionalTraining />
      <AdminInstitutionalOnboarding />
      <AdminInstitutionalMigration />
      <AdminInstitutionalOrganization />
      <AdminInstitutionalProvisioning />
    </div>
  );
}
