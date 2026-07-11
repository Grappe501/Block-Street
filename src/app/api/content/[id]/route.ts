import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { buildViewerContext, canViewContent, getContentItem, toDeliveryView } from "@/lib/cms/engine";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getContentItem(id);
  if (!item) return NextResponse.json({ error: "Content not found" }, { status: 404 });
  const session = getSessionFromRequest(request.headers.get("cookie"));
  const viewer = buildViewerContext(session?.user_id ?? null);
  if (!canViewContent(item, viewer)) {
    return NextResponse.json({ error: "Content not available" }, { status: 403 });
  }
  const view = toDeliveryView(item);
  if (!view) return NextResponse.json({ error: "Version not found" }, { status: 404 });
  return NextResponse.json(view);
}
