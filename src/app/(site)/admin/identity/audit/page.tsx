"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DemoRecordBanner, ModeBadge } from "@/components/identity/ModeBadge";
import { LockedFeature } from "@/components/identity/ModeBadge";

type LineageStep = { step: number; event: string; actor: string; at: string };

export default function IdentityAuditPage() {
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [integrity, setIntegrity] = useState<Record<string, unknown> | null>(null);
  const [lineage, setLineage] = useState<LineageStep[]>([]);
  const [humanId, setHumanId] = useState("");
  const [tab, setTab] = useState<"search" | "demo">("demo");

  const search = () => {
    const q = humanId ? `?human_id=${encodeURIComponent(humanId)}` : "";
    fetch(`/api/v1/identity-audit/events${q}`).then((r) => r.json()).then((d) => setEvents(d.data ?? []));
  };

  const checkIntegrity = () => {
    fetch("/api/v1/identity-audit/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "integrity_check" }),
    }).then((r) => r.json()).then((d) => setIntegrity(d.data ?? d));
  };

  useEffect(() => {
    fetch("/api/v1/july14/admin-overview")
      .then((r) => r.json())
      .then((d) => setLineage((d.data ?? d).audit_lineage_demo ?? []))
      .catch(() => undefined);
    search();
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/admin/identity" className="text-sm text-indigo-700 underline">← Identity overview</Link>
      <h1 className="text-2xl font-bold text-slate-900">Identity Audit Explorer</h1>
      <p className="text-sm text-slate-600">Complete attributable lineage — every consequential identity action.</p>

      <div className="flex gap-2 text-sm">
        <button type="button" onClick={() => setTab("demo")} className={`rounded px-3 py-1 ${tab === "demo" ? "bg-indigo-700 text-white" : "border"}`}>
          Demonstration lineage
        </button>
        <button type="button" onClick={() => setTab("search")} className={`rounded px-3 py-1 ${tab === "search" ? "bg-indigo-700 text-white" : "border"}`}>
          Search events
        </button>
      </div>

      {tab === "demo" && (
        <div className="space-y-3">
          <DemoRecordBanner>Meeting demonstration — not a production Human record</DemoRecordBanner>
          <ol className="space-y-2 border-l-2 border-indigo-300 pl-4">
            {lineage.map((step) => (
              <li key={step.step} className="text-sm">
                <p className="font-medium">{step.step}. {step.event}</p>
                <p className="text-xs text-slate-600">Actor: {step.actor} · {new Date(step.at).toLocaleString()}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {tab === "search" && (
        <>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Global Human / user ID"
              className="rounded border px-3 py-1.5 text-sm"
              value={humanId}
              onChange={(e) => setHumanId(e.target.value)}
              aria-label="Search by human ID"
            />
            <button type="button" onClick={search} className="rounded bg-indigo-700 px-3 py-1.5 text-sm text-white">Search</button>
            <button type="button" onClick={checkIntegrity} className="rounded border px-3 py-1.5 text-sm">Ledger integrity check</button>
          </div>

          {integrity && (
            <p className="text-sm text-emerald-800" role="status">
              Ledger: {integrity.healthy ? "healthy" : "degraded"} · {String((integrity.ledger_integrity as { checked?: number })?.checked ?? 0)} events checked
            </p>
          )}

          <ul className="max-h-96 space-y-2 overflow-auto">
            {events.map((e) => (
              <li key={String(e.id)} className="rounded border p-2 text-xs">
                <span className="font-medium">{String(e.event_type)}</span>
                <span className="text-slate-500"> · {String(e.timestamp)}</span>
                <p className="text-slate-600">{String(e.summary)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

