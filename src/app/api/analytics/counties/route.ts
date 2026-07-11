import { NextResponse } from "next/server";
import { listCounties } from "@/lib/analytics/engine";

export async function GET() {
  const start = Date.now();
  const counties = listCounties();
  return NextResponse.json({
    count: counties.length,
    counties,
    latencyMs: Date.now() - start,
  });
}
