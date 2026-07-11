import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, enrollMfa } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const body = await request.json().catch(() => ({}));
    const { label } = body as { label?: string };
    const { secret, method } = enrollMfa(session.user_id, label ?? "Authenticator");
    return NextResponse.json({
      ok: true,
      method,
      secret,
      message: "Add this secret to your authenticator app. Verify with POST /api/auth/mfa/verify",
    });
  } catch (e) {
    return authErrorResponse(e);
  }
}
