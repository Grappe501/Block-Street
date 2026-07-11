import { NextRequest, NextResponse } from "next/server";
import { snoozeNotification } from "@/lib/notifications/engine";
import { notificationError, withNotifications } from "@/lib/notifications/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withNotifications(async (userId, req) => {
    const body = await req.json();
    return NextResponse.json({ notification: snoozeNotification(userId, id, body.until) });
  });
  return handler(request).catch(notificationError);
}
