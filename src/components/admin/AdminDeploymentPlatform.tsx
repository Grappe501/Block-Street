"use client";

import { useEffect, useState } from "react";
import dpl from "../../../data/registry/deployment-platform.json";
import type { DeploymentOverview } from "@/lib/deployment/types";

type Tab = "overview" | "releases" | "environments" | "migrations" | "audit";

export function AdminDeploymentPlatform() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<DeploymentOverview | null>(null);
  const [releases, setReleases] = useState<Record<string, unknown> | null>(null);
  const [environments, setEnvironments] = useState<{ environments: Record<string, unknown>[]; drift: Record<string, unknown>[] } | null>(null);
  const [migrations, setMigrations] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/admin/deployments/overview").then((r) => r.json()).then((d) => setOverview(d.overview ?? null));
  }, []);

  useEffect(() => {
    if (tab === "releases") fetch("/api/admin/deployments/releases").then((r) => r.json()).then(setReleases);
    if (tab === "environments") fetch("/api/admin/deployments/environments").then((r) => r.json()).then(setEnvironments);
    if (tab === "migrations") fetch("/api/admin/deployments/migrations").then((r) => r.json()).then((d) => setMigrations(d.migrations ?? []));
    if (tab === "audit") fetch("/api/admin/deployments/audit").then((r) => r.json()).then((d) => setAudit(d.audit ?? []));
  }, [tab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "releases", label: "Releases" },
    { id: "environments", label: "Environments" },
    { id: "migrations", label: "Migrations" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-slate-500 bg-slate-200">
        <p className="text-xs font-semibold uppercase text-slate-950">BUILD 8.6 · Deployment & CI/CD</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{dpl.productName}</h2>
        <p className="mt-2 text-sm text-slate-950">{dpl.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-slate-900">
          {dpl.requirementId} · {dpl.acceptanceCriteria} · {dpl.v1Hosting.deployUrl}
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && overview && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Production version", overview.production_version],
            ["Last deployment", overview.last_deployment_status],
            ["Pending candidates", overview.pending_release_candidates],
            ["Preview environments", overview.preview_environments],
            ["Staging status", overview.staging_status],
            ["Failed this week", overview.failed_deployments_this_week],
            ["Pending migrations", overview.pending_migrations],
            ["Config drift", overview.configuration_drift_warnings],
            ["Rollback readiness", overview.rollback_readiness],
            ["Success rate", `${overview.success_rate}%`],
            ["Change failure rate", `${overview.change_failure_rate}%`],
            ["Avg build time", `${overview.average_build_time_minutes} min`],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-slate-300 bg-white p-3 text-xs">
              <p className="text-slate-600">{label}</p>
              <p className="text-lg font-bold text-slate-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "releases" && releases && (
        <div className="space-y-4 text-xs text-slate-900">
          <div className="card border-slate-300 bg-white p-4">
            <h3 className="font-bold">Release Candidates</h3>
            <ul className="mt-2 space-y-2">
              {(releases.candidates as Record<string, unknown>[])?.map((c) => (
                <li key={String(c.id)} className="rounded bg-slate-50 px-2 py-2">
                  <p className="font-semibold">{String(c.version)} · {String(c.risk_level)}</p>
                  <p>{String(c.commit_sha)} · {String(c.status)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card border-slate-300 bg-white p-4">
            <h3 className="font-bold">Production Manifests</h3>
            <ul className="mt-2 space-y-2">
              {(releases.manifests as Record<string, unknown>[])?.map((m) => (
                <li key={String(m.id)} className="rounded bg-slate-50 px-2 py-2">
                  <p className="font-semibold">{String(m.release_version)} · {String(m.status)}</p>
                  <p>{String(m.change_summary)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "environments" && environments && (
        <div className="space-y-4 text-xs text-slate-900">
          <ul className="space-y-2">
            {environments.environments.map((e) => (
              <li key={String(e.id)} className="card border-slate-300 bg-white p-3">
                <p className="font-semibold capitalize">{String(e.name)} · {String(e.status)}</p>
                {e.url ? <p className="text-slate-600">{String(e.url)}</p> : null}
                {e.banner ? <p className="mt-1 text-amber-800">{String(e.banner)}</p> : null}
                {e.release_version ? <p className="mt-1">v{String(e.release_version)} · {String(e.commit_sha)}</p> : null}
              </li>
            ))}
          </ul>
          {environments.drift.length > 0 && (
            <div className="card border-amber-300 bg-amber-50 p-4">
              <h3 className="font-bold text-amber-950">Configuration Drift</h3>
              <ul className="mt-2 space-y-1">
                {environments.drift.map((d) => (
                  <li key={String(d.id)}>{String(d.variable)}: documented {String(d.documented)} · actual {String(d.actual)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === "migrations" && (
        <ul className="space-y-2 text-xs text-slate-900">
          {migrations.map((m) => (
            <li key={String(m.id)} className="card border-slate-300 bg-white p-3">
              <p className="font-semibold">{String(m.migration_key)} · {String(m.risk_level)}</p>
              <p>{String(m.description)} · {String(m.status)}</p>
            </li>
          ))}
        </ul>
      )}

      {tab === "audit" && (
        <ul className="space-y-2 text-xs text-slate-900">
          {audit.map((a) => (
            <li key={String(a.id)} className="card border-slate-300 bg-white p-3">
              <p className="font-semibold">{String(a.action)} · {String(a.result)}</p>
              <p>{String(a.environment)} · {String(a.timestamp)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
