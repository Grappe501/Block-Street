import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { CalendarWidget } from "@/components/calendar/CalendarWidget";
import { filterEvents, listEventsForScope } from "@/lib/calendar";
import { buildManagersBoard } from "@/lib/command/board";

export const metadata = { title: "Managers calendar" };

export default function CommandManagersCalendarPage() {
  const board = buildManagersBoard();
  const events = filterEvents(listEventsForScope({ kind: "command" }), {
    status: ["confirmed", "scheduled", "pending_approval"],
  });

  return (
    <CommandChrome
      title="Managers calendar"
      subtitle="CM / ACM / VM oversight calendar shell."
      eyebrow="Managers · soft beta"
      backHref="/command/managers"
      backLabel="Managers"
      nav={<CommandCalendarNav />}
    >
      <div className="rounded-xl bg-field-dusk p-5 text-field-mist">
        <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.14em] text-field-wheat">Oversight</p>
        <p className="mt-1 font-fieldSans text-sm">VM: {board.volunteer_manager.person}</p>
      </div>
      <CommandSection title="Upcoming command events">
        <CalendarWidget events={events} moreHref="/command/events/calendar" />
      </CommandSection>
    </CommandChrome>
  );
}
