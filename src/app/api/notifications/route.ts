import { NextRequest, NextResponse } from "next/server";
import { withNotifications } from "@/lib/notifications/http";
import { getUnreadCount, listUserNotifications } from "@/lib/notifications/engine";

export const GET = withNotifications((userId, request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const unread = searchParams.get("unread") === "true";
  const category = searchParams.get("category") ?? undefined;
  const archived = searchParams.get("archived") === "true";
  const items = listUserNotifications(userId, { unread, category, archived });
  return NextResponse.json({ notifications: items, count: items.length });
});
