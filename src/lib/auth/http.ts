import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, sessionCookieValue } from "@/lib/auth/session";
import type { Session } from "@/lib/auth/types";

export function setSessionCookie(response: NextResponse, session: Session) {
  response.cookies.set(SESSION_COOKIE, sessionCookieValue(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expires_at),
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function requestMeta(request: NextRequest) {
  return {
    ip: request.headers.get("x-forwarded-for") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };
}

export function authErrorResponse(e: unknown) {
  const err = e as { status?: number; message?: string };
  return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
}
