import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { listWaitlistEntries, sortWaitlistEntries } from "@/lib/calendar/assignments";
import { getShiftById } from "@/lib/calendar/staffing";

export default async function ShiftWaitlistPage({ params }: { params: Promise<{ eventId: string; shiftId: string }> }) {
  const { eventId, shiftId } = await params;
  const event = getEventById(eventId);
  const shift = getShiftById(shiftId);
  if (!event || !shift) notFound();
  const entries = sortWaitlistEntries(listWaitlistEntries({ shiftId }));

  return (
    <CalendarChrome title={`Waitlist · ${shift.name}`} subtitle={event.title} backHref={`/calendar/event/${eventId}/shifts/${shiftId}`} backLabel="Shift">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Priority order">
        <ol className="list-decimal pl-5 font-fieldSans text-sm">{entries.map((w) => <li key={w.waitlistEntryId}>{w.priorityGroup} — {w.priorityReasons.join(", ")}</li>)}</ol>
      </CalendarSection>
    </CalendarChrome>
  );
}
