import { NextRequest, NextResponse } from "next/server";
import { getMission, updateMission } from "@/lib/missions/engine";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const mission = updateMission(id, body);
  if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  return NextResponse.json({ ok: true, mission });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mission = getMission(id);
  if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  return NextResponse.json({ mission });
}
