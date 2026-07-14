import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { EventCard } from "@/components/calendar/EventCard";
import { getEventById, listKellyRequests } from "@/lib/calendar";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Kelly requests" };

export default function CommandEventsKellyRequestsPage() {
  const board = buildEventsBoard();
  const items = listKellyRequests({ kind: "command" });

  return (
    <CommandChrome
      title="Kelly requests"
      subtitle={`Owned by ${board.owner.person}. Candidate visit requests and holds.`}
      eyebrow="Volunteer Manager · events"
      backHref="/command/events"
      backLabel="Event board"
      nav={<CommandCalendarNav />}
    >
      <CommandSection title={`${items.length} Kelly items`}>
        <ul className="space-y-2">
          {items.map((k) => (
            <li key={k.event_id}>
              <EventCard event={getEventById(k.event_id)!} />
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
