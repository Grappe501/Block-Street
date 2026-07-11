import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { loadAssignments, persistAssignments } from "@/lib/admin/data";
import { loadRoles } from "@/lib/admin/data";
import { withAdmin } from "@/lib/admin/http";
import { adminAudit, assertAdminPermission, assertScopeAccess, createApprovalRequest } from "@/lib/admin/engine";
import { getPermission } from "@/lib/admin/permissions";

export const POST = withAdmin(async (ctx, request) => {
  assertAdminPermission(ctx, "roles.assign");
  const body = await request.json();
  const { user_id, role_id, scope_type, scope_id, reason, expires_at } = body as {
    user_id: string;
    role_id: string;
    scope_type: string;
    scope_id: string;
    reason: string;
    expires_at?: string;
  };
  assertScopeAccess(ctx, scope_type, scope_id);
  const role = loadRoles().find((r) => r.id === role_id);
  if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

  const perm = getPermission("roles.assign");
  if (perm?.requires_approval) {
    const approval = createApprovalRequest({
      ctx,
      action_type: "roles.assign",
      target_type: "user",
      target_id: user_id,
      reason,
      scope_type,
      scope_id,
    });
    return NextResponse.json({ status: "pending_approval", approval_id: approval.id });
  }

  const assignment = {
    id: `assign-${randomBytes(6).toString("hex")}`,
    user_id,
    role_id,
    scope_type,
    scope_id,
    assigned_by: ctx.user_id,
    reason,
    starts_at: new Date().toISOString(),
    expires_at: expires_at ?? null,
    status: "active",
    created_at: new Date().toISOString(),
  };
  const assignments = loadAssignments();
  assignments.push(assignment);
  persistAssignments(assignments);
  adminAudit(ctx, "role_assigned", "user", user_id, "success", { reason, scope_type, scope_id });
  return NextResponse.json({ ok: true, assignment });
});
