import { notFound, redirect } from "next/navigation";
import { acceptShiftOffer } from "@/lib/calendar/assignments/actions";
import { getOfferById } from "@/lib/calendar/assignments";

const DEMO = "usr-demo-001";

export default async function AcceptOfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params;
  const offer = getOfferById(offerId);
  if (!offer || offer.volunteerUserId !== DEMO) notFound();
  const result = await acceptShiftOffer(offerId, DEMO);
  redirect(result.ok ? "/calendar/my-shifts" : `/calendar/shift-offer/${offerId}`);
}
