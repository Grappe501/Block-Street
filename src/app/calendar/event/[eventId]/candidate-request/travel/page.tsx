import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ChecklistTable } from "@/components/calendar/attendance/AttendancePanels";
import { CandidateSoftBetaNote } from "@/components/calendar/candidate/CandidatePanels";
import { getEventById } from "@/lib/calendar";
import { ensureCandidateRequestFromEvent, listCandidateRows } from "@/lib/calendar/candidate-request";

export default async function EventCandidateTravelPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureCandidateRequestFromEvent(event);
  const rows = listCandidateRows(eventId, "travel");

  return (
    <CalendarChrome title="Candidate travel" subtitle={event.title} backHref={`/calendar/event/${eventId}/candidate-request`} backLabel="Candidate request">
      <CalendarHonestyBanner />
      <CandidateSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Travel review">
        <p className="mb-2 font-fieldSans text-sm text-field-ink/80">
          Travel required: {event.travel_required ? "Yes" : "No"}
          {event.kelly_arrival_time ? ` · Arrival ${event.kelly_arrival_time}` : ""}
        </p>
        <ChecklistTable rows={rows} eventId={eventId} basePath={`/calendar/event/${eventId}/candidate-request`} />
      </CalendarSection>
      <Link href={`/calendar/event/${eventId}/candidate-request`} className="mt-3 inline-block font-fieldSans text-sm text-field-pine underline">All request items</Link>
    </CalendarChrome>
  );
}
