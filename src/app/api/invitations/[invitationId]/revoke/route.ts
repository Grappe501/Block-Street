import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, revokeInvitation } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ invitationId: string }> }) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const { invitationId } = await params;
    const ok = revokeInvitation(invitationId, session.user_id);
    if (!ok) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return authErrorResponse(e);
  }
}
