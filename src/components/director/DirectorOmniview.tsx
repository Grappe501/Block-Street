"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FieldManualNavTab } from "@/components/field-strategy/FieldManualNavTab";
import type { InspectTarget } from "@/lib/director/inspect-catalog";

type Catalog = {
  counties: InspectTarget[];
  colleges: InspectTarget[];
  highSchools: InspectTarget[];
  system: InspectTarget[];
};

function withInspect(href: string, reason: string) {
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}inspect=director&reason=${encodeURIComponent(reason)}`;
}

export function DirectorOmniview({ catalog }: { catalog: Catalog }) {
  const [reason, setReason] = useState("product diagnostic");
  const [q, setQ] = useState("");
  const stamp = useMemo(() => new Date().toISOString(), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const match = (t: InspectTarget) =>
      !needle ||
      t.label.toLowerCase().includes(needle) ||
      (t.meta ?? "").toLowerCase().includes(needle) ||
      t.href.toLowerCase().includes(needle);
    return {
      counties: catalog.counties.filter(match),
      colleges: catalog.colleges.filter(match),
      highSchools: catalog.highSchools.filter(match),
      system: catalog.system.filter(match),
    };
  }, [catalog, q]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b-4 border-amber-400 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Director · Omniview</p>
          <h1 className="mt-2 text-3xl font-bold">See any board live</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/80">
            Full system visibility for diagnosis. Opens the same participant/command surfaces an end user sees,
            labeled as Director inspection — read-only by convention. Does not replace the inspected person’s
            session, preferences, or notifications.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <FieldManualNavTab variant="header" />
            <Link href="/admin/volunteer-command" className="text-sm underline text-white/90">
              Volunteer Command
            </Link>
            <Link href="/admin/college-command" className="text-sm underline text-white/90">
              College Leader Workbench
            </Link>
            <Link href="/admin?tab=command" className="text-sm underline text-white/90">
              Operator Command
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Inspection mode: Director</p>
          <p className="mt-1">Opened at {stamp}. Use a reason when walking someone through a board.</p>
          <label className="mt-3 block text-xs font-semibold">
            Reason
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search counties, colleges, high schools…"
            className="mt-3 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-slate-900"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
          <h2 className="font-bold text-slate-950">Live system console (honest labels)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              Persistence backend: <strong>netlify_blobs + static_seed</strong> — Postgres / Netlify Database{" "}
              <strong>not</strong> canonical (V2-B deferred)
            </li>
            <li>
              Not every action is durable in production Blobs; invite/place/share paths are Blobs-backed; many
              admin/personnel/committee writes remain local-seed or scaffold
            </li>
            <li>
              Presence: <strong>No presence signal</strong> (realtime presence not certified — do not label
              historical activity as Live)
            </li>
            <li>Field goals: RedDirt snapshot from H:/SOSWebsite/RedDirt · 75 counties · campus = 25% county</li>
            <li>Invite-chain certification: PENDING</li>
          </ul>
        </div>

        {(
          [
            ["System surfaces", filtered.system],
            ["County boards", filtered.counties],
            ["College boards", filtered.colleges],
            ["High school / private boards", filtered.highSchools],
          ] as const
        ).map(([title, rows]) => (
          <section key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">
              {title}{" "}
              <span className="font-normal text-slate-500">({rows.length})</span>
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {rows.slice(0, title === "County boards" || title.startsWith("High") ? 200 : 80).map((s) => (
                <li key={s.id}>
                  <Link
                    href={withInspect(s.href, reason)}
                    className="block rounded-xl border border-slate-200 px-3 py-3 transition hover:border-brand-300 hover:bg-slate-50"
                  >
                    <p className="text-sm font-semibold text-slate-950">{s.label}</p>
                    {s.meta ? <p className="mt-0.5 text-[11px] text-slate-600">{s.meta}</p> : null}
                    <p className="mt-1 text-[11px] font-semibold text-brand-800">Open as end-user view →</p>
                  </Link>
                </li>
              ))}
            </ul>
            {rows.length === 0 ? <p className="mt-2 text-xs text-slate-500">No matches.</p> : null}
          </section>
        ))}
      </div>
    </div>
  );
}
