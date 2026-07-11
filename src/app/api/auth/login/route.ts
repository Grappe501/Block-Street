import { NextRequest, NextResponse } from "next/server";
import { login, SESSION_COOKIE } from "@/lib/auth/engine";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body as { email: string; password: string };
  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }
  const session = login(email, password, {
    ip: request.headers.get("x-forwarded-for") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });
  if (!session) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, session_id: session.session_id, expires_at: session.expires_at });
  res.cookies.set(SESSION_COOKIE, session.session_id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expires_at),
  });
  return res;
}
