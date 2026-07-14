import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { listEventsForScope, PUBLIC_PRIVACY_COPY } from "@/lib/calendar";

export const metadata = { title: "Calendar · List" };

export default function CalendarListPage() {
  const events = listEventsForScope({ kind: "public" }).sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <CalendarChrome title="List view" subtitle={PUBLIC_PRIVACY_COPY.body} nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <CalendarSection title={`${events.length} public events`}>
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.event_id}>
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
