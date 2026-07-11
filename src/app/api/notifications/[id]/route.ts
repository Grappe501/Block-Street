import { NextRequest, NextResponse } from "next/server";
import { withNotifications, notificationError } from "@/lib/notifications/http";
import { getNotificationById } from "@/lib/notifications/engine";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withNotifications((userId) => {
    const n = getNotificationById(id);
    if (!n) return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    if (n.recipient_user_id !== userId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    return NextResponse.json({ notification: n });
  });
  return handler(request).catch(notificationError);
}
