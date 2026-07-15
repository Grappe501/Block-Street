import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureAssignmentDemoFixtures, getOfferById, projectVolunteerSafeOffer, transitionOffer } from "@/lib/calendar/assignments";

const DEMO = "usr-demo-001";

export default async function ShiftOfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params;
  ensureAssignmentDemoFixtures();
  const offer = getOfferById(offerId);
  if (!offer || offer.volunteerUserId !== DEMO) notFound();
  const event = getEventById(offer.eventId);
  if (!event) notFound();
  if (offer.offerStatus === "offered") transitionOffer(offerId, "viewed", DEMO);
  const view = projectVolunteerSafeOffer(offer, event.title, event.location_name ?? "Campus location");

  return (
    <CalendarChrome title="Shift offer" subtitle={event.title} backHref="/calendar/my-shift-offers" backLabel="My offers">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <CalendarSection title={view.role}>
        <dl className="font-fieldSans text-sm space-y-1">
          <div><dt className="inline font-bold">When: </dt><dd className="inline">{view.startAt} – {view.endAt}</dd></div>
          <div><dt className="inline font-bold">Arrival: </dt><dd className="inline">{view.arrivalAt ?? "See instructions"}</dd></div>
          <div><dt className="inline font-bold">Location: </dt><dd className="inline">{view.locationSummary}</dd></div>
          <div><dt className="inline font-bold">Expires: </dt><dd className="inline">{view.expiresAt ?? "No expiration"}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-amber-900">{view.softBetaDisclosure}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/calendar/shift-offer/${offerId}/accept`} className="rounded bg-field-pine px-4 py-2 font-fieldSans text-sm text-white">Accept</Link>
          <Link href={`/calendar/shift-offer/${offerId}/decline`} className="rounded border px-4 py-2 font-fieldSans text-sm">Decline</Link>
          <Link href={`/calendar/shift-offer/${offerId}/request-change`} className="rounded border px-4 py-2 font-fieldSans text-sm">Request change</Link>
        </div>
      </CalendarSection>
    </CalendarChrome>
  );
}
