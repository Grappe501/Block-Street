import { NextRequest, NextResponse } from "next/server";
import { markUnread } from "@/lib/notifications/engine";
import { notificationError, withNotifications } from "@/lib/notifications/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withNotifications((userId) => NextResponse.json({ notification: markUnread(userId, id) }));
  return handler(request).catch(notificationError);
}
