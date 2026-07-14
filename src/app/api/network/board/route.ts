import { NextRequest, NextResponse } from "next/server";
import { hydrateAuthStore } from "@/lib/auth/data";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getNetworkBoard, hydrateNetworkStore } from "@/lib/network";

export async function GET(request: NextRequest) {
  await hydrateAuthStore();
  await hydrateNetworkStore();
  const session = getSessionFromRequest(request.headers.get("cookie"));
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const board = getNetworkBoard(session.user_id);
  if (!board) return NextResponse.json({ error: "Network board could not be created" }, { status: 404 });
  return NextResponse.json({ board });
}
