import { NextRequest, NextResponse } from "next/server";
import { completePasswordReset } from "@/lib/auth/providers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, reset_token } = body as { email: string; password: string; reset_token: string };
  if (!email || !password || !reset_token) {
    return NextResponse.json({ error: "email, password, and reset_token required" }, { status: 400 });
  }
  const ok = completePasswordReset(email, password, reset_token);
  if (!ok) return NextResponse.json({ error: "Unable to reset password" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
