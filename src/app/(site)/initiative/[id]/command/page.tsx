"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InitiativeCommandPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [missions, setMissions] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/civic-action/initiatives?id=${encodeURIComponent(id)}`).then((r) => r.json()).then((d) => setData(d.data ?? d));
    fetch(`/api/v1/civic-action/missions?initiative_id=${encodeURIComponent(id)}`).then((r) => r.json()).then((d) => setMissions(d.data ?? []));
  }, [id]);

  const initiative = data?.initiative as Record<string, unknown> | undefined;
  const pending = (data?.pending_decisions as Record<string, unknown>[]) ?? [];
  const adaptations = (data?.adaptations as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <Link href={`/initiative/${id}`} className="text-sm text-orange-700 underline">← Initiative HQ</Link>
      <h1 className="text-2xl font-bold text-slate-900">Initiative Command Center</h1>
      <p className="text-sm text-slate-600">{initiative ? String(initiative.name) : "—"}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded border p-4">
          <h2 className="font-bold">Mission board</h2>
          <ul className="mt-2 max-h-64 space-y-2 overflow-auto">
            {missions.map((m) => (
              <li key={String(m.id)} className="rounded border p-2 text-sm">
                <p className="font-medium">{String(m.title)}</p>
                <p className="text-xs text-slate-500">{String(m.status)} · {String(m.assigned_human_id ?? "unassigned")}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded border p-4">
          <h2 className="font-bold">Pending decisions</h2>
          {pending.length === 0 ? <p className="mt-2 text-sm text-slate-500">No pending decisions.</p> : (
            <ul className="mt-2 space-y-2">
              {pending.map((d) => (
                <li key={String(d.id)} className="text-sm">
                  <p className="font-medium">{String(d.question)}</p>
                  <p className="text-xs text-slate-500">Due: {new Date(String(d.due_at)).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded border p-4 lg:col-span-2">
          <h2 className="font-bold">Adaptations</h2>
          <ul className="mt-2 space-y-2">
            {adaptations.map((a) => (
              <li key={String(a.id)} className="text-sm">
                <p><strong>{String(a.trigger)}</strong>: {String(a.approved_change ?? a.recommended_change)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Link href="/operations" className="text-sm text-orange-700 underline">Institution Operations Center</Link>
    </div>
  );
}
