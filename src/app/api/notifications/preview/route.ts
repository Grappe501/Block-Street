import { NextRequest, NextResponse } from "next/server";
import { evaluatePolicy } from "@/lib/notifications/policy";
import { withNotifications } from "@/lib/notifications/http";

export const POST = withNotifications(async (userId, request: NextRequest) => {
  const body = await request.json();
  const policy = evaluatePolicy({ ...body, recipient_user_id: body.recipient_user_id ?? userId });
  return NextResponse.json({ policy });
});
