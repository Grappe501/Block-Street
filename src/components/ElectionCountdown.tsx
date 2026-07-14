"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Arkansas election day — start of day, Central Time (CST after DST ends). */
const ELECTION_ISO = "2026-11-03T00:00:00-06:00";
const ELECTION_MS = new Date(ELECTION_ISO).getTime();
const POS_KEY = "election-countdown-pos";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

type Pos = { x: number; y: number };

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

function defaultPos(): Pos {
  if (typeof window === "undefined") return { x: 16, y: 16 };
  const width = Math.min(220, window.innerWidth - 24);
  return { x: Math.max(12, window.innerWidth - width - 16), y: 16 };
}

function loadPos(): Pos {
  try {
    const raw = sessionStorage.getItem(POS_KEY);
    if (!raw) return defaultPos();
    const parsed = JSON.parse(raw) as Pos;
    if (typeof parsed.x === "number" && typeof parsed.y === "number") return parsed;
  } catch {
    /* ignore */
  }
  return defaultPos();
}

function clampPos(x: number, y: number, el: HTMLElement | null): Pos {
  const w = el?.offsetWidth ?? 200;
  const h = el?.offsetHeight ?? 80;
  const maxX = Math.max(8, window.innerWidth - w - 8);
  const maxY = Math.max(8, window.innerHeight - h - 8);
  return {
    x: Math.min(maxX, Math.max(8, x)),
    y: Math.min(maxY, Math.max(8, y)),
  };
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
 * Floating election countdown — drag anywhere; dashboard content stays underneath.
 */
export function ElectionCountdown() {
  const [left, setLeft] = useState<Remaining | null>(null);
  const [pos, setPos] = useState<Pos>({ x: 16, y: 16 });
  const [dragging, setDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    pointerId: number;
  } | null>(null);

  useEffect(() => {
    setPos(loadPos());
    setLeft(remainingNow());
    const id = window.setInterval(() => setLeft(remainingNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setPos((p) => clampPos(p.x, p.y, panelRef.current));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const el = panelRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
      pointerId: e.pointerId,
    };
    setDragging(true);
  }, [pos.x, pos.y]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const next = clampPos(
      d.originX + (e.clientX - d.startX),
      d.originY + (e.clientY - d.startY),
      panelRef.current,
    );
    setPos(next);
  }, []);

  const endDrag = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    try {
      panelRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    setPos((p) => {
      const clamped = clampPos(p.x, p.y, panelRef.current);
      try {
        sessionStorage.setItem(POS_KEY, JSON.stringify(clamped));
      } catch {
        /* ignore */
      }
      return clamped;
    });
  }, []);

  if (!left) {
    return (
      <div
        className="fixed z-[60] h-14 w-40 rounded-xl bg-slate-900/90"
        style={{ left: pos.x, top: pos.y }}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={panelRef}
      className={`fixed z-[60] max-w-[calc(100vw-1.5rem)] touch-none select-none rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-lg backdrop-blur-sm ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ left: pos.x, top: pos.y }}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={
        left.done
          ? "Election day — November 3, 2026"
          : `${left.days} days, ${left.hours} hours, ${left.minutes} minutes, ${left.seconds} seconds until November 3, 2026 election`
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-200">
          {left.done ? "Election day" : "Until election"}
        </p>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/45"
          aria-hidden
        >
          drag
        </span>
      </div>
      {left.done ? (
        <p className="mt-1 text-sm font-bold text-white">Nov 3, 2026 — Vote</p>
      ) : (
        <div className="mt-0.5 flex items-end gap-2 sm:gap-2.5">
          <Unit value={left.days} label="Days" />
          <span className="pb-3 text-white/40" aria-hidden>
            :
          </span>
          <Unit value={left.hours} label="Hrs" />
          <span className="pb-3 text-white/40" aria-hidden>
            :
          </span>
          <Unit value={left.minutes} label="Min" />
          <span className="hidden pb-3 text-white/40 sm:inline" aria-hidden>
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
