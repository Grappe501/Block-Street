import Link from "next/link";
import type { CalendarEvent } from "@/lib/calendar";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventCard({ event, href }: { event: CalendarEvent; href?: string }) {
  const link = href ?? `/calendar/event/${event.event_id}`;
  const openSlots = event.volunteer_slots_open;

  return (
    <Link
      href={link}
      className="block rounded-xl border border-field-ink/15 bg-white px-4 py-3 shadow-sm transition hover:border-field-pine/40"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-fieldSans text-sm font-bold text-field-ink">{event.title}</p>
        <span className="rounded-full bg-field-dusk px-2 py-0.5 font-fieldSans text-[10px] font-semibold uppercase tracking-wide text-field-wheat">
          {event.status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-1 font-fieldSans text-xs text-field-ink/70">{formatWhen(event.start_at)}</p>
      {event.location_name ? (
        <p className="mt-1 font-fieldSans text-xs text-field-ink/60">{event.location_name}</p>
      ) : null}
      {(event.city || event.county_slug) && (
        <p className="mt-1 font-fieldSans text-xs text-field-ink/55">
          {[event.city, event.county_slug].filter(Boolean).join(" · ")}
        </p>
      )}
      {openSlots > 0 ? (
        <p className="mt-2 font-fieldSans text-xs font-semibold text-field-pine">{openSlots} volunteer slot(s) open</p>
      ) : null}
    </Link>
  );
}
