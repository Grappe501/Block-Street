"use client";

import Link from "next/link";
import { JULY14_AGENDA_REGISTRY, listJuly14Items } from "@/lib/presentations/july14-registry";

export function July14HubClient() {
  const items = listJuly14Items();
  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.18em] text-field-wheat">
          July 14 · College Team meeting
        </p>
        <h1 className="mt-3 font-fieldDisplay text-4xl text-white sm:text-5xl">Presentation hub</h1>
        <p className="mt-4 font-fieldSans text-base leading-relaxed text-field-mist">
          Tonight is not only an orientation. By the end of the meeting, every participant should understand how the
          College Team fits into Block Street, which positions are available, what those positions do, and what concrete
          next step they can take.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/presentations/july-14/presenter?item=01"
            className="rounded-xl bg-field-wheat px-5 py-4 font-fieldSans text-sm font-bold text-field-dusk"
          >
            Present the meeting
          </Link>
          <Link
            href="/presentations/july-14/participant?item=01"
            className="rounded-xl border border-field-wheat/50 px-5 py-4 font-fieldSans text-sm font-bold text-field-wheat"
          >
            Follow along
          </Link>
          <Link
            href="/command"
            className="rounded-xl border border-field-wheat/40 bg-black/25 px-5 py-4 font-fieldSans text-sm font-semibold text-white"
          >
            Campaign & campus boards
          </Link>
          <Link
            href="/calendar"
            className="rounded-xl border border-field-wheat/40 bg-black/25 px-5 py-4 font-fieldSans text-sm font-semibold text-white"
          >
            Universal calendar
          </Link>
          <Link
            href="/command/events"
            className="rounded-xl border border-field-wheat/40 bg-black/25 px-5 py-4 font-fieldSans text-sm font-semibold text-white"
          >
            Event Board · Carol Eagan
          </Link>
          <Link
            href="/presentations/july-14/goals"
            className="rounded-xl border border-white/25 px-5 py-4 font-fieldSans text-sm font-semibold text-white"
          >
            Goals broken out
          </Link>
          <Link
            href="/positions/college"
            className="rounded-xl border border-white/25 px-5 py-4 font-fieldSans text-sm font-semibold text-white"
          >
            Sign up for jobs
          </Link>
          <Link
            href="/admin/college-command/meeting/july-14"
            className="rounded-xl border border-white/25 px-5 py-4 font-fieldSans text-sm font-semibold text-white"
          >
            College Team workspace
          </Link>
          <Link
            href="/july-14"
            className="rounded-xl border border-white/25 px-5 py-4 font-fieldSans text-sm font-semibold text-white"
          >
            Written agenda
          </Link>
        </div>

        <section className="mt-10 rounded-xl border border-white/15 bg-black/30 p-5">
          <h2 className="font-fieldDisplay text-2xl text-white">Agenda registry ({items.length} leaves)</h2>
          <p className="mt-2 font-fieldSans text-sm text-field-mist/85">{JULY14_AGENDA_REGISTRY.finding.note}</p>
          <p className="mt-2 font-fieldSans text-sm text-field-mist/85">{JULY14_AGENDA_REGISTRY.timing_note}</p>
          <ol className="mt-4 max-h-80 space-y-1 overflow-y-auto font-fieldSans text-sm">
            {items.map((item) => (
              <li key={item.item_number}>
                <Link className="text-field-wheat hover:underline" href={`/presentations/july-14/items/${item.item_number}`}>
                  {item.item_number}. {item.title.length > 90 ? `${item.title.slice(0, 87)}…` : item.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 font-fieldSans text-sm text-field-mist/80">
          Classic slide deck:{" "}
          <Link href="/presentations/july-14/deck" className="font-semibold text-field-wheat underline">
            open deck mode
          </Link>
          {" · "}
          <Link href="/command/managers" className="font-semibold text-field-wheat underline">
            CM / ACM
          </Link>
        </p>
      </div>
    </div>
  );
}
