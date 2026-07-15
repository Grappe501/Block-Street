import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ChecklistTable } from "@/components/calendar/attendance/AttendancePanels";
import { CandidateSoftBetaNote } from "@/components/calendar/candidate/CandidatePanels";
import { getEventById } from "@/lib/calendar";
import { ensureCandidateRequestFromEvent, listCandidateRows } from "@/lib/calendar/candidate-request";

export default async function EventCandidateBriefingPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureCandidateRequestFromEvent(event);
  const rows = listCandidateRows(eventId, "briefing");

  return (
    <CalendarChrome title="Candidate briefing" subtitle={event.title} backHref={`/calendar/event/${eventId}/candidate-request`} backLabel="Candidate request">
      <CalendarHonestyBanner />
      <CandidateSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Briefing">
        <ChecklistTable rows={rows} eventId={eventId} basePath={`/calendar/event/${eventId}/candidate-request`} />
      </CalendarSection>
      <Link href={`/calendar/event/${eventId}/candidate-request`} className="mt-3 inline-block font-fieldSans text-sm text-field-pine underline">All request items</Link>
    </CalendarChrome>
  );
}
