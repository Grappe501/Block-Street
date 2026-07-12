"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InitiativePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/civic-action/initiatives?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => setData(d.data ?? d));
  }, [id]);

  const initiative = data?.initiative as Record<string, unknown> | undefined;
  const objectives = (data?.objectives as Record<string, unknown>[]) ?? [];
  const workstreams = (data?.workstreams as Record<string, unknown>[]) ?? [];
  const stats = data?.mission_stats as Record<string, number> | undefined;

  if (!initiative) {
    return <div className="p-6">Loading initiative…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/operations" className="text-sm text-orange-700 underline">← Operations Center</Link>
      <h1 className="text-2xl font-bold text-slate-900">{String(initiative.name)}</h1>
      <p className="text-sm text-slate-600">{String(initiative.purpose)}</p>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded border p-3"><p className="text-xs text-slate-500">Status</p><p className="font-bold">{String(initiative.status)}</p></div>
        <div className="rounded border p-3"><p className="text-xs text-slate-500">Owner</p><p className="font-bold">{String(initiative.operational_owner_human_id)}</p></div>
        <div className="rounded border p-3"><p className="text-xs text-slate-500">Missions</p><p className="font-bold">{stats?.completed ?? 0}/{stats?.total ?? 0} done</p></div>
        <div className="rounded border p-3"><p className="text-xs text-slate-500">Blocked</p><p className="font-bold text-red-700">{stats?.blocked ?? 0}</p></div>
      </div>

      <section>
        <h2 className="font-bold">Strategic objectives</h2>
        {objectives.map((o) => (
          <div key={String(o.id)} className="mt-2 rounded border p-3 text-sm">
            <p className="font-medium">{String(o.title)}</p>
            <p>Baseline: {String(o.baseline)} → Target: {String(o.target)} · Current: <strong>{String(o.current_value)}</strong></p>
            <p className="text-xs text-slate-500">Class: {String(o.metric_class)} · {String(o.status)}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-bold">Workstreams</h2>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {workstreams.map((w) => (
            <li key={String(w.id)} className="rounded border p-3 text-sm">
              <p className="font-medium">{String(w.name)}</p>
              <p className="text-xs text-slate-600">Owner: {String(w.owner_human_id)}</p>
            </li>
          ))}
        </ul>
      </section>

      <Link href={`/initiative/${id}/command`} className="inline-block rounded bg-orange-700 px-4 py-2 text-sm text-white">
        Open Initiative Command Center
      </Link>
    </div>
  );
}
