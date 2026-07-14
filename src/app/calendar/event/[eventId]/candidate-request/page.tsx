import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Candidate request" };

export default async function EventCandidateRequestPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();

  return (
    <CalendarChrome title={`${event.title} — Candidate request`} subtitle="Kelly request context" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Candidate request">
        <p className="font-fieldSans text-sm text-field-ink/80">Kelly status: {event.kelly_status ?? "n/a"}</p>
      </CalendarSection>
    </CalendarChrome>
  );
}
