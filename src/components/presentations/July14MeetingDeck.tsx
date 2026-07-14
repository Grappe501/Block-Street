"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  JULY14_AGENDA_REGISTRY,
  july14DrillHref,
  listJuly14Items,
  type July14AgendaItem,
} from "@/lib/presentations/july14-registry";

export type MeetingMode = "presenter" | "participant";

function scheduleStatus(elapsedMin: number, expectedMin: number): {
  label: string;
  tone: string;
} {
  const delta = elapsedMin - expectedMin;
  if (delta >= 5) return { label: "Five+ minutes behind — stay on agenda", tone: "text-red-300" };
  if (delta >= 2) return { label: "About two minutes behind", tone: "text-amber-300" };
  if (delta <= -2) return { label: "Ahead of pace", tone: "text-emerald-300" };
  return { label: "On schedule", tone: "text-field-wheat" };
}

export function July14MeetingDeck({ mode }: { mode: MeetingMode }) {
  const router = useRouter();
  const params = useSearchParams();
  const items = useMemo(() => listJuly14Items(), []);
  const initialKey = params.get("item") ?? items[0]?.item_number ?? "01";
  const initialIndex = Math.max(
    0,
    items.findIndex((i) => i.item_number === initialKey || i.aliases.includes(initialKey)),
  );
  const [index, setIndex] = useState(initialIndex < 0 ? 0 : initialIndex);
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [stayOnAgenda, setStayOnAgenda] = useState(true);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(t);
  }, []);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, next));
      setIndex(clamped);
      const item = items[clamped]!;
      router.replace(`/presentations/july-14/${mode}?item=${item.item_number}`, { scroll: false });
    },
    [items, mode, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        go(index + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(index - 1);
      }
      if (e.key === "Escape") router.push("/presentations/july-14");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, router]);

  const item = items[index]!;
  const elapsedMin = (now - startedAt) / 60000;
  const expectedMin = items.slice(0, index).reduce((a, x) => a + x.duration_minutes, 0);
  const schedule = scheduleStatus(elapsedMin, expectedMin);
  const progress = ((index + 1) / items.length) * 100;
  const remainingLeaf = items.slice(index).reduce((a, x) => a + x.duration_minutes, 0);
  const drill = july14DrillHref(item, mode);

  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="h-1 bg-field-pine">
        <div className="h-full bg-field-wheat transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <header className="border-b border-white/10 px-3 py-3 sm:px-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <Link href="/presentations/july-14" className="font-fieldSans text-xs font-semibold text-field-wheat">
            ← Presentation hub
          </Link>
          <p className="font-fieldSans text-xs text-field-mist/70">
            Item {item.item_number} · {index + 1}/{items.length} · {mode}
          </p>
          <div className="flex items-center gap-3">
            <p className={`font-fieldSans text-xs font-semibold ${schedule.tone}`}>{schedule.label}</p>
            {mode === "presenter" ? (
              <button
                type="button"
                onClick={() => setStayOnAgenda((v) => !v)}
                className="font-fieldSans text-xs text-field-mist/80 underline"
              >
                {stayOnAgenda ? "Show more links" : "Stay on agenda"}
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-center px-4 py-8 pb-28 sm:px-8">
        <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.2em] text-field-wheat">
          Agenda item {item.item_number}
          {item.item_number === "34" ? " (034)" : ""} · {item.duration_minutes} min · ~{remainingLeaf} min
          remaining in leaf plan
        </p>
        <h1 className="mt-3 font-fieldDisplay text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
          {shortTitle(item)}
        </h1>

        <div className="mt-6 space-y-4 font-fieldSans text-base leading-relaxed text-field-mist sm:text-lg">
          {item.participant_content.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {mode === "presenter" ? (
          <div className="mt-6 rounded-xl border border-field-wheat/30 bg-black/25 p-4">
            <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.16em] text-field-wheat">
              Presenter notes
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-mist/90">
              {item.presenter_content.map((n) => (
                <li key={n}>{n}</li>
              ))}
              <li>Primary action: {item.primary_action}</li>
              <li>Transition: move to item {items[index + 1]?.item_number ?? "close"} when the room is ready.</li>
            </ul>
          </div>
        ) : null}

        {!stayOnAgenda || mode === "participant" ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href={drill}
              className="rounded-lg bg-field-wheat px-4 py-2.5 font-fieldSans text-sm font-bold text-field-dusk"
            >
              {item.primary_action} →
            </Link>
            <Link
              href={`/presentations/july-14/items/${item.item_number}?mode=${mode}`}
              className="rounded-lg border border-white/25 px-4 py-2.5 font-fieldSans text-sm font-semibold text-field-mist"
            >
              Item detail
            </Link>
            {mode === "presenter" && !stayOnAgenda ? (
              <Link
                href={item.supporting_module}
                className="rounded-lg border border-white/25 px-4 py-2.5 font-fieldSans text-sm font-semibold text-field-mist"
              >
                Supporting module
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="mt-6">
            <Link
              href={drill}
              className="inline-flex rounded-lg bg-field-wheat px-4 py-2.5 font-fieldSans text-sm font-bold text-field-dusk"
            >
              {item.primary_action} →
            </Link>
          </div>
        )}

        {mode === "presenter" ? (
          <details className="mt-8 rounded-xl border border-white/10 bg-black/20 p-4">
            <summary className="cursor-pointer font-fieldSans text-xs font-semibold text-field-mist/70">
              What is live today? (trust panel — keep brief)
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-fieldSans text-xs font-bold text-emerald-300">Working now</p>
                <ul className="mt-1 list-disc pl-4 font-fieldSans text-xs text-field-mist/80">
                  {JULY14_AGENDA_REGISTRY.honesty.working_now.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-fieldSans text-xs font-bold text-amber-300">Still being completed</p>
                <ul className="mt-1 list-disc pl-4 font-fieldSans text-xs text-field-mist/80">
                  {JULY14_AGENDA_REGISTRY.honesty.still_being_completed.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        ) : null}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-field-dusk/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            className="rounded-lg border border-white/20 px-4 py-2 font-fieldSans text-sm font-semibold text-field-mist disabled:opacity-30"
          >
            Previous
          </button>
          <p className="hidden text-center font-fieldSans text-xs text-field-mist/60 sm:block">
            Arrows · Space · Esc hub · {JULY14_AGENDA_REGISTRY.timing_note}
          </p>
          <button
            type="button"
            disabled={index >= items.length - 1}
            onClick={() => go(index + 1)}
            className="rounded-lg bg-field-wheat px-4 py-2 font-fieldSans text-sm font-bold text-field-dusk disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
}

function shortTitle(item: July14AgendaItem): string {
  if (item.title.length <= 120) return item.title;
  return `${item.title.slice(0, 117)}…`;
}
