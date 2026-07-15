import { notFound, redirect } from "next/navigation";
import { requestOfferChange } from "@/lib/calendar/assignments/actions";
import { getOfferById } from "@/lib/calendar/assignments";

const DEMO = "usr-demo-001";

export default async function RequestChangeOfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params;
  const offer = getOfferById(offerId);
  if (!offer || offer.volunteerUserId !== DEMO) notFound();
  await requestOfferChange(offerId, "Requesting alternate start time if available.", DEMO);
  redirect("/calendar/my-shift-offers");
}
