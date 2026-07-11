import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, regenerateRecoveryCodes } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const codes = regenerateRecoveryCodes(session.user_id);
    return NextResponse.json({ ok: true, codes, message: "Store these codes securely. They will not be shown again." });
  } catch (e) {
    return authErrorResponse(e);
  }
}
