import { NextResponse } from "next/server";
import { markAllRead } from "@/lib/notifications/engine";
import { withNotifications } from "@/lib/notifications/http";

export const POST = withNotifications((userId) => {
  return NextResponse.json(markAllRead(userId));
});
