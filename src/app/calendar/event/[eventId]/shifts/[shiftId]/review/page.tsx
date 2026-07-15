import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { ReviewQueueCard } from "@/components/calendar/assignments/ReviewQueueCard";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { listReviewQueue } from "@/lib/calendar/assignments";
import { getShiftById } from "@/lib/calendar/staffing";

export default async function ShiftReviewPage({ params }: { params: Promise<{ eventId: string; shiftId: string }> }) {
  const { eventId, shiftId } = await params;
  const event = getEventById(eventId);
  const shift = getShiftById(shiftId);
  if (!event || !shift || shift.eventId !== eventId) notFound();
  const queue = listReviewQueue({ eventId, shiftId });

  return (
    <CalendarChrome title={`Review · ${shift.name}`} subtitle={event.title} backHref={`/calendar/event/${eventId}/shifts/${shiftId}`} backLabel="Shift">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Shift review queue">
        <div className="grid gap-3">{queue.map((item) => <ReviewQueueCard key={item.reviewId} item={item} eventId={eventId} />)}</div>
      </CalendarSection>
    </CalendarChrome>
  );
}
