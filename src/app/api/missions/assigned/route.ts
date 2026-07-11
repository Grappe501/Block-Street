import { NextRequest, NextResponse } from "next/server";
import { getAssignedMissions } from "@/lib/missions/engine";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const owner = request.nextUrl.searchParams.get("owner") || undefined;
  const missions = getAssignedMissions(owner).sort((a, b) => b.priority - a.priority);
  return NextResponse.json({ count: missions.length, missions, latencyMs: Date.now() - start });
}
