import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { listAssignments } from "@/lib/calendar/assignments";
import { getShiftById } from "@/lib/calendar/staffing";

export default async function ShiftAssignmentsPage({ params }: { params: Promise<{ eventId: string; shiftId: string }> }) {
  const { eventId, shiftId } = await params;
  const event = getEventById(eventId);
  const shift = getShiftById(shiftId);
  if (!event || !shift) notFound();
  const assignments = listAssignments({ shiftId });

  return (
    <CalendarChrome title={`Assignments · ${shift.name}`} subtitle={event.title} backHref={`/calendar/event/${eventId}/shifts/${shiftId}`} backLabel="Shift">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Roster (authorized managers)">
        <ul className="font-fieldSans text-sm space-y-2">
          {assignments.map((a) => (
            <li key={a.assignmentId} className="rounded border p-2">
              Volunteer {a.volunteerUserId.slice(-4)} · {a.roleLabel} · {a.assignmentStatus}
              {a.trainingConditionStatus === "pending" && " · training pending"}
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
