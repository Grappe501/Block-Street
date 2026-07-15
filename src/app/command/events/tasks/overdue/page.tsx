import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { SEED_EVENTS, buildTaskChecklistSummary, ensureTasksFromEvent, listTasks } from "@/lib/calendar";
import { isTaskComplete } from "@/lib/calendar/tasks/status";

export default function CommandOverdueTasksPage() {
  const now = Date.now();
  const items: Array<{ eventId: string; title: string; taskTitle: string; dueAt: string }> = [];
  for (const e of SEED_EVENTS) {
    ensureTasksFromEvent(e);
    for (const t of listTasks({ eventId: e.event_id })) {
      if (t.dueAt && new Date(t.dueAt).getTime() < now && !isTaskComplete(t.taskStatus)) {
        items.push({ eventId: e.event_id, title: e.title, taskTitle: t.title, dueAt: t.dueAt });
      }
    }
  }

  return (
    <CommandChrome title="Overdue tasks" backHref="/command/events/tasks" backLabel="Tasks" nav={<CommandCalendarNav />}>
      <CommandSection title={`${items.length} overdue`}>
        <ul className="font-fieldSans text-sm">{items.map((i) => <li key={`${i.eventId}-${i.taskTitle}`}>{i.title} — {i.taskTitle} (due {i.dueAt})</li>)}</ul>
      </CommandSection>
    </CommandChrome>
  );
}
