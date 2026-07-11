import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, revokeInvitation } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const body = await request.json();
    const { invitation_id } = body as { invitation_id: string };
    if (!invitation_id) return NextResponse.json({ error: "invitation_id required" }, { status: 400 });
    const ok = revokeInvitation(invitation_id, session.user_id);
    if (!ok) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return authErrorResponse(e);
  }
}
