import { notFound, redirect } from "next/navigation";
import { declineShiftOffer } from "@/lib/calendar/assignments/actions";
import { getOfferById } from "@/lib/calendar/assignments";

const DEMO = "usr-demo-001";

export default async function DeclineOfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params;
  const offer = getOfferById(offerId);
  if (!offer || offer.volunteerUserId !== DEMO) notFound();
  await declineShiftOffer(offerId, "no_longer_available", DEMO);
  redirect("/calendar/my-shift-offers");
}
