import { NextResponse } from "next/server";
import { getMissionTimeline } from "@/lib/missions/engine";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timeline = getMissionTimeline(id);
  if (!timeline) return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  return NextResponse.json(timeline);
}
