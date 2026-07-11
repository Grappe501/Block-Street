import { NextRequest, NextResponse } from "next/server";
import { suggest } from "@/lib/search/engine";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const q = request.nextUrl.searchParams.get("q") || "";
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "8", 10), 20);
  const suggestions = suggest(q, limit);
  return NextResponse.json({
    query: q,
    suggestions,
    latencyMs: Date.now() - start,
  });
}
