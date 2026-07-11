import { NextResponse } from "next/server";
import { getDashboard, getTodaysMissions } from "@/lib/missions/engine";

export async function GET() {
  const start = Date.now();
  const missions = getTodaysMissions().sort((a, b) => b.priority - a.priority);
  return NextResponse.json({
    count: missions.length,
    dashboard: getDashboard(),
    missions,
    latencyMs: Date.now() - start,
  });
}
