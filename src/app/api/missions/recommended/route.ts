import { NextResponse } from "next/server";
import { getRecommendedMissions } from "@/lib/missions/engine";

export async function GET() {
  const start = Date.now();
  const missions = getRecommendedMissions();
  return NextResponse.json({ count: missions.length, missions, latencyMs: Date.now() - start });
}
