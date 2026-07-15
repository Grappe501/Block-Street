import Link from "next/link";
import type { CalendarEvent } from "@/lib/calendar";
import { getEventSeriesById } from "@/lib/calendar/series";
import { describeRecurrence } from "@/lib/calendar/recurrence";

export function EventSeriesPanel({ event }: { event: CalendarEvent }) {
  if (!event.series_id) return null;
  const series = getEventSeriesById(event.series_id);
  return (
    <section className="rounded-xl border border-field-ink/15 bg-white p-4">
      <h3 className="font-fieldDisplay text-lg text-field-ink">Recurring series</h3>
      <p className="mt-1 font-fieldSans text-xs text-field-ink/60">Session-local series · soft-beta preview</p>
      <dl className="mt-3 space-y-1 font-fieldSans text-sm">
        <div><dt className="font-semibold">Series</dt><dd>{series?.title ?? event.series_id}</dd></div>
        {event.series_sequence_number != null ? (
          <div><dt className="font-semibold">Occurrence #</dt><dd>{event.series_sequence_number}</dd></div>
        ) : null}
        {series ? (
          <div><dt className="font-semibold">Recurrence</dt><dd>{describeRecurrence(series.recurrenceRule, series.defaultStartTime)}</dd></div>
        ) : null}
        {event.template_id ? (
          <div><dt className="font-semibold">Template</dt><dd>{event.template_id} v{event.template_version}</dd></div>
        ) : null}
      </dl>
      <Link href={`/calendar/series/${event.series_id}`} className="mt-3 inline-block text-sm font-semibold text-field-pine underline">
        View entire series →
      </Link>
    </section>
  );
}
