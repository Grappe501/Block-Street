import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { EventDetailView } from "@/components/calendar/EventDetailView";
import { getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event" };

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();

  return (
    <CalendarChrome title={event.title} subtitle="Event detail from canonical catalog." backHref="/calendar/list">
      <CalendarHonestyBanner />
      <EventDetailView event={event} />
    </CalendarChrome>
  );
}
