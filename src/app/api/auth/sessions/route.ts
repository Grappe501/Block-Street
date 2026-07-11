import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, listUserSessions } from "@/lib/auth/engine";

export async function GET(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const sessions = listUserSessions(session.user_id);
    return NextResponse.json({ count: sessions.length, sessions });
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}
