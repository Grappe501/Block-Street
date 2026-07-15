import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ChecklistTable, EventVerificationSummaryCard, VerificationSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { getEventById } from "@/lib/calendar";
import { buildVerificationSummary, ensureVerificationFromEvent, listVerificationRows } from "@/lib/calendar/verification";

export default async function EventVerificationPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureVerificationFromEvent(event);
  const summary = buildVerificationSummary(eventId);
  const rows = listVerificationRows(eventId);

  return (
    <CalendarChrome title="Verification" subtitle={event.title} backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <VerificationSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <div className="mt-4 space-y-4">
        <EventVerificationSummaryCard summary={summary} eventId={eventId} />
        <CalendarSection title="Verification checklist">
          <ChecklistTable rows={rows} eventId={eventId} basePath={`/calendar/event/${eventId}/verification`} />
        </CalendarSection>
        <div className="flex flex-wrap gap-2 font-fieldSans text-sm">
          <Link href={`/calendar/event/${eventId}/verification/venue`} className="underline text-field-pine">Venue</Link>
          <Link href={`/calendar/event/${eventId}/verification/compliance`} className="underline text-field-pine">Compliance</Link>
          <Link href={`/command/events/verification`} className="underline text-field-pine">Command verification</Link>
        </div>
      </div>
    </CalendarChrome>
  );
}
