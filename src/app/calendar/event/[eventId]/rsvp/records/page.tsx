import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { RsvpSoftBetaNote } from "@/components/calendar/attendance/AttendancePanels";
import { getEventById } from "@/lib/calendar";
import { ensureRsvpFromEvent, listRsvpResponses } from "@/lib/calendar/rsvp";

export default async function EventRsvpRecordsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureRsvpFromEvent(event);
  const records = listRsvpResponses({ eventId });

  return (
    <CalendarChrome title="RSVP records" subtitle={event.title} backHref={`/calendar/event/${eventId}/rsvp`} backLabel="RSVP">
      <CalendarHonestyBanner />
      <RsvpSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Responses">
        {records.length === 0 ? (
          <p className="font-fieldSans text-sm text-field-ink/70">No RSVP responses recorded yet.</p>
        ) : (
          <ul className="space-y-2 font-fieldSans text-sm">
            {records.map((r) => (
              <li key={r.responseId} className="rounded border bg-white p-3">
                {r.attendeeLabel} — {r.responseStatus} ({r.partySize})
              </li>
            ))}
          </ul>
        )}
      </CalendarSection>
      <Link href={`/calendar/event/${eventId}/rsvp`} className="mt-3 inline-block font-fieldSans text-sm text-field-pine underline">Back to RSVP</Link>
    </CalendarChrome>
  );
}
