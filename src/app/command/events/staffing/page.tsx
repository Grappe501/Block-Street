import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { getEventById, listVolunteerNeeds } from "@/lib/calendar";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Event staffing" };

export default function CommandEventsStaffingPage() {
  const board = buildEventsBoard();
  const needs = listVolunteerNeeds({ kind: "command" });

  return (
    <CommandChrome
      title="Event staffing"
      subtitle={`Owned by ${board.owner.person}. Open volunteer slots across command scope.`}
      eyebrow="Volunteer Manager · events"
      backHref="/command/events"
      backLabel="Event board"
      nav={<CommandCalendarNav />}
    >
      <CommandSection title={`${needs.length} needs`}>
        <ul className="space-y-2">
          {needs.map((n) => {
            const e = getEventById(n.event_id)!;
            return (
              <li key={n.event_id} className="rounded-xl border border-field-ink/15 bg-white px-4 py-3">
                <Link href={`/calendar/event/${n.event_id}/staffing`} className="font-fieldSans text-sm font-bold text-field-pine underline">
                  {e.title}
                </Link>
                <p className="mt-1 font-fieldSans text-xs text-field-ink/60">
                  {n.role} · {n.slots_open} open
                </p>
              </li>
            );
          })}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
