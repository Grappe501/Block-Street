import { NextResponse } from "next/server";
import { withNotifications } from "@/lib/notifications/http";
import { getUnreadCount } from "@/lib/notifications/engine";

export const GET = withNotifications((userId) => {
  return NextResponse.json({ unread_count: getUnreadCount(userId) });
});
