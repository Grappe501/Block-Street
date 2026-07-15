import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureAssignmentDemoFixtures, listAssignments } from "@/lib/calendar/assignments";

export default async function EventStaffingAssignmentsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureAssignmentDemoFixtures();
  const assignments = listAssignments({ eventId });

  return (
    <CalendarChrome title="Assignments" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Soft-beta confirmed assignments">
        <ul className="space-y-2 font-fieldSans text-sm">
          {assignments.map((a) => (
            <li key={a.assignmentId} className="rounded-lg border bg-white p-3">
              {a.roleLabel} · {a.assignmentStatus} · softBeta={String(a.softBeta)} · durable={String(a.durableAuthority)}
            </li>
          ))}
          {assignments.length === 0 && <p className="text-field-ink/70">No assignments yet. Interest and offers do not count.</p>}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
