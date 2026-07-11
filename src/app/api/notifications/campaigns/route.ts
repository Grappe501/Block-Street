import { NextRequest, NextResponse } from "next/server";
import { createCampaign } from "@/lib/notifications/engine";
import { withNotifications } from "@/lib/notifications/http";

export const POST = withNotifications(async (userId, request: NextRequest) => {
  const body = await request.json();
  const campaign = createCampaign(userId, body);
  return NextResponse.json({ campaign }, { status: 201 });
});
