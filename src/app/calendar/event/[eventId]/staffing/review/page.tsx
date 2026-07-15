import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ReviewQueueCard } from "@/components/calendar/assignments/ReviewQueueCard";
import { getEventById } from "@/lib/calendar";
import { ensureAssignmentDemoFixtures, listReviewQueue } from "@/lib/calendar/assignments";
import { ensureStaffingFromEvent } from "@/lib/calendar/staffing";

export default async function EventStaffingReviewPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureStaffingFromEvent(event);
  ensureAssignmentDemoFixtures();
  const queue = listReviewQueue({ eventId });

  return (
    <CalendarChrome title="Volunteer review" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title={`${queue.length} interests in review queue`}>
        <div className="grid gap-3 sm:grid-cols-2">{queue.map((item) => <ReviewQueueCard key={item.reviewId} item={item} eventId={eventId} />)}</div>
        {queue.length === 0 && <p className="font-fieldSans text-sm text-field-ink/70">No volunteer interests to review.</p>}
      </CalendarSection>
      <Link href={`/command/events/staffing/review`} className="font-fieldSans text-sm text-field-pine underline">Campaign review queue</Link>
    </CalendarChrome>
  );
}
