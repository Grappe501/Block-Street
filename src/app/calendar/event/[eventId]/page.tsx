import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { EventDetailView } from "@/components/calendar/EventDetailView";
import { EventOperationsPanel } from "@/components/calendar/operations/EventOperationsPanel";
import { EventSeriesPanel } from "@/components/calendar/series/EventSeriesPanel";
import { EventStaffingSummaryCard } from "@/components/calendar/staffing/EventStaffingSummaryCard";
import { EventTaskSummaryCard } from "@/components/calendar/tasks/EventTaskSummaryCard";
import { EventPreparationSummaryCard } from "@/components/calendar/preparation/EventPreparationSummaryCard";
import { EventReportSummaryCard } from "@/components/calendar/followup/ReportChecklistTable";
import { EventRsvpSummaryCard, EventVerificationSummaryCard } from "@/components/calendar/attendance/AttendancePanels";
import { EventCandidateSummaryCard } from "@/components/calendar/candidate/CandidatePanels";
import { EventLifecycleSummaryCard } from "@/components/calendar/lifecycle/LifecyclePanels";
import { getEventById } from "@/lib/calendar";
import { buildEventOperationsSummary } from "@/lib/calendar/operations";
import { calculateEventStaffingSummary, ensureStaffingFromEvent } from "@/lib/calendar/staffing";
import { buildTaskChecklistSummary, ensureTasksFromEvent } from "@/lib/calendar/tasks";
import { buildPreparationSummary, ensurePreparationFromEvent } from "@/lib/calendar/preparation";
import { buildFollowUpSummary, ensureFollowUpFromEvent } from "@/lib/calendar/followup";
import { buildRsvpSummary, ensureRsvpFromEvent } from "@/lib/calendar/rsvp";
import { buildVerificationSummary, ensureVerificationFromEvent } from "@/lib/calendar/verification";
import { buildCandidateSummary, ensureCandidateRequestFromEvent } from "@/lib/calendar/candidate-request";
import { buildLifecycleSummary, ensureLifecycleFromEvent } from "@/lib/calendar/lifecycle";

export const metadata = { title: "Calendar · Event" };

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  const ops = buildEventOperationsSummary(event);
  ensureStaffingFromEvent(event);
  ensureTasksFromEvent(event);
  const staffing = calculateEventStaffingSummary(eventId);
  const tasks = buildTaskChecklistSummary(eventId);
  ensurePreparationFromEvent(event);
  const preparation = buildPreparationSummary(eventId);
  ensureFollowUpFromEvent(event);
  const followUp = buildFollowUpSummary(eventId);
  ensureRsvpFromEvent(event);
  const rsvp = buildRsvpSummary(eventId);
  ensureVerificationFromEvent(event);
  const verification = buildVerificationSummary(eventId);
  ensureCandidateRequestFromEvent(event);
  const candidate = buildCandidateSummary(eventId, event.kelly_attendance_status ?? "not_requested");
  ensureLifecycleFromEvent(event);
  const lifecycle = buildLifecycleSummary(eventId, event.operational_status, event.approval_status);

  return (
    <CalendarChrome title={event.title} subtitle="Event detail from canonical catalog." backHref="/calendar/list">
      <CalendarHonestyBanner />
      <div className="space-y-6">
        <EventOperationsPanel summary={ops} />
        <EventStaffingSummaryCard summary={staffing} eventId={eventId} />
        <EventTaskSummaryCard summary={tasks} eventId={eventId} />
        <EventPreparationSummaryCard summary={preparation} eventId={eventId} />
        <EventReportSummaryCard summary={followUp} eventId={eventId} />
        <EventRsvpSummaryCard summary={rsvp} eventId={eventId} />
        <EventVerificationSummaryCard summary={verification} eventId={eventId} />
        <EventCandidateSummaryCard summary={candidate} eventId={eventId} />
        <EventLifecycleSummaryCard summary={lifecycle} eventId={eventId} />
        <EventSeriesPanel event={event} />
        <EventDetailView event={event} mode="internal" />
      </div>
    </CalendarChrome>
  );
}
