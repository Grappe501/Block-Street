import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth/providers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body as { email: string };
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  requestPasswordReset(email);
  return NextResponse.json({
    ok: true,
    message: "If an account exists for this email, password reset instructions have been sent.",
  });
}
