import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { getEventById } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event history" };

export default async function EventHistoryPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();

  return (
    <CalendarChrome title={`${event.title} — History`} subtitle="Timeline notes" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="History">
        <ul className="space-y-2">
          {event.history.map((h) => (
            <li key={h.at} className="rounded-lg border border-field-ink/15 bg-white px-3 py-2 font-fieldSans text-sm">
              <span className="text-field-ink/55">{h.at}</span> — {h.note}
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
