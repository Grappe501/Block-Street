import { NextRequest, NextResponse } from "next/server";
import { verifyPasswordlessToken } from "@/lib/auth/providers";
import { requestMeta, setSessionCookie } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token } = body as { token: string };
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });
  const session = verifyPasswordlessToken(token, requestMeta(request));
  if (!session) {
    return NextResponse.json(
      { error: "We could not verify this sign-in link. It may have expired or already been used." },
      { status: 401 }
    );
  }
  const res = NextResponse.json({ ok: true, session_id: session.session_id });
  setSessionCookie(res, session);
  return res;
}
