import { NextResponse } from "next/server";
import { assertAuthenticated, revokeSession } from "@/lib/auth/engine";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const { id } = await params;
    const ok = revokeSession(id, session.user_id);
    if (!ok) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}
