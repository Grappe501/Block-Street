import { NextRequest, NextResponse } from "next/server";
import { assignMission } from "@/lib/missions/engine";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { owner } = body as { owner: string };
  if (!owner) return NextResponse.json({ error: "owner required" }, { status: 400 });
  const mission = assignMission(id, owner);
  if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  return NextResponse.json({ ok: true, mission });
}
