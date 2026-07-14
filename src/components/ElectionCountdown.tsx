"use client";

import { useEffect, useState } from "react";

/** Arkansas election day — start of day, Central Time (CST after DST ends). */
const ELECTION_ISO = "2026-11-03T00:00:00-06:00";
const ELECTION_MS = new Date(ELECTION_ISO).getTime();

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function remainingNow(): Remaining {
  const diff = ELECTION_MS - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds, done: false };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[2.25rem] text-center sm:min-w-[2.5rem]">
      <p className="font-mono text-sm font-bold tabular-nums leading-none text-white sm:text-base">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/80">{label}</p>
    </div>
  );
}

/**
 * Persistent election countdown — fixed upper-right on every page.
 */
export function ElectionCountdown() {
  const [left, setLeft] = useState<Remaining | null>(null);

  useEffect(() => {
    setLeft(remainingNow());
    const id = window.setInterval(() => setLeft(remainingNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!left) {
    return (
      <div
        className="pointer-events-none fixed right-3 top-3 z-[60] h-14 w-40 rounded-xl bg-slate-900/90 sm:right-4 sm:top-4"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="fixed right-3 top-3 z-[60] max-w-[calc(100vw-1.5rem)] rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-lg backdrop-blur-sm sm:right-4 sm:top-4"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={
        left.done
          ? "Election day — November 3, 2026"
          : `${left.days} days, ${left.hours} hours, ${left.minutes} minutes, ${left.seconds} seconds until November 3, 2026 election`
      }
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-200">
        {left.done ? "Election day" : "Until election"}
      </p>
      {left.done ? (
        <p className="mt-1 text-sm font-bold text-white">Nov 3, 2026 — Vote</p>
      ) : (
        <div className="mt-1.5 flex items-end gap-2 sm:gap-2.5">
          <Unit value={left.days} label="Days" />
          <span className="pb-3 text-white/40" aria-hidden>
            :
          </span>
          <Unit value={left.hours} label="Hrs" />
          <span className="pb-3 text-white/40" aria-hidden>
            :
          </span>
          <Unit value={left.minutes} label="Min" />
          <span className="hidden pb-3 text-white/40 xs:inline sm:inline" aria-hidden>
            :
          </span>
          <div className="hidden sm:block">
            <Unit value={left.seconds} label="Sec" />
          </div>
        </div>
      )}
      <p className="mt-1 text-[10px] text-white/70">Nov 3, 2026</p>
    </div>
  );
}
