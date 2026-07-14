"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { presentationHrefForItem } from "@/lib/meeting/july14-registry";

function ReturnBanner({ fromItem, mode }: { fromItem?: string; mode?: string }) {
  const params = useSearchParams();
  const from = params.get("from") ?? (mode === "july14" || fromItem ? "july14" : null);
  const item = params.get("item") ?? fromItem ?? null;

  if (from !== "july14" || !item) return null;
  const href = presentationHrefForItem(item) ?? "/presentations/july-14";

  return (
    <div className="border-b border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-950">
      <Link href={href} className="font-semibold text-brand-800 underline-offset-2 hover:underline">
        ← Return to agenda item {item}
      </Link>
      <span className="ml-2 text-brand-700/80">July 14 meeting path</span>
    </div>
  );
}

export function MeetingChrome({
  title,
  subtitle,
  children,
  eyebrow = "Soft beta · meeting support",
  fromItem,
  mode,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  eyebrow?: string;
  /** Optional when callers pass presentation item without searchParams wrappers. */
  fromItem?: string;
  mode?: string;
}) {
  return (
    <div className="min-h-[70vh] bg-field-paper text-field-ink">
      <Suspense fallback={null}>
        <ReturnBanner fromItem={fromItem} mode={mode} />
      </Suspense>
      <header className="border-b border-field-ink/10 bg-field-dusk text-field-mist">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.16em] text-field-wheat">{eyebrow}</p>
          <h1 className="mt-2 font-fieldDisplay text-3xl tracking-tight text-white sm:text-4xl">{title}</h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl font-fieldSans text-base leading-relaxed text-field-mist/90">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 text-field-ink">{children}</div>
    </div>
  );
}

export function MeetingLinkList({
  items,
}: {
  items: { href: string; label: string; note?: string }[];
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="flex flex-col rounded-lg border border-field-ink/15 bg-white px-4 py-3 transition hover:border-field-pine/40"
          >
            <span className="font-semibold text-field-ink">{item.label}</span>
            {item.note ? <span className="mt-1 text-sm text-field-ink/70">{item.note}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
