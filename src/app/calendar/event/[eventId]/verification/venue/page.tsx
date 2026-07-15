import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ChecklistTable, VerificationSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { getEventById } from "@/lib/calendar";
import { ensureVerificationFromEvent, listVerificationRows } from "@/lib/calendar/verification";

export default async function EventVerificationVenuePage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureVerificationFromEvent(event);
  const rows = listVerificationRows(eventId, "venue");

  return (
    <CalendarChrome title="Venue verification" subtitle={event.title} backHref={`/calendar/event/${eventId}/verification`} backLabel="Verification">
      <CalendarHonestyBanner />
      <VerificationSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Venue">
        <ChecklistTable rows={rows} eventId={eventId} basePath={`/calendar/event/${eventId}/verification`} />
      </CalendarSection>
      <Link href={`/calendar/event/${eventId}/verification`} className="mt-3 inline-block font-fieldSans text-sm text-field-pine underline">All verification</Link>
    </CalendarChrome>
  );
}
