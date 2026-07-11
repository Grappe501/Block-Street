import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated, revokeMfaMethod } from "@/lib/auth/engine";
import { authErrorResponse } from "@/lib/auth/http";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ methodId: string }> }) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const { methodId } = await params;
    const ok = revokeMfaMethod(methodId, session.user_id);
    if (!ok) return NextResponse.json({ error: "Method not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return authErrorResponse(e);
  }
}
