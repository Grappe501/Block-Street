import { NextRequest, NextResponse } from "next/server";
import { getUserPreferences, updateUserPreferences } from "@/lib/notifications/engine";
import { withNotifications } from "@/lib/notifications/http";

export const GET = withNotifications((userId) => {
  return NextResponse.json({ preferences: getUserPreferences(userId) });
});

export const PATCH = withNotifications(async (userId, request: NextRequest) => {
  const body = await request.json();
  const prefs = updateUserPreferences(userId, body.preferences ?? []);
  return NextResponse.json({ preferences: prefs });
});
