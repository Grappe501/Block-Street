import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event edit" };

export default async function EventEditPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();

  return (
    <CalendarChrome title={`${event.title} — Edit`} subtitle="Edit shell" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Edit">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Soft-beta edit surface. Production edit form not wired. Event: {event.event_id}
        </p>
      </CalendarSection>
    </CalendarChrome>
  );
}
