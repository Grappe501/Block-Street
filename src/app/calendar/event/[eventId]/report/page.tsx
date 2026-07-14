import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event report" };

export default async function EventReportPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();

  return (
    <CalendarChrome title={`${event.title} — Report`} subtitle="Post-event report shell" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Report">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Soft-beta post-event report. Status: {event.status}. Production closeout not wired.
        </p>
      </CalendarSection>
    </CalendarChrome>
  );
}
