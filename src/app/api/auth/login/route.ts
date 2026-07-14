import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth/engine";
import { hydrateAuthStore } from "@/lib/auth/data";
import { requestMeta, setSessionCookie } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  try {
    await hydrateAuthStore();
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };
    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, { status: 400 });
    }
    const session = login(email.trim(), password, {
      ip: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
    if (!session) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, session_id: session.session_id, expires_at: session.expires_at });
    setSessionCookie(res, session);
    return res;
  } catch (e) {
    console.error("login_error", e);
    return NextResponse.json({ error: "Login failed — please try again" }, { status: 500 });
  }
}
