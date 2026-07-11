"use client";

import { useEffect, useState } from "react";
import mon from "../../../data/registry/monitoring-platform.json";
import type { MonitoringOverview } from "@/lib/monitoring/types";

type Tab = "overview" | "dashboards" | "alerts" | "intelligence" | "traces";

export function AdminMonitoringPlatform() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<MonitoringOverview | null>(null);
  const [dashboards, setDashboards] = useState<Record<string, unknown>[]>([]);
  const [alerts, setAlerts] = useState<Record<string, unknown>[]>([]);
  const [intelligence, setIntelligence] = useState<Record<string, unknown> | null>(null);
  const [traces, setTraces] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/admin/monitoring/overview").then((r) => r.json()).then((d) => setOverview(d.overview ?? null));
  }, []);

  useEffect(() => {
    if (tab === "dashboards") fetch("/api/admin/monitoring/dashboards").then((r) => r.json()).then((d) => setDashboards(d.dashboards ?? []));
    if (tab === "alerts") fetch("/api/admin/monitoring/alerts").then((r) => r.json()).then((d) => setAlerts(d.alerts ?? []));
    if (tab === "intelligence") fetch("/api/admin/monitoring/intelligence").then((r) => r.json()).then(setIntelligence);
    if (tab === "traces") fetch("/api/admin/monitoring/traces").then((r) => r.json()).then((d) => setTraces(d.traces ?? []));
  }, [tab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "dashboards", label: "Dashboards" },
    { id: "alerts", label: "Alerts" },
    { id: "intelligence", label: "Intelligence" },
    { id: "traces", label: "Traces" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-indigo-500 bg-indigo-100">
        <p className="text-xs font-semibold uppercase text-indigo-950">BUILD 8.7 · Monitoring & Observability</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{mon.productName}</h2>
        <p className="mt-2 text-sm text-indigo-950">{mon.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-indigo-900">{mon.requirementId} · {mon.acceptanceCriteria} · /api/v1/monitoring</p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-indigo-800 text-white" : "bg-indigo-50 text-indigo-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && overview && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Platform Health", `${overview.platform_health_score}% · ${overview.platform_state}`],
            ["Error Rate", `${overview.error_rate_percent}%`],
            ["P95 Latency", `${overview.p95_latency_ms} ms`],
            ["Active Alerts", overview.active_alerts],
            ["Critical Alerts", overview.critical_alerts],
            ["Open Incidents", overview.open_incidents],
            ["Services Healthy", `${overview.services_healthy}/${overview.services_total}`],
            ["Active Users", overview.active_users_today],
            ["Missions Today", overview.missions_completed_today],
            ["Deployment", overview.deployment_version],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-indigo-200 bg-white p-3 text-xs">
              <p className="text-indigo-700">{label}</p>
              <p className="text-lg font-bold text-indigo-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "dashboards" && (
        <div className="grid gap-4 md:grid-cols-2">
          {dashboards.map((d) => (
            <div key={String(d.id)} className="card border-indigo-200 bg-white p-4 text-xs text-indigo-900">
              <p className="font-bold">{String(d.name)}</p>
              <p className="text-indigo-600">{String(d.audience)}</p>
              <ul className="mt-2 space-y-1">
                {(d.widgets as { label: string; value: string | number; status?: string }[])?.map((w) => (
                  <li key={w.label} className="flex justify-between rounded bg-indigo-50 px-2 py-1">
                    <span>{w.label}</span>
                    <span className="font-semibold">{w.value}{w.status ? ` · ${w.status}` : ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === "alerts" && (
        <ul className="space-y-2 text-xs text-indigo-900">
          {alerts.map((a) => (
            <li key={String(a.id)} className={`card p-3 ${a.severity === "critical" ? "border-red-300 bg-red-50" : a.severity === "warning" ? "border-amber-300 bg-amber-50" : "border-indigo-200 bg-white"}`}>
              <p className="font-semibold">{String(a.type)} · {String(a.severity)} · {String(a.status)}</p>
              <p>{String(a.service)} · {String(a.recommended_action)}</p>
              {a.incident_id ? <p className="mt-1 text-red-800">Incident: {String(a.incident_id)}</p> : null}
            </li>
          ))}
        </ul>
      )}

      {tab === "intelligence" && intelligence && (
        <div className="space-y-4 text-xs text-indigo-900">
          <div className="card border-indigo-200 bg-white p-4">
            <h3 className="font-bold">Business Metrics</h3>
            <ul className="mt-2 grid gap-2 md:grid-cols-2">
              {(intelligence.business_metrics as Record<string, unknown>[])?.map((m) => (
                <li key={String(m.id)} className="rounded bg-indigo-50 px-2 py-1">
                  {String(m.name)}: <strong>{String(m.value)} {String(m.unit)}</strong> ({String(m.trend)})
                </li>
              ))}
            </ul>
          </div>
          <div className="card border-violet-300 bg-violet-50 p-4">
            <h3 className="font-bold text-violet-950">Self-Diagnosis Recommendations</h3>
            <ul className="mt-2 space-y-2">
              {(intelligence.recommendations as Record<string, unknown>[])?.length ? (
                (intelligence.recommendations as Record<string, unknown>[]).map((r) => (
                  <li key={String(r.id)}>
                    <p className="font-semibold">{String(r.title)}</p>
                    <p>{String(r.summary)}</p>
                    <p className="mt-1 text-violet-800">→ {String(r.recommended_action)}</p>
                  </li>
                ))
              ) : (
                <li className="text-violet-700">No active recommendations — platform operating normally.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {tab === "traces" && (
        <ul className="space-y-1 font-mono text-xs text-indigo-900">
          {traces.map((t) => (
            <li key={String(t.span_id)} className="card border-indigo-200 bg-white px-2 py-1">
              {String(t.correlation_id)} · {String(t.service)}.{String(t.operation)} · {String(t.duration_ms)}ms · {String(t.status)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
