import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { SEED_EVENTS, buildTaskChecklistSummary, ensureTasksFromEvent } from "@/lib/calendar";

export default function CommandIncompleteRequiredPage() {
  const items = SEED_EVENTS.map((e) => {
    ensureTasksFromEvent(e);
    return { event: e, summary: buildTaskChecklistSummary(e.event_id) };
  }).filter((x) => x.summary.incompleteRequiredCount > 0);

  return (
    <CommandChrome title="Incomplete required tasks" backHref="/command/events/tasks" backLabel="Tasks" nav={<CommandCalendarNav />}>
      <CommandSection title={`${items.length} events`}>
        <ul className="font-fieldSans text-sm">
          {items.map(({ event, summary }) => (
            <li key={event.event_id}>{event.title} — {summary.incompleteRequiredCount} incomplete required</li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
