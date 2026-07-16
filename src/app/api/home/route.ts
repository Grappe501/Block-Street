import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { buildPersonalHome } from "@/lib/person-home/engine";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request.headers.get("cookie"));
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const home = buildPersonalHome(session.user_id);
  if (!home) return NextResponse.json({ error: "Home could not be loaded" }, { status: 404 });
  return NextResponse.json({ home });
}
