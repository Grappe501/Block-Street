import Link from "next/link";
import type { ReactNode } from "react";
import { COMMAND_BOARD } from "@/lib/command/board";

export function CommandChrome({
  title,
  subtitle,
  eyebrow = "Command · soft beta",
  children,
  backHref = "/command",
  backLabel = "Command hub",
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-field-paper text-field-ink">
      <header className="border-b border-field-ink/10 bg-field-dusk text-field-mist">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link href={backHref} className="font-fieldSans text-xs font-semibold text-field-wheat hover:underline">
              ← {backLabel}
            </Link>
            <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.16em] text-field-wheat">
              {eyebrow}
            </p>
          </div>
          <h1 className="mt-3 font-fieldDisplay text-3xl text-white sm:text-4xl">{title}</h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl font-fieldSans text-base leading-relaxed text-field-mist/90">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</div>
      <footer className="border-t border-field-ink/10 bg-white px-4 py-6">
        <div className="mx-auto max-w-4xl font-fieldSans text-xs text-field-ink/70">
          <p className="font-semibold text-field-ink">Soft beta honesty</p>
          <p className="mt-1">Live: {COMMAND_BOARD.honesty.working_now.join(" · ")}</p>
          <p className="mt-1">Pending: {COMMAND_BOARD.honesty.still_being_completed.join(" · ")}</p>
        </div>
      </footer>
    </div>
  );
}

export function CommandCard({
  href,
  title,
  note,
  accent = false,
}: {
  href: string;
  title: string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        accent
          ? "block rounded-xl bg-field-dusk px-4 py-4 text-field-mist transition hover:bg-field-pine"
          : "block rounded-xl border border-field-ink/15 bg-white px-4 py-4 text-field-ink shadow-sm transition hover:border-field-pine/40"
      }
    >
      <span className={`font-fieldSans text-sm font-bold ${accent ? "text-field-wheat" : "text-field-ink"}`}>
        {title}
      </span>
      {note ? (
        <span className={`mt-1 block font-fieldSans text-sm ${accent ? "text-field-mist/85" : "text-field-ink/70"}`}>
          {note}
        </span>
      ) : null}
    </Link>
  );
}

export function CommandSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-fieldDisplay text-2xl text-field-ink">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
