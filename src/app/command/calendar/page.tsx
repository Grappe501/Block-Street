import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { CalendarWidget } from "@/components/calendar/CalendarWidget";
import { listEventsForScope } from "@/lib/calendar";
import { buildEventsBoard } from "@/lib/command/board";

export const metadata = { title: "Command calendar" };

export default function CommandCalendarHubPage() {
  const board = buildEventsBoard();
  const events = listEventsForScope({ kind: "command" });

  return (
    <CommandChrome
      title="Command calendar hub"
      subtitle="Statewide command projections and links to event board lanes."
      eyebrow="Command calendar · soft beta"
      nav={<CommandCalendarNav />}
    >
      <div className="rounded-xl bg-field-dusk p-5 text-field-mist">
        <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.14em] text-field-wheat">Event board owner</p>
        <p className="mt-1 font-fieldDisplay text-2xl text-white">{board.owner.person}</p>
      </div>
      <CommandSection title="Event board lanes">
        <div className="grid gap-3 sm:grid-cols-2">
          <CommandCard href="/command/events/calendar" title="Event board calendar" note="Primary events projection" accent />
          <CommandCard href="/command/events/pending" title="Pending" note="Awaiting approval" />
          <CommandCard href="/command/events/staffing" title="Staffing" note="Volunteer gaps" />
          <CommandCard href="/command/events/kelly-requests" title="Kelly requests" note="Candidate visits" />
        </div>
      </CommandSection>
      <CommandSection title="Upcoming (command scope)">
        <CalendarWidget events={events} moreHref="/command/events/calendar" />
      </CommandSection>
    </CommandChrome>
  );
}
