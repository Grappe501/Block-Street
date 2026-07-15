import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";
import { allCanonicalEvents } from "@/lib/calendar/events";
import { getEventSeriesById, listEventsForSeries } from "@/lib/calendar/series";
import { describeRecurrence } from "@/lib/calendar/recurrence";
import { listSeriesExceptions } from "@/lib/calendar/recurrence/exceptions";

export default async function SeriesDetailPage({ params }: { params: Promise<{ seriesId: string }> }) {
  const { seriesId } = await params;
  const series = getEventSeriesById(seriesId);
  if (!series) notFound();
  const events = listEventsForSeries(seriesId, allCanonicalEvents());
  const exceptions = listSeriesExceptions(seriesId);
  const next = events.find((e) => new Date(e.start_at) >= new Date());

  return (
    <CalendarChrome title={series.title} subtitle={describeRecurrence(series.recurrenceRule, series.defaultStartTime)} nav={<CalendarNav />} backHref="/calendar/series" backLabel="Series">
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <dl className="mt-4 grid gap-2 font-fieldSans text-sm sm:grid-cols-2">
        <div><dt className="font-semibold">Status</dt><dd>{series.status}</dd></div>
        <div><dt className="font-semibold">Template</dt><dd>{series.templateId ?? "—"}</dd></div>
        <div><dt className="font-semibold">Occurrences</dt><dd>{events.length}</dd></div>
        <div><dt className="font-semibold">Exceptions</dt><dd>{exceptions.length}</dd></div>
      </dl>
      {next ? (
        <p className="mt-3 font-fieldSans text-sm">Next: <Link href={`/calendar/event/${next.event_id}`} className="text-field-pine underline">{next.title}</Link></p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/calendar/series/${seriesId}/instances`} className="rounded-lg border px-3 py-2 text-sm font-semibold">Instances</Link>
        <Link href={`/calendar/series/${seriesId}/exceptions`} className="rounded-lg border px-3 py-2 text-sm font-semibold">Exceptions</Link>
        <Link href={`/calendar/series/${seriesId}/edit`} className="rounded-lg border px-3 py-2 text-sm font-semibold">Edit series</Link>
      </div>
    </CalendarChrome>
  );
}
