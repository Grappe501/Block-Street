import { NextRequest, NextResponse } from "next/server";
import { loadCampaigns, previewCampaign } from "@/lib/notifications/engine";
import { notificationError, withNotifications } from "@/lib/notifications/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withNotifications(() => {
    const campaign = loadCampaigns().find((c) => c.id === id);
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    return NextResponse.json({ preview: previewCampaign(campaign) });
  });
  return handler(request).catch(notificationError);
}
