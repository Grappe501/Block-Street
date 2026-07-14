import Link from "next/link";
import type { ReactNode } from "react";
import { CALENDAR_HONESTY } from "@/lib/calendar";

export function CalendarChrome({
  title,
  subtitle,
  eyebrow = "Calendar · soft beta",
  children,
  backHref = "/calendar/month",
  backLabel = "Calendar",
  nav,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  nav?: ReactNode;
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
          {nav ? <div className="mt-4">{nav}</div> : null}
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</div>
      <footer className="border-t border-field-ink/10 bg-white px-4 py-6">
        <div className="mx-auto max-w-4xl font-fieldSans text-xs text-field-ink/70">
          <p className="font-semibold text-field-ink">Soft beta honesty · {CALENDAR_HONESTY.status}</p>
          <p className="mt-1">Live: {CALENDAR_HONESTY.working_now.join(" · ")}</p>
          <p className="mt-1">Pending: {CALENDAR_HONESTY.still_being_completed.join(" · ")}</p>
        </div>
      </footer>
    </div>
  );
}

export function CalendarSection({
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

export function CalendarCard({
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

export function CalendarHonestyBanner() {
  return (
    <div className="rounded-xl border border-field-wheat/40 bg-field-dusk px-4 py-3 text-field-mist">
      <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.14em] text-field-wheat">Soft beta</p>
      <p className="mt-1 font-fieldSans text-sm text-field-mist/90">
        Calendar projections are read from one seed catalog. Proposals and approvals are not production-persistent yet.
      </p>
    </div>
  );
}
