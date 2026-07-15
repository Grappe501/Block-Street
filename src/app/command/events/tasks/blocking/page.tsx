import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { SEED_EVENTS, ensureTasksFromEvent, listBlockingTasks } from "@/lib/calendar";

export default function CommandBlockingTasksPage() {
  const items = SEED_EVENTS.flatMap((e) => {
    ensureTasksFromEvent(e);
    return listBlockingTasks(e.event_id).map((t) => ({ event: e, task: t }));
  });

  return (
    <CommandChrome title="Blocking tasks" backHref="/command/events/tasks" backLabel="Tasks" nav={<CommandCalendarNav />}>
      <CommandSection title={`${items.length} blocked by dependencies`}>
        <ul className="font-fieldSans text-sm">{items.map(({ event, task }) => <li key={task.taskId}>{event.title} — {task.title}</li>)}</ul>
      </CommandSection>
    </CommandChrome>
  );
}
