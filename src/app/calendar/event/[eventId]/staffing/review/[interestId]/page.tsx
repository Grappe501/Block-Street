import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { createDraftOffer, ensureReviewForInterest, projectVolunteerSafeReview, sendOffer, submitReview } from "@/lib/calendar/assignments";
import { getShiftById, listInterests } from "@/lib/calendar/staffing";

export default async function InterestReviewDetailPage({
  params,
}: {
  params: Promise<{ eventId: string; interestId: string }>;
}) {
  const { eventId, interestId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  const interest = listInterests({ eventId }).find((i) => i.interestId === interestId);
  if (!interest) notFound();
  const review = ensureReviewForInterest(interestId);
  if (!review) notFound();
  const safe = projectVolunteerSafeReview(review);
  const shift = review.shiftId ? getShiftById(review.shiftId) : null;

  async function markEligible() {
    "use server";
    submitReview({
      reviewId: review!.reviewId,
      reviewStatus: "eligible",
      roleEligibility: "eligible",
      reviewerUserId: "usr-mgr-001",
      reviewerRoleKey: "volunteer_manager",
      volunteerSafeExplanation: "Eligible for offered role pending offer acceptance.",
    });
  }

  async function createOffer() {
    "use server";
    if (!shift || !review) return;
    const { offer } = createDraftOffer({
      eventId,
      shiftId: shift.shiftId,
      requirementId: shift.requirementId,
      volunteerUserId: interest!.userId,
      offeredRoleKey: shift.roleKey,
      offeredRoleLabel: shift.roleLabel,
      source: "interest_review",
      offeredByUserId: "usr-mgr-001",
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
    if (offer) sendOffer(offer.offerId, "usr-mgr-001");
  }

  return (
    <CalendarChrome title="Review record" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing/review`} backLabel="Review queue">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Volunteer-safe view">
        <pre className="overflow-x-auto rounded-lg border bg-white p-3 font-mono text-xs">{JSON.stringify(safe, null, 2)}</pre>
        <p className="mt-2 font-fieldSans text-xs text-field-ink/60">Internal notes are manager-restricted and not shown here.</p>
      </CalendarSection>
      <CalendarSection title="Offer builder">
        <p className="font-fieldSans text-sm">Shift: {shift?.name ?? "—"} · Role: {shift?.roleLabel ?? "—"}</p>
        <form action={markEligible} className="mt-2"><button type="submit" className="rounded border px-3 py-2 font-fieldSans text-sm">Mark eligible</button></form>
        <form action={createOffer} className="mt-2"><button type="submit" className="rounded border bg-field-pine px-3 py-2 font-fieldSans text-sm text-white">Create and send offer (soft beta)</button></form>
        <Link href={`/calendar/event/${eventId}/staffing/offers`} className="mt-2 inline-block font-fieldSans text-sm text-field-pine underline">View offers</Link>
      </CalendarSection>
    </CalendarChrome>
  );
}
