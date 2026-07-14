import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { filterEvents, listEventsForScope } from "@/lib/calendar";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Completed events" };

export default function CommandEventsCompletedPage() {
  const board = buildEventsBoard();
  const events = filterEvents(listEventsForScope({ kind: "command" }), { completed: true });

  return (
    <CommandChrome
      title="Completed events"
      subtitle={`Owned by ${board.owner.person}. Past events marked complete.`}
      eyebrow="Volunteer Manager · events"
      backHref="/command/events"
      backLabel="Event board"
      nav={<CommandCalendarNav />}
    >
      <CommandSection title={`${events.length} completed`}>
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
