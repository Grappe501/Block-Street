import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { filterEvents, getWeekRange, listEventsForScope, PUBLIC_PRIVACY_COPY } from "@/lib/calendar";

export const metadata = { title: "Calendar · Week" };

export default function CalendarWeekPage() {
  const range = getWeekRange();
  const events = filterEvents(listEventsForScope({ kind: "public" }), {
    from: `${range.start}T00:00:00`,
    to: `${range.end}T23:59:59`,
  }).sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <CalendarChrome title="Week view" subtitle={PUBLIC_PRIVACY_COPY.body} nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <CalendarSection title={`Week of ${range.start}`}>
        <ul className="space-y-2">
          {events.length === 0 ? (
            <li className="font-fieldSans text-sm text-field-ink/60">No public events this week.</li>
          ) : (
            events.map((e) => (
              <li key={e.event_id}>
                <EventCard event={e} />
              </li>
            ))
          )}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
