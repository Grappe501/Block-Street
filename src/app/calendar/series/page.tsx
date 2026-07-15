import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";
import { listEventSeries } from "@/lib/calendar/series";
import { describeRecurrence } from "@/lib/calendar/recurrence";

export const metadata = { title: "Recurring series" };

export default function SeriesIndexPage() {
  const series = listEventSeries();
  return (
    <CalendarChrome title="Recurring series" subtitle="Session-local series — not durable until Gate A closes." nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <p className="mt-2 font-fieldSans text-xs text-field-ink/60">Generated preview limit: next 12 occurrences or 90 days.</p>
      <Link href="/calendar/templates" className="mt-3 inline-block font-fieldSans text-sm font-semibold text-field-pine underline">Browse templates →</Link>
      <ul className="mt-6 space-y-3">
        {series.length === 0 ? (
          <li className="font-fieldSans text-sm text-field-ink/60">No series in session catalog yet. Create one from a template.</li>
        ) : (
          series.map((s) => (
            <li key={s.seriesId} className="rounded-xl border bg-white p-4">
              <Link href={`/calendar/series/${s.seriesId}`} className="font-fieldSans text-sm font-bold text-field-pine">{s.title}</Link>
              <p className="mt-1 font-fieldSans text-xs text-field-ink/70">{describeRecurrence(s.recurrenceRule, s.defaultStartTime)}</p>
              <p className="font-fieldSans text-xs text-field-ink/55">Status: {s.status}</p>
            </li>
          ))
        )}
      </ul>
    </CalendarChrome>
  );
}
