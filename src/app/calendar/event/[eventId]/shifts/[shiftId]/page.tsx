import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { calculateShiftCoverage, getShiftById, listLeadAssignments } from "@/lib/calendar/staffing";

export default async function ShiftDetailPage({ params }: { params: Promise<{ eventId: string; shiftId: string }> }) {
  const { eventId, shiftId } = await params;
  const event = getEventById(eventId);
  const shift = getShiftById(shiftId);
  if (!event || !shift || shift.eventId !== eventId) notFound();
  const coverage = calculateShiftCoverage(shift);
  const leads = listLeadAssignments(shiftId);

  return (
    <CalendarChrome title={shift.name} subtitle={event.title} backHref={`/calendar/event/${eventId}/shifts`} backLabel="Shifts">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Shift details">
        <dl className="space-y-1 font-fieldSans text-sm">
          <div><dt className="font-semibold">Role</dt><dd>{shift.roleLabel}</dd></div>
          <div><dt className="font-semibold">Time</dt><dd>{new Date(shift.startAt).toLocaleString()} – {new Date(shift.endAt).toLocaleString()}</dd></div>
          <div><dt className="font-semibold">Capacity</dt><dd>Min {shift.minimumNeeded} · Target {shift.targetNeeded}</dd></div>
          <div><dt className="font-semibold">Coverage</dt><dd>{coverage.coverageStatus.replace(/_/g, " ")} · Confirmed {coverage.confirmedCount} · Interest {coverage.interestedCount}</dd></div>
        </dl>
        <Link href={`/calendar/event/${eventId}/shifts/${shiftId}/edit`} className="mt-3 inline-block text-sm text-field-pine underline">Edit shift</Link>
      </CalendarSection>
      <CalendarSection title="Shift leads">
        {leads.length === 0 ? <p className="font-fieldSans text-sm text-field-ink/70">No leads assigned.</p> : (
          <ul className="font-fieldSans text-sm">{leads.map((l) => <li key={l.assignmentId}>{l.role}: {l.userId} ({l.status})</li>)}</ul>
        )}
      </CalendarSection>
    </CalendarChrome>
  );
}
