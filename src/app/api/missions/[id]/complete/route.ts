import { NextResponse } from "next/server";
import { completeMission } from "@/lib/missions/engine";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mission = completeMission(id);
  if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  return NextResponse.json({ ok: true, mission });
}
