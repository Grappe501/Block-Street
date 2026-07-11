import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, logoutAll } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const count = logoutAll(session.user_id, session.session_id);
    return NextResponse.json({ ok: true, revoked: count });
  } catch (e) {
    return authErrorResponse(e);
  }
}
