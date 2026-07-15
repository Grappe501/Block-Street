import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { EventTaskSummaryCard } from "@/components/calendar/tasks/EventTaskSummaryCard";
import { TaskChecklistTable } from "@/components/calendar/tasks/TaskChecklistTable";
import { TaskSoftBetaNote } from "@/components/calendar/tasks/TaskSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { buildTaskChecklistSummary, ensureTasksFromEvent, generateChecklistRows } from "@/lib/calendar/tasks";

export default async function EventTasksPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureTasksFromEvent(event);
  const summary = buildTaskChecklistSummary(eventId);
  const rows = generateChecklistRows(eventId);

  return (
    <CalendarChrome title="Event tasks" subtitle={event.title} backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <TaskSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <div className="mt-4 space-y-4">
        <EventTaskSummaryCard summary={summary} eventId={eventId} />
        <CalendarSection title="Checklist">
          <TaskChecklistTable rows={rows} eventId={eventId} />
        </CalendarSection>
        <div className="flex flex-wrap gap-2 font-fieldSans text-sm">
          <Link href={`/calendar/event/${eventId}/tasks/dependencies`} className="underline text-field-pine">Dependencies</Link>
          <Link href={`/calendar/event/${eventId}/tasks/blocking`} className="underline text-field-pine">Blocking tasks</Link>
          <Link href={`/command/events/tasks`} className="underline text-field-pine">Command tasks</Link>
        </div>
      </div>
    </CalendarChrome>
  );
}
