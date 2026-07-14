"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CLOSING_MESSAGE,
  DOCTRINE,
  LANDING_CHAIN,
  SECTIONS,
  STRATEGY_CHAIN,
} from "@/lib/field-strategy/content";
import {
  PRESENTATION_SLIDES,
  fieldStrategyHref,
  type PresentationSlide,
} from "@/lib/field-strategy/nav";
import { ChainFlow } from "./ChainFlow";

function SlideShell({
  kicker,
  title,
  feel,
  children,
  drillHref,
  drillLabel,
}: {
  kicker: string;
  title: string;
  feel: string;
  children: React.ReactNode;
  drillHref: string;
  drillLabel: string;
}) {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-center px-4 py-8 pb-28 sm:px-8">
      <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.2em] text-field-wheat">
        {kicker}
      </p>
      <h1 className="mt-3 font-fieldDisplay text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-2 font-fieldSans text-xs text-field-mist/60">{feel}</p>
      <div className="mt-8 space-y-4 font-fieldSans text-base leading-relaxed text-field-mist sm:text-lg">
        {children}
      </div>
      <div className="mt-10">
        <Link
          href={drillHref}
          className="inline-flex items-center rounded-lg border border-field-wheat/50 bg-field-wheat/10 px-4 py-2.5 font-fieldSans text-sm font-bold text-field-wheat transition hover:bg-field-wheat/20"
        >
          {drillLabel}
        </Link>
        <p className="mt-2 font-fieldSans text-xs text-field-mist/55">
          Drill-down opens the full manual page for this topic.
        </p>
      </div>
    </div>
  );
}

function slideDrill(slide: PresentationSlide): { href: string; label: string } {
  return {
    href: slide.drillHref ?? fieldStrategyHref(slide.section),
    label: slide.drillLabel ?? `Open ${slide.title} →`,
  };
}

export function PresentationDeck() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = Number(params.get("slide") ?? "0");
  const [index, setIndex] = useState(
    Number.isFinite(initial) ? Math.max(0, Math.min(PRESENTATION_SLIDES.length - 1, initial)) : 0,
  );

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
      if (e.key === "Enter") {
        const slide = PRESENTATION_SLIDES[index];
        if (slide) router.push(slideDrill(slide).href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, router]);

  const slide = PRESENTATION_SLIDES[index]!;
  const progress = ((index + 1) / PRESENTATION_SLIDES.length) * 100;
  const drill = slideDrill(slide);
  const section = SECTIONS[slide.section];

  const body = useMemo(() => {
    const kicker = `Screen ${index + 1}`;
    const shell = (children: React.ReactNode) => (
      <SlideShell
        kicker={kicker}
        title={slide.title}
        feel={slide.feel}
        drillHref={drill.href}
        drillLabel={drill.label}
      >
        {children}
      </SlideShell>
    );

    switch (slide.id) {
      case "s1":
        return shell(
          <>
            <p>{DOCTRINE}</p>
            <p>Every Kelly visit becomes an organizing trigger — not a one-night gathering.</p>
          </>,
        );
      case "s2":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <ChainFlow steps={STRATEGY_CHAIN.length ? STRATEGY_CHAIN : LANDING_CHAIN} compact tone="dark" />
          </>,
        );
      case "s3":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <p className="text-field-wheat">
              Trigger → Local activation → Central support → Outreach → Event day → Power of 5 → Follow-up
            </p>
          </>,
        );
      case "s4":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <p className="text-field-wheat">
              Event · Social · Canvass · Recruitment · Community · Registration · Media · Logistics
            </p>
          </>,
        );
      case "s5":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <p>Templates, graphics, scripts, data, brand, and specialized teams surround the county.</p>
          </>,
        );
      case "s6":
        return shell(
          <>
            <p className="font-fieldDisplay text-3xl text-field-wheat sm:text-4xl">
              Regnat Populus · The People Rule
            </p>
            <p>Different county. Different town. Different people. Same identity.</p>
          </>,
        );
      case "s7":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <p>One leader · five people · neighborhood strength · election-period readiness.</p>
          </>,
        );
      case "s8":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <p>Every Saturday in October — stage, canvass, return, celebrate, assign next steps.</p>
          </>,
        );
      case "s9":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <p>County Command is the operational home that connects local leaders.</p>
          </>,
        );
      case "s10":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <p>Training and legal clarity before any poll assignment.</p>
          </>,
        );
      case "s11":
        return shell(
          <>
            <p>Attendance is useful. Organization is the real metric.</p>
            <p>Volunteers · Power of 5 · Registrations · Leaders · Continuity.</p>
          </>,
        );
      case "s12":
        return shell(
          <>
            <p>{section.oneLiner}</p>
            <p>Statewide vision — and Benton&apos;s exact place inside it.</p>
          </>,
        );
      case "s13":
        return shell(
          <>
            <p>Open Benton County leadership seats:</p>
            <p className="text-field-wheat">
              County Command · Volunteer · Registration · Social · Canvass · Media · Election Ops · City
              leads
            </p>
          </>,
        );
      case "s14":
      default:
        return shell(
          <>
            {CLOSING_MESSAGE.slice(0, 4).map((l) => (
              <p key={l}>{l}</p>
            ))}
            <p className="font-fieldDisplay text-3xl text-field-wheat">
              Name the next event. Name County Command. Assign the first four owners.
            </p>
          </>,
        );
    }
  }, [drill.href, drill.label, index, section.oneLiner, slide.feel, slide.id, slide.title]);

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
            className="rounded-lg border border-white/20 px-4 py-2 font-fieldSans text-sm font-semibold text-field-mist disabled:opacity-30"
          >
            Previous
          </button>
          <p className="hidden text-center font-fieldSans text-xs text-field-mist/60 sm:block">
            Arrows · Space · Enter drill-down · Esc exit
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
