import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { EventStaffingSummaryCard } from "@/components/calendar/staffing/EventStaffingSummaryCard";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { StaffingPipelineTable } from "@/components/calendar/assignments/StaffingPipelineTable";
import { getEventById } from "@/lib/calendar";
import { ensureAssignmentDemoFixtures } from "@/lib/calendar/assignments";
import { calculateEventStaffingSummary, calculateShiftCoverage, ensureStaffingFromEvent, listActiveRequirements, listShifts } from "@/lib/calendar/staffing";

export const metadata = { title: "Calendar · Event staffing" };

export default async function EventStaffingPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureStaffingFromEvent(event);
  ensureAssignmentDemoFixtures();
  const summary = calculateEventStaffingSummary(eventId);
  const reqs = listActiveRequirements(eventId);
  const shifts = listShifts(eventId);
  const pipelineRows = shifts.map((s) => ({
    ...calculateShiftCoverage(s),
    roleLabel: s.roleLabel,
    shiftName: s.name,
    shiftId: s.shiftId,
  }));

  return (
    <CalendarChrome title={`${event.title} — Staffing`} subtitle="Volunteer shift planning — soft beta" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <div className="mt-4 space-y-6">
        <EventStaffingSummaryCard summary={summary} eventId={eventId} />
        <CalendarSection title="Staffing pipeline (stages not merged)">
          <StaffingPipelineTable rows={pipelineRows} eventId={eventId} />
        </CalendarSection>
        <CalendarSection title="Quick links">
          <div className="flex flex-wrap gap-2 font-fieldSans text-sm">
            <Link href={`/calendar/event/${eventId}/staffing/review`} className="rounded-lg border px-3 py-2 underline">Review</Link>
            <Link href={`/calendar/event/${eventId}/staffing/offers`} className="rounded-lg border px-3 py-2 underline">Offers</Link>
            <Link href={`/calendar/event/${eventId}/staffing/assignments`} className="rounded-lg border px-3 py-2 underline">Assignments</Link>
            <Link href={`/calendar/event/${eventId}/staffing/waitlist`} className="rounded-lg border px-3 py-2 underline">Waitlist</Link>
            <Link href={`/calendar/event/${eventId}/staffing/replacements`} className="rounded-lg border px-3 py-2 underline">Replacements</Link>
            <Link href={`/calendar/event/${eventId}/staffing/requirements`} className="rounded-lg border px-3 py-2 underline">Requirements ({reqs.length})</Link>
            <Link href={`/calendar/event/${eventId}/shifts`} className="rounded-lg border px-3 py-2 underline">Shifts ({shifts.length})</Link>
            <Link href={`/calendar/event/${eventId}/staffing/coverage`} className="rounded-lg border px-3 py-2 underline">Coverage</Link>
          </div>
        </CalendarSection>
      </div>
    </CalendarChrome>
  );
}
