import { NextRequest, NextResponse } from "next/server";
import { listRecommendations } from "@/lib/recommendations/engine";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const params = request.nextUrl.searchParams;
  const category = params.get("category") || undefined;
  const county = params.get("county") || undefined;
  const limit = Math.min(parseInt(params.get("limit") || "25", 10), 100);

  const results = listRecommendations({ category, county, limit });
  return NextResponse.json({
    count: results.length,
    latencyMs: Date.now() - start,
    recommendations: results,
  });
}
