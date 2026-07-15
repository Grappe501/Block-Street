import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { listLeadAssignments, listShifts } from "@/lib/calendar/staffing";

export default async function StaffingLeadsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  const shifts = listShifts(eventId);

  return (
    <CalendarChrome title="Shift leadership" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Lead assignments">
        <ul className="space-y-3">
          {shifts.map((s) => {
            const leads = listLeadAssignments(s.shiftId);
            return (
              <li key={s.shiftId} className="rounded-lg border bg-white p-3 font-fieldSans text-sm">
                <p className="font-bold">{s.name}</p>
                <p className="text-field-ink/70">{s.leadRequired ? "Lead required" : "Lead optional"}</p>
                {leads.length === 0 ? <p className="text-field-ink/60">No leads · invited ≠ accepted</p> : leads.map((l) => <p key={l.assignmentId}>{l.role} {l.userId} ({l.status})</p>)}
              </li>
            );
          })}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
