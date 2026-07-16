"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { respondToOffer, transitionOffer } from "@/lib/calendar/assignments";
import { getSession, SESSION_COOKIE } from "@/lib/auth/session";
import { authorize } from "@/lib/authority/resolver";
import { scopeToken } from "@/lib/authority/types";

async function requireActorId(): Promise<string> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const session = token ? getSession(token) : null;
  if (!session?.user_id) throw new Error("Authentication required");
  return session.user_id;
}

function assertCalendarSelfPermission(actorId: string, permission: string): void {
  const decision = authorize({
    actorId,
    permission,
    resourceType: "self",
    resourceId: actorId,
    requestedScopeIds: [scopeToken("self", actorId)],
  });
  if (!decision.allowed) throw new Error("You do not have permission for this calendar action.");
}

export async function acceptShiftOffer(offerId: string, userId?: string) {
  const actorId = await requireActorId();
  if (userId && userId !== actorId) {
    throw new Error("Cannot act on behalf of another volunteer without delegation.");
  }
  assertCalendarSelfPermission(actorId, "calendar.manage");
  const result = respondToOffer({ offerId, volunteerUserId: actorId, response: "accepted" });
  if (!result.success) return { ok: false, errors: result.blockedReasons };
  transitionOffer(offerId, "viewed", actorId);
  return { ok: true, assignmentId: result.assignment?.assignmentId };
}

export async function declineShiftOffer(
  offerId: string,
  reasonKey?: string,
  userId?: string,
) {
  const actorId = await requireActorId();
  if (userId && userId !== actorId) throw new Error("Cannot act on behalf of another volunteer.");
  assertCalendarSelfPermission(actorId, "calendar.manage");
  respondToOffer({
    offerId,
    volunteerUserId: actorId,
    response: "declined",
    declineReasonKey: reasonKey as import("@/lib/calendar/assignments").CalendarShiftOfferResponse["declineReasonKey"],
  });
  return { ok: true };
}

export async function requestOfferChange(offerId: string, note?: string, userId?: string) {
  const actorId = await requireActorId();
  if (userId && userId !== actorId) throw new Error("Cannot act on behalf of another volunteer.");
  assertCalendarSelfPermission(actorId, "calendar.manage");
  respondToOffer({
    offerId,
    volunteerUserId: actorId,
    response: "change_requested",
    requestedChanges: { note },
  });
  return { ok: true };
}

export async function acceptAndRedirect(offerId: string) {
  const r = await acceptShiftOffer(offerId);
  redirect(r.ok ? "/calendar/my-shifts" : `/calendar/shift-offer/${offerId}`);
}
