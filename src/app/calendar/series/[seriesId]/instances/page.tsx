import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { allCanonicalEvents } from "@/lib/calendar/events";
import { getEventSeriesById, listEventsForSeries } from "@/lib/calendar/series";
import { buildEventOperationsSummary } from "@/lib/calendar/operations";
import { getExceptionForOccurrence } from "@/lib/calendar/recurrence/exceptions";

export default async function SeriesInstancesPage({ params }: { params: Promise<{ seriesId: string }> }) {
  const { seriesId } = await params;
  const series = getEventSeriesById(seriesId);
  if (!series) notFound();
  const events = listEventsForSeries(seriesId, allCanonicalEvents());

  return (
    <CalendarChrome title="Series instances" subtitle={series.title} nav={<CalendarNav />} backHref={`/calendar/series/${seriesId}`} backLabel="Series">
      <CalendarHonestyBanner />
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full font-fieldSans text-xs">
          <thead>
            <tr className="border-b text-left text-field-ink/60">
              <th className="py-2">Date</th><th>Status</th><th>Approval</th><th>Kelly</th><th>Staffing</th><th>Readiness</th><th>Exception</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              const ops = buildEventOperationsSummary(e);
              const exc = e.occurrence_key ? getExceptionForOccurrence(seriesId, e.occurrence_key) : null;
              return (
                <tr key={e.event_id} className="border-b border-field-ink/10">
                  <td className="py-2"><Link href={`/calendar/event/${e.event_id}`} className="text-field-pine underline">{new Date(e.start_at).toLocaleString()}</Link></td>
                  <td>{e.operational_status}</td>
                  <td>{e.approval_status}</td>
                  <td>{e.kelly_attendance_status}</td>
                  <td>{e.staffing_status}</td>
                  <td>{ops.overallReadiness}</td>
                  <td>{exc?.type ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 md:hidden">
        {events.map((e) => {
          const ops = buildEventOperationsSummary(e);
          return (
            <li key={e.event_id} className="rounded-xl border bg-white p-3">
              <Link href={`/calendar/event/${e.event_id}`} className="font-semibold text-field-pine">{e.title}</Link>
              <p className="text-xs text-field-ink/70">{new Date(e.start_at).toLocaleString()} · {ops.overallReadiness}</p>
            </li>
          );
        })}
      </ul>
    </CalendarChrome>
  );
}
