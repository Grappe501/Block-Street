import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { listOffers } from "@/lib/calendar/assignments";
import { getShiftById } from "@/lib/calendar/staffing";

export default async function ShiftOffersPage({ params }: { params: Promise<{ eventId: string; shiftId: string }> }) {
  const { eventId, shiftId } = await params;
  const event = getEventById(eventId);
  const shift = getShiftById(shiftId);
  if (!event || !shift) notFound();
  const offers = listOffers({ eventId, shiftId });

  return (
    <CalendarChrome title={`Offers · ${shift.name}`} subtitle={event.title} backHref={`/calendar/event/${eventId}/shifts/${shiftId}`} backLabel="Shift">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title={`${offers.length} shift offers`}>
        <ul className="font-fieldSans text-sm space-y-2">{offers.map((o) => <li key={o.offerId} className="rounded border p-2">{o.offerStatus} · {o.offeredRoleLabel}</li>)}</ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
