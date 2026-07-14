"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CHOICES = [
  { id: "explore-position", label: "Explore a College Team leadership position", href: "/positions/college" },
  { id: "represent-institution", label: "Represent an institution", href: "/admin/college-command" },
  { id: "join-p5", label: "Join an existing Power of 5", href: "/power-of-5" },
  { id: "build-p5", label: "Build my own Power of 5", href: "/power-of-5/start" },
  { id: "recruit-students", label: "Help recruit students", href: "/recruit/college" },
  { id: "registration", label: "Help with voter registration goals", href: "/positions/college-voter-registration-lead" },
  { id: "vci", label: "Help with VCI goals", href: "/admin/college-command" },
  { id: "campus-meeting", label: "Help organize a campus meeting", href: "/positions/college-event-lead" },
  { id: "leadership-conversation", label: "Schedule a leadership conversation", href: "/join/interest" },
  { id: "learn-more", label: "Learn more before deciding", href: "/how-it-works" },
] as const;

const STORAGE_KEY = "july14-meeting-commitment-v1";

function CommitmentInner() {
  const params = useSearchParams();
  const item = params.get("item") ?? "34";
  const mode = params.get("mode") === "presenter" ? "presenter" : "participant";
  const [selected, setSelected] = useState<string | null>(null);
  const choice = useMemo(() => CHOICES.find((c) => c.id === selected) ?? null, [selected]);

  function commit(id: string) {
    setSelected(id);
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown[];
      const row = { id, at: new Date().toISOString(), item };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([row, ...prev].slice(0, 50)));
    } catch {
      /* soft-beta local only */
    }
  }

  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href={`/presentations/july-14/${mode}?item=${item}`}
          className="font-fieldSans text-xs font-semibold text-field-wheat"
        >
          ← Return to agenda item {item}
        </Link>
        <h1 className="mt-6 font-fieldDisplay text-4xl text-white">Choose one next step</h1>
        <p className="mt-3 font-fieldSans text-sm text-field-mist/85">
          Expressing interest begins a conversation. It does not appoint someone to a leadership position. Invite-chain
          remains soft beta (PRESENT, not CERTIFIED).
        </p>
        <ul className="mt-8 space-y-2">
          {CHOICES.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => commit(c.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left font-fieldSans text-sm font-semibold transition ${
                  selected === c.id
                    ? "border-field-wheat bg-field-wheat/15 text-field-wheat"
                    : "border-white/15 text-field-mist hover:border-white/35"
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
        {choice ? (
          <div className="mt-8 rounded-xl border border-field-wheat/40 bg-black/25 p-5">
            <p className="font-fieldSans text-xs font-bold uppercase tracking-wide text-field-wheat">Recorded locally</p>
            <p className="mt-2 font-fieldSans text-base text-white">{choice.label}</p>
            <p className="mt-2 text-sm text-field-mist/80">
              Soft-beta only — stored in this browser. Not a personnel assignment. Aggregates may appear in the College
              meeting commitments view when opened on this device.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={choice.href} className="rounded-lg bg-field-wheat px-4 py-2 text-sm font-bold text-field-dusk">
                Go to next step →
              </Link>
              <Link href="/power-of-5/start" className="rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold">
                Power of 5
              </Link>
              <Link href="/recruit" className="rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold">
                Recruiting guide
              </Link>
              <Link
                href={`/presentations/july-14/${mode}?item=34`}
                className="rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold"
              >
                Return to close
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function July14CommitmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-field-dusk p-8 text-field-mist">Loading…</div>}>
      <CommitmentInner />
    </Suspense>
  );
}
