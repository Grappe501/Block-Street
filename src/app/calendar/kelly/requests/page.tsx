import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { filterEvents, listEventsForScope } from "@/lib/calendar";

export const metadata = { title: "Calendar · Kelly requests" };

export default function KellyRequestsPage() {
  const events = filterEvents(listEventsForScope({ kind: "command" }), { kelly_status: "request" });

  return (
    <CalendarChrome title="Kelly requests" subtitle="Projection from canonical event catalog." nav={<CalendarNav variant="kelly" />}>
      <CalendarHonestyBanner />
      <CalendarSection title={`${events.length} events`}>
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
