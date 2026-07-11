"use client";

import { useEffect, useState } from "react";
import api from "../../../data/registry/unified-api-layer.json";
import type { ApiOverview } from "@/lib/api/types";

type Tab = "overview" | "clients" | "credentials" | "webhooks" | "deprecations" | "telemetry" | "ai-tools";

export function AdminUnifiedApiLayer() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<ApiOverview | null>(null);
  const [clients, setClients] = useState<Record<string, unknown>[]>([]);
  const [credentials, setCredentials] = useState<Record<string, unknown>[]>([]);
  const [webhooks, setWebhooks] = useState<{ subscriptions: Record<string, unknown>[]; deliveries: Record<string, unknown>[] } | null>(null);
  const [deprecations, setDeprecations] = useState<Record<string, unknown>[]>([]);
  const [telemetry, setTelemetry] = useState<Record<string, unknown> | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [aiTools, setAiTools] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/admin/api/overview").then((r) => r.json()).then((d) => setOverview(d.overview ?? null));
  }, []);

  useEffect(() => {
    if (tab === "clients") fetch("/api/admin/api/clients").then((r) => r.json()).then((d) => setClients(d.clients ?? []));
    if (tab === "credentials") fetch("/api/admin/api/credentials").then((r) => r.json()).then((d) => setCredentials(d.credentials ?? []));
    if (tab === "webhooks") fetch("/api/admin/api/webhooks").then((r) => r.json()).then((d) => setWebhooks(d));
    if (tab === "deprecations") fetch("/api/admin/api/deprecations").then((r) => r.json()).then((d) => setDeprecations(d.deprecations ?? []));
    if (tab === "telemetry") fetch("/api/admin/api/telemetry").then((r) => r.json()).then((d) => { setTelemetry(d.telemetry ?? null); setAudit(d.recent_audit ?? []); });
    if (tab === "ai-tools") fetch("/api/admin/api/ai-tools").then((r) => r.json()).then((d) => setAiTools(d.tools ?? []));
  }, [tab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "clients", label: "API Clients" },
    { id: "credentials", label: "Credentials" },
    { id: "webhooks", label: "Webhooks" },
    { id: "deprecations", label: "Deprecations" },
    { id: "telemetry", label: "Telemetry" },
    { id: "ai-tools", label: "AI Tools" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-sky-500 bg-sky-100">
        <p className="text-xs font-semibold uppercase text-sky-950">BUILD 8.5 · Unified API Layer</p>
        <h2 className="mt-1 text-xl font-bold text-sky-950">{api.productName}</h2>
        <p className="mt-2 text-sm text-sky-950">{api.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-sky-900">{api.requirementId} · {api.acceptanceCriteria} · /api/v1</p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-sky-800 text-white" : "bg-sky-50 text-sky-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && overview && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Requests today", overview.requests_today.toLocaleString()],
            ["Success rate", `${overview.success_rate}%`],
            ["P95 latency", `${overview.p95_latency_ms} ms`],
            ["Auth failures", overview.authentication_failures],
            ["Permission denials", overview.permission_denials],
            ["Rate limited", overview.rate_limited_requests],
            ["Active clients", overview.active_clients],
            ["Active webhooks", overview.active_webhooks],
            ["Status", overview.critical_endpoint_status],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-sky-200 bg-white p-3 text-xs">
              <p className="text-sky-700">{label}</p>
              <p className="text-lg font-bold text-sky-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "clients" && (
        <ul className="space-y-2 text-xs text-sky-900">
          {clients.map((c) => (
            <li key={String(c.id)} className="card border-sky-200 bg-white p-3">
              <p className="font-semibold">{String(c.name)}</p>
              <p>{String(c.client_type)} · {String(c.environment)} · {String(c.status)}</p>
              <p className="mt-1 text-sky-700">Scopes: {(c.allowed_scopes as string[])?.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}

      {tab === "credentials" && (
        <ul className="space-y-2 text-xs text-sky-900">
          {credentials.map((c) => (
            <li key={String(c.id)} className="card border-sky-200 bg-white p-3">{String(c.prefix)}··· · {String(c.status)} · {String(c.credential_type)}</li>
          ))}
        </ul>
      )}

      {tab === "webhooks" && webhooks && (
        <div className="space-y-4 text-xs text-sky-900">
          <div className="card border-sky-200 bg-white p-4">
            <h3 className="font-bold">Subscriptions</h3>
            <ul className="mt-2 space-y-1">
              {webhooks.subscriptions.map((s) => (
                <li key={String(s.id)} className="rounded bg-sky-50 px-2 py-1">{String(s.target_url)} · {(s.event_types as string[])?.join(", ")}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "deprecations" && (
        <ul className="space-y-2 text-xs text-sky-900">
          {deprecations.map((d) => (
            <li key={String(d.id)} className="card border-amber-200 bg-amber-50 p-3">
              <p className="font-semibold">{String(d.method)} {String(d.endpoint)}</p>
              <p>→ {String(d.replacement_endpoint)} · sunset {String(d.sunset_at)}</p>
            </li>
          ))}
        </ul>
      )}

      {tab === "telemetry" && telemetry && (
        <div className="card border-sky-200 bg-white p-4 text-xs text-sky-900">
          <pre className="overflow-auto rounded bg-sky-50 p-2">{JSON.stringify(telemetry, null, 2)}</pre>
          <h3 className="mt-4 font-bold">Recent audit</h3>
          <ul className="mt-2 space-y-1 font-mono">
            {audit.map((e, i) => (
              <li key={i}>{String(e.timestamp)} · {String(e.endpoint)} · {String(e.result)}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "ai-tools" && (
        <ul className="space-y-2 text-xs text-sky-900">
          {aiTools.map((t) => (
            <li key={String(t.id)} className="card border-sky-200 bg-white p-3">
              <p className="font-semibold">{String(t.name)}</p>
              <p>{String(t.action_level)} · {String(t.required_permission)} · approval: {String(t.approval_required)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
