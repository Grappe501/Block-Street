"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ORIENTATION_SECTIONS } from "@/lib/orientation/sections";

export default function OrientationDeck({ mode }: { mode: "presenter" | "participant" }) {
  const sections = useMemo(() => ORIENTATION_SECTIONS, []);
  const [index, setIndex] = useState(0);
  const section = sections[index]!;
  const progress = ((index + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="h-1 bg-field-pine">
        <div className="h-full bg-field-wheat transition-all" style={{ width: `${progress}%` }} />
      </div>
      <header className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <Link href="/orientation" className="text-xs font-semibold text-field-wheat">
          ← Orientation hub
        </Link>
        <p className="text-xs text-field-mist/70">
          {index + 1}/{sections.length} · {mode} · {section.estimatedDurationMinutes} min
        </p>
      </header>
      <main className="mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center px-4 py-8 pb-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-field-wheat">Orientation</p>
        <h1 className="mt-3 font-fieldDisplay text-3xl text-white sm:text-4xl">{section.title}</h1>
        <p className="mt-4 text-lg text-field-mist/90">{section.shortExplanation}</p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-field-mist/85">
          {(mode === "presenter" ? section.presenterNotes : section.participantText).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {mode === "presenter" ? (
          <p className="mt-4 text-xs text-field-mist/55">
            Media-ready fields reserved for future audio/video · text remains fully usable without media
          </p>
        ) : null}
        <Link
          href={section.primaryAction.href}
          className="mt-8 inline-flex w-fit rounded-lg bg-field-wheat px-4 py-2.5 text-sm font-bold text-field-dusk"
        >
          {section.primaryAction.label} →
        </Link>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-field-dusk/95 px-4 py-3">
        <div className="mx-auto flex max-w-3xl justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold disabled:opacity-30"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={index >= sections.length - 1}
            onClick={() => setIndex((i) => i + 1)}
            className="rounded-lg bg-field-wheat px-4 py-2 text-sm font-bold text-field-dusk disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
}
