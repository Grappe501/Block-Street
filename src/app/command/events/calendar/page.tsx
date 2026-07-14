import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { listEventsForScope } from "@/lib/calendar";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Event board calendar" };

export default function CommandEventsCalendarPage() {
  const board = buildEventsBoard();
  const events = listEventsForScope({ kind: "command" }).sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <CommandChrome
      title="Event board calendar"
      subtitle={`Owned by ${board.owner.person}. Carol Eagan events lane — calendar projection.`}
      eyebrow="Volunteer Manager · events"
      backHref="/command/events"
      backLabel="Event board"
      nav={<CommandCalendarNav />}
    >
      <CommandSection title={`${events.length} events`}>
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.event_id}>
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
