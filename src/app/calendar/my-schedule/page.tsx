import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { listMyScheduleEvents } from "@/lib/calendar";

export const metadata = { title: "Calendar · My schedule" };

export default function MySchedulePage() {
  const events = listMyScheduleEvents().sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <CalendarChrome title="My schedule" subtitle="Demo schedule for usr-demo-001 — not production identity-bound yet." nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <CalendarSection title="Your upcoming items">
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
