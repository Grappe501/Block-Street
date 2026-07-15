import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { listOpenReplacementNeeds } from "@/lib/calendar/assignments";
import { getShiftById } from "@/lib/calendar/staffing";

export default async function ShiftReplacementsPage({ params }: { params: Promise<{ eventId: string; shiftId: string }> }) {
  const { eventId, shiftId } = await params;
  const event = getEventById(eventId);
  const shift = getShiftById(shiftId);
  if (!event || !shift) notFound();
  const needs = listOpenReplacementNeeds({ eventId, shiftId });

  return (
    <CalendarChrome title={`Replacements · ${shift.name}`} subtitle={event.title} backHref={`/calendar/event/${eventId}/shifts/${shiftId}`} backLabel="Shift">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Replacement needs">
        <ul className="font-fieldSans text-sm">{needs.map((n) => <li key={n.replacementNeedId}>{n.urgency} · {n.status}</li>)}</ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
