import { NextResponse } from "next/server";
import { getMissionAnalytics, getWarehouseStats } from "@/lib/analytics/engine";

export async function GET() {
  return NextResponse.json({
    missions: getMissionAnalytics(),
    warehouse: getWarehouseStats(),
    exportFormats: ["PDF", "Excel", "CSV", "PowerPoint", "InteractiveWeb"],
    note: "Scheduled report generation — architecture ready",
  });
}
