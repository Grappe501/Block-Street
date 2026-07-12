"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OperationsCenterPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [missions, setMissions] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/v1/civic-action/command-center").then((r) => r.json()).then((d) => setData(d.data ?? d));
    fetch("/api/v1/civic-action/missions").then((r) => r.json()).then((d) => setMissions(d.data ?? []));
  }, []);

  const cc = data?.command_center as Record<string, unknown> | undefined;
  const today = cc?.today as Record<string, number> | undefined;
  const atRisk = cc?.at_risk as Record<string, unknown> | undefined;
  const blocked = (atRisk?.blocked_missions as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operations Command Center</h1>
          <p className="text-sm text-slate-600">CAE-001 · OCC-001 — live operational view</p>
        </div>
        <Link href="/initiatives" className="rounded bg-orange-700 px-3 py-2 text-sm text-white">
          Youth Civic Initiative
        </Link>
      </div>

      <p className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-950">
        {String(data?.governing_principle ?? "Every action should have a clear purpose, an accountable Human, an authorized institution, a defined timeline, and a measurable result.")}
      </p>

      {today && (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6" role="region" aria-label="Today">
          {[
            ["Active initiatives", today.active_initiatives],
            ["Current missions", today.current_missions],
            ["Events today", today.events_today],
            ["Pending approvals", today.pending_approvals],
            ["Open incidents", today.open_incidents],
            ["Blocked missions", today.blocked_missions],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded border p-3">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {blocked.length > 0 && (
        <section className="rounded border border-red-200 bg-red-50 p-4">
          <h2 className="font-bold text-red-900">At risk — blocked missions</h2>
          <ul className="mt-2 space-y-2">
            {blocked.map((m) => (
              <li key={String(m.id)} className="text-sm">
                <strong>{String(m.title)}</strong>
                <span className="text-red-800"> — {String(m.blocker_reason)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-bold text-slate-900">Active missions</h2>
        <ul className="mt-2 space-y-2">
          {missions.filter((m) => m.status !== "completed").map((m) => (
            <li key={String(m.id)} className="flex flex-wrap items-center justify-between gap-2 rounded border p-3 text-sm">
              <div>
                <p className="font-medium">{String(m.title)}</p>
                <p className="text-xs text-slate-500">{String(m.location_scope)} · Owner: {String(m.owner_human_id)}</p>
              </div>
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${m.status === "blocked" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>
                {String(m.status)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/identity" className="text-orange-700 underline">Identity Home</Link>
        <Link href="/july-14" className="text-orange-700 underline">July 14 Meeting</Link>
        <Link href="/admin/identity" className="text-orange-700 underline">Identity Admin</Link>
      </div>
    </div>
  );
}
