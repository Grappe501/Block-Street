import { NextRequest, NextResponse } from "next/server";
import { logoutAll } from "@/lib/auth/engine";
import { assertAuthenticated } from "@/lib/auth/engine";
import { adminAudit, assertAdminPermission, AdminError, resolveAdminContext } from "@/lib/admin/engine";

export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const ctx = resolveAdminContext(session);
    const { userId } = await params;
    assertAdminPermission(ctx, "users.revoke_sessions");
    const count = logoutAll(userId);
    adminAudit(ctx, "sessions_revoked", "user", userId, "success", { reason: "Admin revoked all sessions" });
    return NextResponse.json({ ok: true, revoked: count });
  } catch (e) {
    if (e instanceof AdminError) return NextResponse.json({ error: e.message }, { status: e.status });
    const err = e as { message?: string; status?: number };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}
