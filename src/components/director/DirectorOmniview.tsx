"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FieldManualNavTab } from "@/components/field-strategy/FieldManualNavTab";
import type { InspectTarget } from "@/lib/director/inspect-catalog";
import { CAMPUS_GOAL_FORMULA_VERSION } from "@/lib/field-goals";
import buildProgress from "../../../data/build-progress.json";
import programBoard from "../../../data/director/program-board.json";
import durabilityRegistry from "../../../data/field-plan/approved-template-durability-registry.json";

type Catalog = {
  counties: InspectTarget[];
  colleges: InspectTarget[];
  highSchools: InspectTarget[];
  system: InspectTarget[];
};

type ProgramWave = {
  wave: string;
  package: string;
  status: string;
  content_commit: string | null;
};

function withInspect(href: string, reason: string) {
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}inspect=director&reason=${encodeURIComponent(reason)}`;
}

export function DirectorOmniview({ catalog }: { catalog: Catalog }) {
  const [reason, setReason] = useState("product diagnostic");
  const [q, setQ] = useState("");
  const stamp = useMemo(() => new Date().toISOString(), []);
  const board = programBoard as {
    active_program: string;
    production_commit: string;
    wave_4b_content_commit: string;
    wave_5a_content_commit?: string | null;
    deploy_url: string;
    claim: string;
    gate_a: string;
    persistence_mode: string;
    rbac_mode: string;
    working_toward: string[];
    milestones_complete: string[];
    waves: ProgramWave[];
    key_routes: { label: string; href: string }[];
    honesty: string[];
  };

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

  const wavesDone = board.waves.filter((w) => w.status === "TESTED").length;
  const wavesTotal = board.waves.length;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b-4 border-amber-400 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Director · Omniview</p>
          <h1 className="mt-2 text-3xl font-bold">Director program board</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/80">
            Progress, working-toward targets, and live board inspection. Opens the same surfaces end users see —
            labeled Director inspection (read-only by convention).
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <FieldManualNavTab variant="header" />
            <Link href="/admin?tab=command" className="text-sm underline text-white/90">
              Operator Command
            </Link>
            <Link href="/command/events" className="text-sm underline text-white/90">
              Event Operations
            </Link>
            <Link href="/admin/volunteer-command" className="text-sm underline text-white/90">
              Volunteer Command
            </Link>
            <Link href="/admin/college-command" className="text-sm underline text-white/90">
              College Leader Workbench
            </Link>
            <Link href="/field-strategy" className="text-sm underline text-white/90">
              Field Manual
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="rounded-2xl border-2 border-brand-600 bg-white p-5 text-sm text-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">{board.active_program}</h2>
          <p className="mt-1 text-xs text-slate-600">
            {board.claim} · Gate A <strong>{board.gate_a}</strong> · {board.persistence_mode} · RBAC {board.rbac_mode}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-slate-500">Waves tested</p>
              <p className="text-xl font-bold text-brand-800">
                {wavesDone}/{wavesTotal}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-slate-500">Deploy HEAD</p>
              <p className="font-mono text-sm font-bold">{board.production_commit}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-slate-500">Wave 4B content</p>
              <p className="font-mono text-sm font-bold">{board.wave_4b_content_commit}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase text-slate-500">Live</p>
              <a href={board.deploy_url} className="text-sm font-semibold text-brand-800 underline">
                block-street.netlify.app
              </a>
            </div>
          </div>

          <h3 className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-600">CAL-P2 wave ledger</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-1 pr-3">Wave</th>
                  <th className="py-1 pr-3">Package</th>
                  <th className="py-1 pr-3">Status</th>
                  <th className="py-1">Commit</th>
                </tr>
              </thead>
              <tbody>
                {board.waves.map((w) => (
                  <tr key={w.wave} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-semibold">{w.wave}</td>
                    <td className="py-2 pr-3 text-slate-700">{w.package.replace(/_/g, " ")}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={
                          w.status === "TESTED"
                            ? "rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-900"
                            : "rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-900"
                        }
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-2 font-mono text-[11px]">{w.content_commit ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-600">Working toward</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {board.working_toward.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-600">Milestones complete</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {board.milestones_complete.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-600">Key routes</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {board.key_routes.map((r) => (
              <Link
                key={r.href}
                href={withInspect(r.href, reason)}
                className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-900 hover:bg-brand-100"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-white p-4 text-sm text-slate-800">
          <h2 className="font-bold text-slate-950">Platform honesty (unchanged truths)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            {board.honesty.map((line) => (
              <li key={line}>{line}</li>
            ))}
            <li>
              Legacy active program field:{" "}
              <strong>{String((buildProgress.project as { activeProgram?: string })?.activeProgram ?? "—")}</strong>
            </li>
            <li>
              Field Plan freeze:{" "}
              {(durabilityRegistry.summary as { approved_templates?: number })?.approved_templates ?? 0} templates ·{" "}
              {(durabilityRegistry.summary as { approved_responsibilities?: number })?.approved_responsibilities ?? 0}{" "}
              responsibilities · storage static_seed · Postgres not live
            </li>
            <li>
              Field goals: RedDirt · 75 counties · campus formula <code>{CAMPUS_GOAL_FORMULA_VERSION}</code>
            </li>
            <li>Invite-chain CERTIFIED PRESENT: still PENDING (named launch blocker)</li>
          </ul>
        </div>

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
          <h2 className="font-bold text-slate-950">Live system console</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            <li>
              Persistence: <strong>netlify_blobs + static_seed</strong> — Postgres not live
            </li>
            <li>Presence: <strong>No presence signal</strong> — do not label activity as Live</li>
            <li>Director login: <code>/admin/login</code> → <code>director@block-street.local</code> / Forvermost</li>
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
              {title} <span className="font-normal text-slate-500">({rows.length})</span>
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
