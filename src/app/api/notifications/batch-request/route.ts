import { NextRequest, NextResponse } from "next/server";
import { requestNotification } from "@/lib/notifications/engine";
import { withNotifications } from "@/lib/notifications/http";

export const POST = withNotifications(async (userId, request: NextRequest) => {
  const body = await request.json();
  const requests = (body.requests ?? []) as import("@/lib/notifications/types").NotificationRequestInput[];
  const results = requests.map((r) => requestNotification(userId, r));
  return NextResponse.json({ results }, { status: 201 });
});
