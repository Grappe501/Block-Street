import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureAssignmentDemoFixtures, listOffers, projectVolunteerSafeOffer } from "@/lib/calendar/assignments";

export default async function EventStaffingOffersPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureAssignmentDemoFixtures();
  const offers = listOffers({ eventId });

  return (
    <CalendarChrome title="Shift offers" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title={`${offers.length} offers`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {offers.map((o) => (
            <li key={o.offerId} className="rounded-lg border bg-white p-3">
              <p>{o.offeredRoleLabel} · {o.offerStatus} · volunteer {o.volunteerUserId.slice(-4)}</p>
              <p className="text-xs text-field-ink/60">Expires: {o.expiresAt ?? "—"}</p>
              <details className="mt-1 text-xs"><summary>Volunteer preview</summary><pre>{JSON.stringify(projectVolunteerSafeOffer(o, event.title), null, 2)}</pre></details>
            </li>
          ))}
        </ul>
      </CalendarSection>
      <Link href={`/command/events/staffing/offers`} className="font-fieldSans text-sm text-field-pine underline">Command offers dashboard</Link>
    </CalendarChrome>
  );
}
