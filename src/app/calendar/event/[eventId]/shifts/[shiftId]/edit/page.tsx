import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById, getShiftById } from "@/lib/calendar";

export default async function ShiftEditPage({ params }: { params: Promise<{ eventId: string; shiftId: string }> }) {
  const { eventId, shiftId } = await params;
  const event = getEventById(eventId);
  const shift = getShiftById(shiftId);
  if (!event || !shift) notFound();
  return (
    <CalendarChrome title="Edit shift" subtitle={shift.name} backHref={`/calendar/event/${eventId}/shifts/${shiftId}`} backLabel="Shift">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <p className="font-fieldSans text-sm">Shift edit form soft-beta — completed occurrences are not rewritten.</p>
    </CalendarChrome>
  );
}
