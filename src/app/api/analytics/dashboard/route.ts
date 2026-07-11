import { NextResponse } from "next/server";
import { getExecutiveDashboard, getDrillDown } from "@/lib/analytics/engine";

export async function GET() {
  const start = Date.now();
  const dashboard = getExecutiveDashboard();
  const drillDown = getDrillDown();
  return NextResponse.json({
    dashboard,
    drillDown,
    latencyMs: Date.now() - start,
  });
}
