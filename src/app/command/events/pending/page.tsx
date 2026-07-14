import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { listPendingApprovals } from "@/lib/calendar";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Pending events" };

export default function CommandEventsPendingPage() {
  const board = buildEventsBoard();
  const pending = listPendingApprovals({ kind: "command" });

  return (
    <CommandChrome
      title="Pending events"
      subtitle={`Owned by ${board.owner.person}. Proposals awaiting volunteer manager review.`}
      eyebrow="Volunteer Manager · events"
      backHref="/command/events"
      backLabel="Event board"
      nav={<CommandCalendarNav />}
    >
      <CommandSection title={`${pending.length} pending`}>
        <ul className="space-y-2">
          {pending.map((p) => (
            <li key={p.event_id} className="rounded-xl border border-field-ink/15 bg-white px-4 py-3">
              <Link href={`/calendar/event/${p.event_id}/approvals`} className="font-fieldSans text-sm font-bold text-field-pine underline">
                {p.title}
              </Link>
              <p className="mt-1 font-fieldSans text-xs text-field-ink/60">{p.proposed_by}</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
