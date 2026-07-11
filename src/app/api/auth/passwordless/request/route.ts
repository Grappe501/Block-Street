import { NextRequest, NextResponse } from "next/server";
import { requestPasswordlessLink } from "@/lib/auth/providers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body as { email: string };
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  const result = requestPasswordlessLink(email);
  if (!result) return NextResponse.json({ error: "Passwordless sign-in is not available" }, { status: 503 });
  return NextResponse.json({
    ok: true,
    message: "If an account exists for this email, a secure sign-in link has been prepared.",
    expires_at: result.expires_at,
    dev_token: process.env.NODE_ENV !== "production" ? result.token : undefined,
  });
}
