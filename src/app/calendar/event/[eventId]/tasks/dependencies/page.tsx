import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { TaskSoftBetaNote } from "@/components/calendar/tasks/TaskSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureTasksFromEvent, listDependencies, listTasks } from "@/lib/calendar/tasks";

export default async function EventTaskDependenciesPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureTasksFromEvent(event);
  const deps = listDependencies({ eventId });
  const tasks = listTasks({ eventId });

  return (
    <CalendarChrome title="Task dependencies" subtitle={event.title} backHref={`/calendar/event/${eventId}/tasks`} backLabel="Tasks">
      <CalendarHonestyBanner />
      <TaskSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title={`${deps.length} dependencies`}>
        <ul className="font-fieldSans text-sm space-y-2">
          {deps.map((d) => {
            const from = tasks.find((t) => t.taskId === d.fromTaskId);
            const to = tasks.find((t) => t.taskId === d.toTaskId);
            return (
              <li key={d.dependencyId} className="rounded border p-2">
                {from?.title ?? d.fromTaskId} → {to?.title ?? d.toTaskId} ({d.dependencyType})
              </li>
            );
          })}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
