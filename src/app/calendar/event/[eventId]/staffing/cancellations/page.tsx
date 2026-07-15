import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureAssignmentDemoFixtures, listCancellations } from "@/lib/calendar/assignments";

export default async function EventStaffingCancellationsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureAssignmentDemoFixtures();
  const items = listCancellations({ eventId });

  return (
    <CalendarChrome title="Cancellations" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Cancellation requests">
        <ul className="space-y-2 font-fieldSans text-sm">
          {items.map((c) => (
            <li key={c.cancellationId} className="rounded-lg border bg-white p-3">
              {c.cancellationStatus} · {c.reasonKey} · replacement {c.replacementRequired ? "required" : "optional"}
            </li>
          ))}
          {items.length === 0 && <p className="text-field-ink/70">No cancellations on record.</p>}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
