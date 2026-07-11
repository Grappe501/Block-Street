"use client";

import { useEffect, useState } from "react";
import sec from "../../../data/registry/security-platform.json";
import type { SecurityPosture } from "@/lib/security/types";

type Tab = "overview" | "events" | "incidents" | "vulnerabilities" | "audit";

export function AdminSecurityPlatform() {
  const [tab, setTab] = useState<Tab>("overview");
  const [posture, setPosture] = useState<SecurityPosture | null>(null);
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [incidents, setIncidents] = useState<Record<string, unknown>[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/admin/security/overview").then((r) => r.json()).then((d) => {
      setPosture(d.posture ?? null);
      setOverview(d.overview ?? null);
    });
  }, []);

  useEffect(() => {
    if (tab === "events") fetch("/api/admin/security/events").then((r) => r.json()).then((d) => setEvents(d.events ?? []));
    if (tab === "incidents") fetch("/api/admin/security/incidents").then((r) => r.json()).then((d) => setIncidents(d.incidents ?? []));
    if (tab === "vulnerabilities") fetch("/api/admin/security/vulnerabilities").then((r) => r.json()).then((d) => setVulnerabilities(d.vulnerabilities ?? []));
    if (tab === "audit") fetch("/api/admin/security/audit").then((r) => r.json()).then((d) => setAudit(d.audit ?? []));
  }, [tab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Posture" },
    { id: "events", label: "Events" },
    { id: "incidents", label: "Incidents" },
    { id: "vulnerabilities", label: "Vulnerabilities" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-red-500 bg-red-100">
        <p className="text-xs font-semibold uppercase text-red-950">BUILD 8.8 · Security Platform · PHASE 8 COMPLETE</p>
        <h2 className="mt-1 text-xl font-bold text-red-950">{sec.productName}</h2>
        <p className="mt-2 text-sm text-red-950">{sec.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-red-900">{sec.requirementId} · {sec.acceptanceCriteria} · /api/v1/security</p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-red-800 text-white" : "bg-red-50 text-red-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && posture && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Posture Score", `${posture.posture_score}%`],
            ["Critical Incidents", posture.critical_incidents],
            ["High-Risk Alerts", posture.high_risk_alerts],
            ["Admins Without MFA", posture.admins_without_mfa],
            ["Open Vulnerabilities", posture.open_vulnerabilities],
            ["Critical Vulnerabilities", posture.critical_vulnerabilities],
            ["Unreviewed Exports", posture.unreviewed_exports],
            ["Access Reviews Due", posture.access_reviews_due],
            ["Backup Status", posture.backup_status],
            ["Last Restore Test", posture.last_restore_test],
            ["Break-Glass Events", posture.break_glass_events],
            ["Threat Models", Number(overview?.threat_models ?? 0)],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-red-200 bg-white p-3 text-xs">
              <p className="text-red-700">{label}</p>
              <p className="text-lg font-bold text-red-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "events" && (
        <ul className="space-y-2 text-xs text-red-900">
          {events.map((e) => (
            <li key={String(e.id)} className="card border-red-200 bg-white p-3">
              <p className="font-semibold">{String(e.event_type)} · {String(e.severity)}</p>
              <p>{String(e.source)} → {String(e.target ?? "—")} · {String(e.status)}</p>
            </li>
          ))}
        </ul>
      )}

      {tab === "incidents" && (
        <ul className="space-y-2 text-xs text-red-900">
          {incidents.length === 0 ? (
            <li className="card border-emerald-200 bg-emerald-50 p-3 text-emerald-900">No open security incidents.</li>
          ) : incidents.map((i) => (
            <li key={String(i.id)} className="card border-red-300 bg-red-50 p-3">
              <p className="font-semibold">{String(i.title)} · {String(i.severity)}</p>
              <p>{String(i.status)} · {String(i.detected_at)}</p>
            </li>
          ))}
        </ul>
      )}

      {tab === "vulnerabilities" && (
        <ul className="space-y-2 text-xs text-red-900">
          {vulnerabilities.map((v) => (
            <li key={String(v.id)} className="card border-amber-200 bg-amber-50 p-3">
              <p className="font-semibold">{String(v.component)} · {String(v.severity)}</p>
              <p>{String(v.description)} · {String(v.status)}</p>
            </li>
          ))}
        </ul>
      )}

      {tab === "audit" && (
        <ul className="space-y-1 font-mono text-xs text-red-900">
          {audit.map((a, i) => (
            <li key={i} className="card border-red-200 bg-white px-2 py-1">
              {String(a.action ?? a.timestamp)} · {String(a.result ?? "")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
