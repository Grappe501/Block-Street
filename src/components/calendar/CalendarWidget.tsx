import Link from "next/link";
import type { CalendarEvent } from "@/lib/calendar";
import { EventCard } from "./EventCard";

export function CalendarWidget({
  title = "Upcoming",
  events,
  moreHref,
}: {
  title?: string;
  events: CalendarEvent[];
  moreHref?: string;
}) {
  const upcoming = events.slice(0, 5);

  return (
    <div className="rounded-xl border border-field-ink/15 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-fieldDisplay text-lg text-field-ink">{title}</h3>
        {moreHref ? (
          <Link href={moreHref} className="font-fieldSans text-xs font-semibold text-field-pine underline">
            View all
          </Link>
        ) : null}
      </div>
      <ul className="mt-3 space-y-2">
        {upcoming.length === 0 ? (
          <li className="font-fieldSans text-sm text-field-ink/60">No upcoming events in this scope.</li>
        ) : (
          upcoming.map((e) => (
            <li key={e.event_id}>
              <EventCard event={e} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
