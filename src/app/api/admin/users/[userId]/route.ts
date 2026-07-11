import { NextRequest, NextResponse } from "next/server";
import { getUserById, getUserProfile, logoutAll, resolveMemberships } from "@/lib/auth/engine";
import { loadUsers, persistUsers } from "@/lib/auth/data";
import { withAdmin } from "@/lib/admin/http";
import { adminAudit, assertAdminPermission } from "@/lib/admin/engine";

async function getHandler(ctx: Awaited<ReturnType<typeof import("@/lib/admin/engine").resolveAdminContext>>, userId: string) {
  assertAdminPermission(ctx, "users.view");
  const user = getUserById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const { password_hash: _, mfa_secret: __, ...safe } = user;
  return NextResponse.json({ user: safe, memberships: resolveMemberships(userId), profile: getUserProfile(userId) });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const { assertAuthenticated } = await import("@/lib/auth/engine");
  const { resolveAdminContext } = await import("@/lib/admin/engine");
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const ctx = resolveAdminContext(session);
    return getHandler(ctx, userId);
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const { assertAuthenticated } = await import("@/lib/auth/engine");
  const { resolveAdminContext, assertAdminPermission, adminAudit } = await import("@/lib/admin/engine");
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const ctx = resolveAdminContext(session);
    assertAdminPermission(ctx, "users.suspend");
    const body = await request.json();
    const { account_status, reason } = body as { account_status: string; reason: string };
    const users = loadUsers();
    const idx = users.findIndex((u) => u.user_id === userId);
    if (idx < 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    users[idx] = { ...users[idx], account_status: account_status as (typeof users)[number]["account_status"], updated_at: new Date().toISOString() };
    persistUsers(users);
    if (account_status === "suspended") logoutAll(userId);
    adminAudit(ctx, "user_status_changed", "user", userId, "success", { reason, risk_level: "high" });
    return NextResponse.json({ ok: true, user_id: userId, account_status });
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}
