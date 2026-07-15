import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { TaskSoftBetaNote } from "@/components/calendar/tasks/TaskSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { completeTask, ensureTasksFromEvent, getPrerequisiteTaskIds, getTaskById, isTaskBlockedByDependencies, startTask } from "@/lib/calendar/tasks";

export default async function EventTaskDetailPage({ params }: { params: Promise<{ eventId: string; taskId: string }> }) {
  const { eventId, taskId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureTasksFromEvent(event);
  const task = getTaskById(taskId);
  if (!task || task.eventId !== eventId) notFound();
  const prereqs = getPrerequisiteTaskIds(taskId);
  const block = isTaskBlockedByDependencies(taskId);

  async function markComplete() {
    "use server";
    completeTask(taskId, "usr-mgr-001", "Completed in soft beta");
  }

  async function markStarted() {
    "use server";
    startTask(taskId, "usr-mgr-001");
  }

  return (
    <CalendarChrome title={task.title} subtitle={event.title} backHref={`/calendar/event/${eventId}/tasks`} backLabel="Tasks">
      <CalendarHonestyBanner />
      <TaskSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Task record">
        <dl className="font-fieldSans text-sm space-y-1">
          <div><dt className="inline font-bold">Status: </dt><dd className="inline">{task.taskStatus}</dd></div>
          <div><dt className="inline font-bold">Required: </dt><dd className="inline">{task.required ? "Yes" : "No"}</dd></div>
          <div><dt className="inline font-bold">Due: </dt><dd className="inline">{task.dueAt ?? "—"}</dd></div>
          <div><dt className="inline font-bold">Owner: </dt><dd className="inline">{task.ownerUserId ?? "Unassigned"}</dd></div>
          <div><dt className="inline font-bold">Blocks readiness: </dt><dd className="inline">{task.blocksReadiness ? "Yes" : "No"}</dd></div>
        </dl>
        {block.blocked && <p className="mt-2 text-xs text-amber-800">{block.reasons.join(" · ")}</p>}
        <p className="mt-2 text-xs text-field-ink/60">Prerequisites: {prereqs.length}</p>
        <form action={markStarted} className="mt-3"><button type="submit" className="rounded border px-3 py-2 text-sm">Start</button></form>
        <form action={markComplete} className="mt-2"><button type="submit" className="rounded bg-field-pine px-3 py-2 text-sm text-white">Mark complete (soft beta)</button></form>
      </CalendarSection>
    </CalendarChrome>
  );
}
