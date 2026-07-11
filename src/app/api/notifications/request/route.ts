import { NextRequest, NextResponse } from "next/server";
import { requestNotification } from "@/lib/notifications/engine";
import { withNotifications } from "@/lib/notifications/http";

export const POST = withNotifications(async (userId, request: NextRequest) => {
  const body = await request.json();
  const result = requestNotification(userId, body);
  return NextResponse.json(result, { status: 201 });
});
