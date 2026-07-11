import { NextRequest, NextResponse } from "next/server";
import { register } from "@/lib/auth/engine";
import { requestMeta, setSessionCookie } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, display_name } = body as { email: string; password: string; display_name: string };
  if (!email || !password || !display_name) {
    return NextResponse.json({ error: "email, password, and display_name required" }, { status: 400 });
  }
  const result = register({ email, password, display_name }, requestMeta(request));
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, user_id: result.user.user_id });
  setSessionCookie(res, result.session);
  return res;
}
