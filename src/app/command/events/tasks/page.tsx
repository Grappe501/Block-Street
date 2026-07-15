import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { TaskSoftBetaNote } from "@/components/calendar/tasks/TaskSoftBetaNote";
import { SEED_EVENTS, buildTaskChecklistSummary, ensureTasksFromEvent } from "@/lib/calendar";

export default function CommandTasksPage() {
  const summaries = SEED_EVENTS.map((e) => {
    ensureTasksFromEvent(e);
    return { event: e, summary: buildTaskChecklistSummary(e.event_id) };
  }).filter((s) => s.summary.totalTasks > 0);

  return (
    <CommandChrome title="Event tasks" subtitle="Checklist command — soft beta" backHref="/command/events" backLabel="Event Operations" nav={<CommandCalendarNav />}>
      <TaskSoftBetaNote />
      <CommandSection title="Priority views">
        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">
          <Link href="/command/events/tasks/overdue" className="rounded-lg border bg-white p-3 underline">Overdue</Link>
          <Link href="/command/events/tasks/blocking" className="rounded-lg border bg-white p-3 underline">Blocking</Link>
          <Link href="/command/events/tasks/incomplete-required" className="rounded-lg border bg-white p-3 underline">Incomplete required</Link>
        </div>
      </CommandSection>
      <CommandSection title="Events with checklists">
        <ul className="space-y-2 font-fieldSans text-sm">
          {summaries.map(({ event, summary }) => (
            <li key={event.event_id} className="rounded border bg-white p-3">
              <Link href={`/calendar/event/${event.event_id}/tasks`} className="text-field-pine underline font-bold">{event.title}</Link>
              <p className="text-field-ink/70">{summary.completeCount}/{summary.requiredCount} required · {summary.blockedCount} blocked</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
