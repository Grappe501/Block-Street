import { NextRequest, NextResponse } from "next/server";
import { getUserQuietHours, updateUserQuietHours } from "@/lib/notifications/engine";
import { withNotifications } from "@/lib/notifications/http";

export const GET = withNotifications((userId) => {
  return NextResponse.json({ quiet_hours: getUserQuietHours(userId) });
});

export const PATCH = withNotifications(async (userId, request: NextRequest) => {
  const body = await request.json();
  const qh = updateUserQuietHours(userId, body);
  return NextResponse.json({ quiet_hours: qh });
});
