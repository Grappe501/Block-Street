"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import {
  getJuly14AgendaItems,
  readJuly14Checklist,
  writeJuly14Checklist,
  type ChecklistState,
} from "@/lib/meeting/july14-registry";
import { CAMPUS_GOAL_FORMULA_VERSION } from "@/lib/field-goals/campus-goals";

export default function July14MeetingWorkspacePage() {
  const items = getJuly14AgendaItems();
  const [checks, setChecks] = useState<ChecklistState>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChecks(readJuly14Checklist());
    setReady(true);
  }, []);

  function toggle(id: string) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeJuly14Checklist(next);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            College Command · soft beta
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">July 14 meeting workspace</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Checklist mirrors the live agenda presentation. Local checkmarks only — no fabricated attendance or personnel.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/presentations/july-14" className="text-brand-800 underline-offset-2 hover:underline">
              Open presentation →
            </Link>
            <Link
              href="/admin/college-command/meeting/july-14/commitments"
              className="text-brand-800 underline-offset-2 hover:underline"
            >
              Commitments →
            </Link>
            <Link href="/admin/college-command" className="text-brand-800 underline-offset-2 hover:underline">
              ← College Command
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Invite honesty warning</p>
          <p className="mt-1">
            Soft beta does <strong>not</strong> claim invite-chain CERTIFIED. Prepare invites carefully and use Start /
            Power of 5 prep — never invent certified activation.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-950">Campus goals note</p>
          <p className="mt-1">
            Active formula: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{CAMPUS_GOAL_FORMULA_VERSION}</code>
            {" "}
            (enrollment share of county VAP). Flat 25% is superseded and must not appear as active guidance.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-bold text-slate-950">Agenda checklist</h2>
          {!ready ? (
            <p className="mt-2 text-sm text-slate-600">Loading checklist…</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {items.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={Boolean(checks[row.id])}
                      onChange={() => toggle(row.id)}
                      aria-label={`Mark done: ${row.title}`}
                    />
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {row.kicker}
                      </span>
                      <span className="font-semibold text-slate-950">{row.title}</span>
                    </span>
                  </label>
                  <Link
                    href={`/presentations/july-14?slide=${row.slideIndex}`}
                    className="text-sm font-semibold text-brand-800 underline-offset-2 hover:underline sm:shrink-0"
                  >
                    Open item →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <HonestyPanel
          workingNow={[
            "Agenda checklist (localStorage)",
            "Links into presentation slide items",
            `Campus formula ${CAMPUS_GOAL_FORMULA_VERSION}`,
          ]}
          stillCompleting={[
            "Invite CERTIFIED (not claimed)",
            "Durable meeting attendance",
            "Personnel assignment workflows",
          ]}
        />
      </main>
    </div>
  );
}
