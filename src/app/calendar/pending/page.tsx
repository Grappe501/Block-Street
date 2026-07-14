import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { filterEvents, listEventsForScope } from "@/lib/calendar";

export const metadata = { title: "Calendar · Pending" };

export default function CalendarPendingPage() {
  const events = filterEvents(listEventsForScope({ kind: "public" }), { pending_approval: true });

  return (
    <CalendarChrome title="Pending approvals" subtitle="Public-side view of proposals awaiting confirmation." nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <CalendarSection title={`${events.length} pending`}>
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
