"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CLOSING_MESSAGE, DOCTRINE, LANDING_CHAIN, SECTIONS } from "@/lib/field-strategy/content";
import { PRESENTATION_SLIDES } from "@/lib/field-strategy/nav";
import { ChainFlow } from "./ChainFlow";

function SlideShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-center px-4 py-8 sm:px-8">
      <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.2em] text-field-wheat">
        {kicker}
      </p>
      <h1 className="mt-3 font-fieldDisplay text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <div className="mt-8 space-y-4 font-fieldSans text-base leading-relaxed text-field-mist/90 sm:text-lg">
        {children}
      </div>
    </div>
  );
}

export function PresentationDeck() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = Number(params.get("slide") ?? "0");
  const [index, setIndex] = useState(Number.isFinite(initial) ? Math.max(0, Math.min(PRESENTATION_SLIDES.length - 1, initial)) : 0);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(PRESENTATION_SLIDES.length - 1, next));
      setIndex(clamped);
      router.replace(`/field-strategy/presentation?slide=${clamped}`, { scroll: false });
    },
    [router],
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
      if (e.key === "Escape") router.push("/field-strategy");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, router]);

  const slide = PRESENTATION_SLIDES[index]!;
  const progress = ((index + 1) / PRESENTATION_SLIDES.length) * 100;

  const body = useMemo(() => {
    switch (index) {
      case 0:
        return (
          <SlideShell kicker="Screen 1" title={slide.title}>
            <p>{DOCTRINE}</p>
            <p>Every Kelly visit becomes an organizing trigger — not a one-night gathering.</p>
          </SlideShell>
        );
      case 1:
        return (
          <SlideShell kicker="Screen 2" title={slide.title}>
            <ChainFlow steps={LANDING_CHAIN} compact />
          </SlideShell>
        );
      case 2:
        return (
          <SlideShell kicker="Screen 3" title={slide.title}>
            <p>{SECTIONS["local-teams"].oneLiner}</p>
            <p className="text-field-wheat">
              Event · Social · Canvass · Recruitment · Community · Registration · Media · Logistics
            </p>
          </SlideShell>
        );
      case 3:
        return (
          <SlideShell kicker="Screen 4" title={slide.title}>
            <p>{SECTIONS["central-campaign"].oneLiner}</p>
            <p>Templates, graphics, scripts, data, brand, and specialized teams surround the county.</p>
          </SlideShell>
        );
      case 4:
        return (
          <SlideShell kicker="Screen 5" title={slide.title}>
            <p className="font-fieldDisplay text-3xl text-field-wheat sm:text-4xl">Regnat Populus · The People Rule</p>
            <p>Different county. Different town. Different people. Same identity.</p>
          </SlideShell>
        );
      case 5:
        return (
          <SlideShell kicker="Screen 6" title={slide.title}>
            <p>{SECTIONS["power-of-5"].oneLiner}</p>
            <p>One leader · five people · neighborhood strength · election-period readiness.</p>
          </SlideShell>
        );
      case 6:
        return (
          <SlideShell kicker="Screen 7" title={slide.title}>
            <p>{SECTIONS["voter-registration"].oneLiner}</p>
            <p>Central Director → County Lead → Community leads → Volunteers.</p>
          </SlideShell>
        );
      case 7:
        return (
          <SlideShell kicker="Screen 8" title={slide.title}>
            <p>{SECTIONS["strike-teams"].oneLiner}</p>
            <p>Every Saturday in October — stage, canvass, return, celebrate, assign next steps.</p>
          </SlideShell>
        );
      case 8:
        return (
          <SlideShell kicker="Screen 9" title={slide.title}>
            <p>{SECTIONS["county-command"].oneLiner}</p>
            <p>County Command is the operational home that connects local leaders.</p>
          </SlideShell>
        );
      case 9:
        return (
          <SlideShell kicker="Screen 10" title={slide.title}>
            <p>{SECTIONS["election-operations"].oneLiner}</p>
            <p>Training and legal clarity before any poll assignment.</p>
          </SlideShell>
        );
      case 10:
        return (
          <SlideShell kicker="Screen 11" title={slide.title}>
            <p>Attendance is useful. Organization is the real metric.</p>
            <p>Volunteers · Power of 5 · Registrations · Leaders · Continuity.</p>
          </SlideShell>
        );
      case 11:
        return (
          <SlideShell kicker="Screen 12" title={slide.title}>
            <p>{SECTIONS.benton.oneLiner}</p>
            <p>Statewide vision — and Benton&apos;s exact place inside it.</p>
          </SlideShell>
        );
      case 12:
        return (
          <SlideShell kicker="Screen 13" title={slide.title}>
            <p>Open Benton County leadership seats:</p>
            <p className="text-field-wheat">
              County Command · Volunteer · Registration · Social · Canvass · Media · Election Ops · City leads
            </p>
            <Link href="/field-strategy/benton" className="inline-block text-sm font-bold text-field-wheat underline">
              Open Benton leadership map →
            </Link>
          </SlideShell>
        );
      default:
        return (
          <SlideShell kicker="Screen 14" title={slide.title}>
            {CLOSING_MESSAGE.slice(0, 4).map((l) => (
              <p key={l}>{l}</p>
            ))}
            <p className="font-fieldDisplay text-3xl text-field-wheat">Name the next event. Name County Command. Assign the first four owners.</p>
          </SlideShell>
        );
    }
  }, [index, slide.title]);

  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="h-1 bg-field-pine">
        <div className="h-full bg-field-wheat transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <Link href="/field-strategy" className="font-fieldSans text-xs font-semibold text-field-wheat">
          ← Overview
        </Link>
        <p className="font-fieldSans text-xs text-field-mist/70">
          {index + 1} / {PRESENTATION_SLIDES.length}
        </p>
        <button
          type="button"
          className="font-fieldSans text-xs font-semibold text-field-mist/80"
          onClick={() => {
            const el = document.documentElement;
            if (!document.fullscreenElement) el.requestFullscreen?.();
            else document.exitFullscreen?.();
          }}
        >
          Full screen
        </button>
      </div>

      <div key={index} className="animate-fieldRise">
        {body}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-field-dusk/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            className="rounded-lg border border-white/20 px-4 py-2 font-fieldSans text-sm font-semibold disabled:opacity-30"
          >
            Previous
          </button>
          <p className="hidden text-center font-fieldSans text-xs text-field-mist/60 sm:block">
            Arrow keys · Space · Esc to exit
          </p>
          <button
            type="button"
            disabled={index >= PRESENTATION_SLIDES.length - 1}
            onClick={() => go(index + 1)}
            className="rounded-lg bg-field-wheat px-4 py-2 font-fieldSans text-sm font-bold text-field-dusk disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
