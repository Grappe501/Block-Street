"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function IdentityOpsPage() {
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [workItems, setWorkItems] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/v1/identity-ops/overview").then((r) => r.json()).then((d) => setOverview(d.data ?? d));
    fetch("/api/v1/identity-ops/work-items").then((r) => r.json()).then((d) => setWorkItems(d.data ?? []));
  }, []);

  const today = overview?.today as Record<string, number> | undefined;
  const queues = overview?.queues as Record<string, number> | undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Identity Operations Center</h1>
      <p className="text-sm text-slate-600">ITL-OPS-001 — unified operational view across identity queues.</p>

      {today && (
        <div className="grid gap-3 sm:grid-cols-3" role="region" aria-label="Today">
          <div className="rounded border p-3">
            <p className="text-xs text-slate-500">Critical alerts</p>
            <p className="text-xl font-bold">{today.critical_alerts}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-xs text-slate-500">Overdue work</p>
            <p className="text-xl font-bold">{today.overdue_work}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-xs text-slate-500">Ledger</p>
            <p className="text-sm font-semibold">{String(today.ledger_integrity)}</p>
          </div>
        </div>
      )}

      {queues && (
        <div className="rounded border p-4">
          <h2 className="font-semibold">Work queues</h2>
          <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            <li>Unassigned: {queues.unassigned}</li>
            <li>Assigned: {queues.assigned}</li>
            <li>Escalated: {queues.escalated}</li>
            <li>Waiting for Human: {queues.waiting_for_human}</li>
          </ul>
        </div>
      )}

      <div className="rounded border p-4">
        <h2 className="font-semibold">My work items</h2>
        <ul className="mt-2 space-y-2">
          {workItems.map((w) => (
            <li key={String(w.id)} className="rounded border border-slate-100 p-2 text-sm">
              <p className="font-medium">{String(w.summary)}</p>
              <p className="text-xs text-slate-500">
                {String(w.work_type)} · {String(w.status)}
                {w.advisory_signal ? " · ADVISORY" : ""}
              </p>
            </li>
          ))}
        </ul>
        {workItems.length === 0 && <p className="text-sm text-slate-500">No assigned work items.</p>}
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/ops/identity/certification" className="text-indigo-700 underline">Certification dashboard</Link>
        <Link href="/admin/identity/intelligence" className="text-indigo-700 underline">Intelligence review</Link>
        <Link href="/admin/identity/audit" className="text-indigo-700 underline">Audit explorer</Link>
        <Link href="/executive/identity" className="text-indigo-700 underline">Executive oversight</Link>
      </div>
    </div>
  );
}
