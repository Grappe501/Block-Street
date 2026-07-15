import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { getEventSeriesById } from "@/lib/calendar/series";
import { listSeriesExceptions } from "@/lib/calendar/recurrence/exceptions";

export default async function SeriesExceptionsPage({ params }: { params: Promise<{ seriesId: string }> }) {
  const { seriesId } = await params;
  const series = getEventSeriesById(seriesId);
  if (!series) notFound();
  const exceptions = listSeriesExceptions(seriesId);

  return (
    <CalendarChrome title="Series exceptions" subtitle={series.title} nav={<CalendarNav />} backHref={`/calendar/series/${seriesId}`} backLabel="Series">
      <CalendarHonestyBanner />
      <ul className="mt-4 space-y-2 font-fieldSans text-sm">
        {exceptions.length === 0 ? (
          <li className="text-field-ink/60">No exceptions recorded.</li>
        ) : (
          exceptions.map((ex) => (
            <li key={ex.exceptionId} className="rounded-lg border bg-white p-3">
              <p className="font-semibold">{ex.type} · {ex.occurrenceKey}</p>
              <p className="text-xs text-field-ink/70">{ex.reason}</p>
            </li>
          ))
        )}
      </ul>
    </CalendarChrome>
  );
}
