import { NextRequest, NextResponse } from "next/server";
import { getHealthDashboard, listRelationships } from "@/lib/relationships/engine";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const params = request.nextUrl.searchParams;
  const health = params.get("health") || undefined;
  const county = params.get("county") || undefined;
  const type = params.get("type") || undefined;
  const limit = Math.min(parseInt(params.get("limit") || "50", 10), 100);

  const relationships = listRelationships({ health, county, type, limit });
  const dashboard = getHealthDashboard();
  return NextResponse.json({
    count: relationships.length,
    dashboard,
    relationships,
    latencyMs: Date.now() - start,
  });
}
