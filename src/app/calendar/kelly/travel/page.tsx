import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { filterEvents, listEventsForScope } from "@/lib/calendar";

export const metadata = { title: "Calendar · Kelly travel" };

export default function KellyTravelPage() {
  const events = filterEvents(listEventsForScope({ kind: "command" }), { kelly_status: "confirmed" });

  return (
    <CalendarChrome
      title="Kelly travel"
      subtitle="Travel buffer shell — confirmed visits listed until travel engine ships."
      nav={<CalendarNav variant="kelly" />}
    >
      <CalendarHonestyBanner />
      <CalendarSection title="Confirmed visits (travel context)">
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
