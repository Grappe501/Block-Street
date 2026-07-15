import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { TaskSoftBetaNote } from "@/components/calendar/tasks/TaskSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureTasksFromEvent, isTaskBlockedByDependencies, listBlockingTasks } from "@/lib/calendar/tasks";

export default async function EventTaskBlockingPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureTasksFromEvent(event);
  const blocked = listBlockingTasks(eventId);

  return (
    <CalendarChrome title="Blocking tasks" subtitle={event.title} backHref={`/calendar/event/${eventId}/tasks`} backLabel="Tasks">
      <CalendarHonestyBanner />
      <TaskSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title={`${blocked.length} blocked`}>
        <ul className="font-fieldSans text-sm space-y-2">
          {blocked.map((t) => {
            const info = isTaskBlockedByDependencies(t.taskId);
            return <li key={t.taskId} className="rounded border p-2">{t.title} — {info.reasons.join(", ")}</li>;
          })}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
