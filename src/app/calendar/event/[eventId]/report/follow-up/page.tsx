import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { FollowUpSoftBetaNote, ReportChecklistTable } from "@/components/calendar/followup/ReportChecklistTable";
import { getEventById } from "@/lib/calendar";
import { ensureFollowUpFromEvent, listFollowUpRows } from "@/lib/calendar/followup";

export default async function EventReportFollowUpPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureFollowUpFromEvent(event);
  const rows = listFollowUpRows(eventId, "action");

  return (
    <CalendarChrome title="Follow-up actions" subtitle={event.title} backHref={`/calendar/event/${eventId}/report`} backLabel="Report">
      <CalendarHonestyBanner />
      <FollowUpSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Follow-up actions">
        <ReportChecklistTable rows={rows} eventId={eventId} />
      </CalendarSection>
      <Link href={`/calendar/event/${eventId}/report`} className="mt-3 inline-block font-fieldSans text-sm text-field-pine underline">
        All report items
      </Link>
    </CalendarChrome>
  );
}
