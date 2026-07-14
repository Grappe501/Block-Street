import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { getEventById, listConflicts } from "@/lib/calendar";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Event conflicts" };

export default function CommandEventsConflictsPage() {
  const board = buildEventsBoard();
  const conflicts = listConflicts();

  return (
    <CommandChrome
      title="Event conflicts"
      subtitle={`Owned by ${board.owner.person}. Detected scheduling overlaps.`}
      eyebrow="Volunteer Manager · events"
      backHref="/command/events"
      backLabel="Event board"
      nav={<CommandCalendarNav />}
    >
      <CommandSection title={`${conflicts.length} conflicts`}>
        <ul className="space-y-3">
          {conflicts.map((c) => (
            <li key={c.conflict_id} className="rounded-xl border border-field-ink/15 bg-white px-4 py-3">
              <p className="font-fieldSans text-sm font-bold">{c.summary}</p>
              <ul className="mt-2 space-y-1">
                {c.event_ids.map((id) => {
                  const e = getEventById(id);
                  return e ? (
                    <li key={id}>
                      <Link href={`/calendar/event/${id}`} className="text-field-pine underline">
                        {e.title}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
