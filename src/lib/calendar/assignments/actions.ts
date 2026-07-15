"use server";

import { redirect } from "next/navigation";
import { respondToOffer, transitionOffer } from "@/lib/calendar/assignments";

const DEMO_USER = "usr-demo-001";

export async function acceptShiftOffer(offerId: string, userId = DEMO_USER) {
  const result = respondToOffer({ offerId, volunteerUserId: userId, response: "accepted" });
  if (!result.success) return { ok: false, errors: result.blockedReasons };
  transitionOffer(offerId, "viewed", userId);
  return { ok: true, assignmentId: result.assignment?.assignmentId };
}

export async function declineShiftOffer(
  offerId: string,
  reasonKey?: string,
  userId = DEMO_USER,
) {
  respondToOffer({
    offerId,
    volunteerUserId: userId,
    response: "declined",
    declineReasonKey: reasonKey as import("@/lib/calendar/assignments").CalendarShiftOfferResponse["declineReasonKey"],
  });
  return { ok: true };
}

export async function requestOfferChange(offerId: string, note?: string, userId = DEMO_USER) {
  respondToOffer({
    offerId,
    volunteerUserId: userId,
    response: "change_requested",
    requestedChanges: { note },
  });
  return { ok: true };
}

export async function acceptAndRedirect(offerId: string) {
  const r = await acceptShiftOffer(offerId);
  redirect(r.ok ? "/calendar/my-shifts" : `/calendar/shift-offer/${offerId}`);
}
