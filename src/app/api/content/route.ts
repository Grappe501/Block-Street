import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { buildViewerContext, listPublishedContent } from "@/lib/cms/engine";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request.headers.get("cookie"));
  const viewer = buildViewerContext(session?.user_id ?? null);
  const { searchParams } = request.nextUrl;
  const content_type = searchParams.get("content_type") ?? undefined;
  const organization_id = searchParams.get("organization_id") ?? undefined;
  const items = listPublishedContent(viewer, { content_type, organization_id });
  return NextResponse.json({ items, count: items.length });
}
