import { NextRequest, NextResponse } from "next/server";
import { getSession, getUserProfile, logout } from "@/lib/auth/engine";
import { hydrateAuthStore } from "@/lib/auth/data";
import { clearSessionCookie } from "@/lib/auth/http";
import { SESSION_COOKIE } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  await hydrateAuthStore();
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const profile = getUserProfile(session.user_id, session);
  return NextResponse.json({ authenticated: true, session, profile });
}

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) logout(sessionId);
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
