import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, verifyMfa } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const body = await request.json();
    const { code } = body as { code: string };
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
    const ok = verifyMfa(session.user_id, code);
    if (!ok) return NextResponse.json({ error: "Verification code is incorrect" }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return authErrorResponse(e);
  }
}
