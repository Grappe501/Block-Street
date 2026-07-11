import { NextRequest, NextResponse } from "next/server";
import { getDashboard, listMissions } from "@/lib/missions/engine";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const params = request.nextUrl.searchParams;
  const scope = params.get("scope") || undefined;
  const status = params.get("status") || undefined;
  const county = params.get("county") || undefined;
  const limit = Math.min(parseInt(params.get("limit") || "50", 10), 100);

  const missions = listMissions({ scope, status, county, limit });
  const dashboard = getDashboard();
  return NextResponse.json({
    count: missions.length,
    dashboard,
    missions,
    latencyMs: Date.now() - start,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { createMission } = await import("@/lib/missions/engine");
  const { title, type, scope, purpose, owner, county, templateId, source } = body as {
    title: string;
    type: string;
    scope: string;
    purpose: string;
    owner: string;
    county?: string;
    templateId?: string;
    source?: string;
  };
  if (!title || !type || !scope || !purpose || !owner) {
    return NextResponse.json({ error: "title, type, scope, purpose, owner required" }, { status: 400 });
  }
  const mission = createMission({
    title,
    type: type as Parameters<typeof createMission>[0]["type"],
    scope: scope as Parameters<typeof createMission>[0]["scope"],
    purpose,
    owner,
    county,
    templateId,
    source: source as Parameters<typeof createMission>[0]["source"],
  });
  return NextResponse.json({ ok: true, mission });
}
