import { NextRequest, NextResponse } from "next/server";
import { getUserConsents, updateUserConsent } from "@/lib/notifications/engine";
import { withNotifications } from "@/lib/notifications/http";

export const GET = withNotifications((userId) => {
  return NextResponse.json({ consents: getUserConsents(userId) });
});

export const PATCH = withNotifications(async (userId, request: NextRequest) => {
  const body = await request.json();
  const consent = updateUserConsent(userId, body.consent_id, body.status);
  return NextResponse.json({ consent });
});
