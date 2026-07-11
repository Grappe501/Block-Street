import { NextRequest, NextResponse } from "next/server";
import { getSession, getUserProfile, logout, SESSION_COOKIE } from "@/lib/auth/engine";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const profile = getUserProfile(session.user_id);
  return NextResponse.json({ authenticated: true, session, profile });
}

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) logout(sessionId);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
