"use client";

import psos from "../../../data/platform-services/platform-services-operating-system.json";
import auth from "../../../data/registry/authentication-identity.json";
import admin from "../../../data/registry/administration-platform.json";
import cms from "../../../data/registry/content-services.json";
import ntf from "../../../data/registry/notification-services.json";
import api from "../../../data/registry/unified-api-layer.json";
import { AdminAuthenticationIdentity } from "@/components/admin/AdminAuthenticationIdentity";
import { AdminAdministrationPlatform } from "@/components/admin/AdminAdministrationPlatform";
import { AdminContentServices } from "@/components/admin/AdminContentServices";
import { AdminNotificationServices } from "@/components/admin/AdminNotificationServices";
import { AdminUnifiedApiLayer } from "@/components/admin/AdminUnifiedApiLayer";

const STEPS = [
  { step: auth, label: "8.1 Authentication & Identity", accent: "border-blue-300 bg-blue-50", featured: false },
  { step: admin, label: "8.2 Administration Platform", accent: "border-slate-300 bg-slate-50", featured: false },
  { step: cms, label: "8.3 CMS & Content", accent: "border-emerald-300 bg-emerald-50", featured: false },
  { step: ntf, label: "8.4 Notifications", accent: "border-violet-300 bg-violet-50", featured: false },
  { step: api, label: "8.5 Unified API", accent: "border-sky-400 bg-sky-100", featured: true },
  { id: "8.6", label: "8.6 Deployment", accent: "border-slate-300 bg-slate-50", name: "Deployment & CI/CD", requirementId: "DEP-001", acceptanceCriteria: "pending" },
  { id: "8.7", label: "8.7 Monitoring", accent: "border-slate-300 bg-slate-50", name: "Monitoring", requirementId: "MON-001", acceptanceCriteria: "pending" },
  { id: "8.8", label: "8.8 Security", accent: "border-slate-300 bg-slate-50", name: "Security Platform", requirementId: "SEC-001", acceptanceCriteria: "pending" },
];

export function AdminPlatformServicesLayer() {
  return (
    <div className="space-y-6">
      <div className="card border-slate-400 bg-slate-100">
        <p className="text-xs font-semibold uppercase text-slate-900">PHASE-008 · Platform Services</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{psos.productName}</h2>
        <p className="mt-2 text-sm text-slate-900">{psos.mission}</p>
        <p className="mt-2 text-xs font-semibold text-slate-800">
          {psos.requirementId} · {psos.stepsComplete}/{psos.stepsTotal} steps · {psos.phaseQuestion}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {STEPS.map((item) => (
          <div
            key={item.label}
            className={`card border-l-4 ${item.accent} ${"featured" in item && item.featured ? "ring-2 ring-slate-400" : ""}`}
          >
            <p className="text-xs font-semibold text-slate-800">{item.label}</p>
            <h3 className="mt-1 font-bold text-slate-950">
              {"step" in item && item.step ? item.step.productName : item.name}
            </h3>
            <p className="mt-2 font-mono text-xs text-slate-700">
              {"step" in item && item.step
                ? `${item.step.requirementId} · ${item.step.acceptanceCriteria}`
                : `${item.requirementId} · ${item.acceptanceCriteria}`}
            </p>
          </div>
        ))}
      </div>

      <AdminUnifiedApiLayer />
      <AdminNotificationServices />
      <AdminContentServices />
      <AdminAdministrationPlatform />
      <AdminAuthenticationIdentity />
    </div>
  );
}
