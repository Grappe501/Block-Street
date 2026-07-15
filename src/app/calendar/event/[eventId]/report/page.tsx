import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import {
  EventReportSummaryCard,
  FollowUpSoftBetaNote,
  ReportChecklistTable,
} from "@/components/calendar/followup/ReportChecklistTable";
import { getEventById } from "@/lib/calendar";
import { buildFollowUpSummary, ensureFollowUpFromEvent, listFollowUpRows } from "@/lib/calendar/followup";

export const metadata = { title: "Calendar · Event report" };

export default async function EventReportPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureFollowUpFromEvent(event);
  const summary = buildFollowUpSummary(eventId);
  const rows = listFollowUpRows(eventId);

  return (
    <CalendarChrome title={`${event.title} — Report`} subtitle="Post-event metrics and follow-up" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <FollowUpSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <div className="mt-4 space-y-4">
        <EventReportSummaryCard summary={summary} eventId={eventId} />
        <CalendarSection title="Report checklist">
          <ReportChecklistTable rows={rows} eventId={eventId} />
        </CalendarSection>
        <div className="flex flex-wrap gap-2 font-fieldSans text-sm">
          <Link href={`/calendar/event/${eventId}/report/metrics`} className="underline text-field-pine">Metrics</Link>
          <Link href={`/calendar/event/${eventId}/report/follow-up`} className="underline text-field-pine">Follow-up actions</Link>
          <Link href={`/command/events/follow-up`} className="underline text-field-pine">Command follow-up</Link>
        </div>
      </div>
    </CalendarChrome>
  );
}
