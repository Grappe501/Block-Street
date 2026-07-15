import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureAssignmentDemoFixtures, listWaitlistEntries, sortWaitlistEntries } from "@/lib/calendar/assignments";

export default async function EventStaffingWaitlistPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureAssignmentDemoFixtures();
  const entries = sortWaitlistEntries(listWaitlistEntries({ eventId }));

  return (
    <CalendarChrome title="Waitlist" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Explainable waitlist order">
        <p className="mb-2 font-fieldSans text-xs text-field-ink/60">Waitlist does not count toward confirmed coverage. Volunteer identity is manager-restricted on public surfaces.</p>
        <ul className="space-y-2 font-fieldSans text-sm">
          {entries.map((w, i) => (
            <li key={w.waitlistEntryId} className="rounded-lg border bg-white p-3">
              #{i + 1} · group {w.priorityGroup} · {w.waitlistStatus} · reasons: {w.priorityReasons.join(", ")}
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
