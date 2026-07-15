import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ChecklistTable, RsvpSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { getEventById } from "@/lib/calendar";
import { buildRsvpSummary, ensureRsvpFromEvent, listRsvpRows } from "@/lib/calendar/rsvp";

export default async function EventRsvpCapacityPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureRsvpFromEvent(event);
  const summary = buildRsvpSummary(eventId);
  const rows = listRsvpRows(eventId, "plan");

  return (
    <CalendarChrome title="RSVP capacity" subtitle={event.title} backHref={`/calendar/event/${eventId}/rsvp`} backLabel="RSVP">
      <CalendarHonestyBanner />
      <RsvpSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Capacity planning">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Target: {summary.targetHeadcount ?? "not set"} · Estimated: {summary.headcountEstimate}
        </p>
        <ChecklistTable rows={rows} eventId={eventId} basePath={`/calendar/event/${eventId}/rsvp`} />
      </CalendarSection>
      <Link href={`/calendar/event/${eventId}/rsvp`} className="mt-3 inline-block font-fieldSans text-sm text-field-pine underline">Back to RSVP</Link>
    </CalendarChrome>
  );
}
