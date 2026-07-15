import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ChecklistTable, EventRsvpSummaryCard, RsvpSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { getEventById } from "@/lib/calendar";
import { buildRsvpSummary, ensureRsvpFromEvent, listRsvpRows } from "@/lib/calendar/rsvp";

export default async function EventRsvpPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureRsvpFromEvent(event);
  const summary = buildRsvpSummary(eventId);
  const rows = listRsvpRows(eventId);

  return (
    <CalendarChrome title="RSVP" subtitle={event.title} backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <RsvpSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <div className="mt-4 space-y-4">
        <EventRsvpSummaryCard summary={summary} eventId={eventId} />
        <CalendarSection title="RSVP checklist">
          <ChecklistTable rows={rows} eventId={eventId} basePath={`/calendar/event/${eventId}/rsvp`} />
        </CalendarSection>
        <div className="flex flex-wrap gap-2 font-fieldSans text-sm">
          <Link href={`/calendar/event/${eventId}/rsvp/records`} className="underline text-field-pine">Records</Link>
          <Link href={`/calendar/event/${eventId}/rsvp/capacity`} className="underline text-field-pine">Capacity</Link>
          <Link href={`/command/events/rsvp`} className="underline text-field-pine">Command RSVP</Link>
        </div>
      </div>
    </CalendarChrome>
  );
}
