"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const SURFACES = [
  { id: "participant", label: "View as participant", href: "/network" },
  { id: "college", label: "View as college leader", href: "/admin/college-command" },
  { id: "operator", label: "View as operator", href: "/admin?tab=command" },
  { id: "henderson", label: "Inspect Henderson State board", href: "/schools/henderson-state?inspect=director" },
  { id: "clark", label: "Inspect Clark County board", href: "/county/clark?inspect=director" },
  { id: "start", label: "Inspect invite start", href: "/start?inspect=director" },
] as const;

export function DirectorOmniview() {
  const [reason, setReason] = useState("product diagnostic");
  const stamp = useMemo(() => new Date().toISOString(), []);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b-4 border-amber-400 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Director · Omniview</p>
          <h1 className="mt-2 text-3xl font-bold">Safe system inspection</h1>
          <p className="mt-2 text-sm text-white/80">
            Read-only by default. Does not replace the inspected person’s session, preferences, or notifications.
            Opens labeled inspection surfaces.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Inspection mode: Director read-only</p>
          <p className="mt-1">Opened at {stamp}. Audit note: record sensitive board opens with a reason.</p>
          <label className="mt-3 block text-xs font-semibold">
            Reason
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SURFACES.map((s) => (
            <Link
              key={s.id}
              href={`${s.href}${s.href.includes("?") ? "&" : "?"}inspect=director&reason=${encodeURIComponent(reason)}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300"
            >
              <p className="font-semibold text-slate-950">{s.label}</p>
              <p className="mt-1 text-xs text-slate-600">{s.href}</p>
              <p className="mt-2 text-xs font-semibold text-brand-800">Open read-only →</p>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
          <h2 className="font-bold text-slate-950">Live system console (honest labels)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              Persistence backend: <strong>netlify_blobs + static_seed</strong> — Postgres / Netlify Database{" "}
              <strong>not</strong> canonical
            </li>
            <li>
              Presence: <strong>No presence signal</strong> (realtime presence not certified — do not label
              historical activity as Live)
            </li>
            <li>Field goals: RedDirt snapshot ingested · 75 counties</li>
            <li>
              Not yet persisted: director inspection audit, communication attempts, verified registration counts
            </li>
            <li>Invite-chain certification: PENDING</li>
            <li>
              Return:{" "}
              <Link href="/admin?tab=command" className="font-semibold text-brand-800 underline">
                Operator Command
              </Link>
              {" · "}
              <Link href="/admin/college-command" className="font-semibold text-brand-800 underline">
                College Command
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
