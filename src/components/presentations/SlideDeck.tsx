"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PresentationSlide } from "@/lib/presentations/types";

export function SlideDeck({
  slides,
  homeHref,
  homeLabel,
  deckPath,
}: {
  slides: PresentationSlide[];
  homeHref: string;
  homeLabel: string;
  deckPath: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = Number(params.get("slide") ?? "0");
  const [index, setIndex] = useState(
    Number.isFinite(initial) ? Math.max(0, Math.min(slides.length - 1, initial)) : 0,
  );

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      setIndex(clamped);
      router.replace(`${deckPath}?slide=${clamped}`, { scroll: false });
    },
    [deckPath, router, slides.length],
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
      if (e.key === "Escape") router.push(homeHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, homeHref, index, router]);

  const slide = slides[index]!;
  const progress = ((index + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="h-1 bg-field-pine">
        <div className="h-full bg-field-wheat transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <Link href={homeHref} className="font-fieldSans text-xs font-semibold text-field-wheat">
          ← {homeLabel}
        </Link>
        <p className="font-fieldSans text-xs text-field-mist/70">
          {index + 1} / {slides.length}
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

      <div key={slide.id} className="animate-fieldRise mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-center px-4 py-8 sm:px-8">
        <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.2em] text-field-wheat">
          {slide.kicker}
        </p>
        <h1 className="mt-3 font-fieldDisplay text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
          {slide.title}
        </h1>
        <div className="mt-8 space-y-4 font-fieldSans text-base leading-relaxed text-field-mist/90 sm:text-lg">
          {slide.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {slide.bullets && slide.bullets.length > 0 && (
            <ul className="list-disc space-y-2 pl-5 text-field-mist/90">
              {slide.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {slide.ctaHref && slide.ctaLabel && (
            <Link
              href={slide.ctaHref}
              className="inline-block pt-2 text-sm font-bold text-field-wheat underline"
            >
              {slide.ctaLabel}
            </Link>
          )}
        </div>
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
            disabled={index >= slides.length - 1}
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
