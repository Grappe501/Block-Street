import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { buildViewerContext, listPublishedContent } from "@/lib/cms/engine";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";
  const session = getSessionFromRequest(request.headers.get("cookie"));
  const viewer = buildViewerContext(session?.user_id ?? null);
  const items = listPublishedContent(viewer).filter((v) => {
    if (!q) return true;
    const hay = `${v.item.title} ${v.item.summary} ${v.version.title} ${v.version.summary} ${v.version.body}`.toLowerCase();
    return hay.includes(q);
  });
  return NextResponse.json({ results: items, query: q, count: items.length });
}
