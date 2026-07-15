import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { EventDetailView } from "@/components/calendar/EventDetailView";
import { EventOperationsPanel } from "@/components/calendar/operations/EventOperationsPanel";
import { EventSeriesPanel } from "@/components/calendar/series/EventSeriesPanel";
import { EventStaffingSummaryCard } from "@/components/calendar/staffing/EventStaffingSummaryCard";
import { getEventById } from "@/lib/calendar";
import { buildEventOperationsSummary } from "@/lib/calendar/operations";
import { calculateEventStaffingSummary, ensureStaffingFromEvent } from "@/lib/calendar/staffing";

export const metadata = { title: "Calendar · Event" };

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  const ops = buildEventOperationsSummary(event);
  ensureStaffingFromEvent(event);
  const staffing = calculateEventStaffingSummary(eventId);

  return (
    <CalendarChrome title={event.title} subtitle="Event detail from canonical catalog." backHref="/calendar/list">
      <CalendarHonestyBanner />
      <div className="space-y-6">
        <EventOperationsPanel summary={ops} />
        <EventStaffingSummaryCard summary={staffing} eventId={eventId} />
        <EventSeriesPanel event={event} />
        <EventDetailView event={event} mode="internal" />
      </div>
    </CalendarChrome>
  );
}
