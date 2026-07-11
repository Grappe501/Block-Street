import { NextRequest, NextResponse } from "next/server";
import { acceptInvitation, assertAuthenticated } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const { token } = await params;
    const result = acceptInvitation(token, session.user_id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, invitation: result.invitation });
  } catch (e) {
    return authErrorResponse(e);
  }
}
