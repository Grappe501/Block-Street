import { NextResponse } from "next/server";
import { getMissionAnalytics } from "@/lib/missions/engine";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analytics = getMissionAnalytics(id);
  return NextResponse.json({ missionId: id, analytics });
}
