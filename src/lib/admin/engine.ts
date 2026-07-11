import { randomBytes } from "crypto";
import { loadInvitations, loadUsers, loadOrganizations, loadWorkspaces } from "@/lib/auth/data";
import {
  appendAdminAudit,
  loadAdminFeatureFlags,
  loadApprovals,
  loadAttentionQueue,
  loadIntegrations,
  loadJobs,
  persistApprovals,
} from "./data";
import { activeAssignmentsForUser, getPermission, permissionsForRoles } from "./permissions";
import { loadRoles } from "./data";
import type { AdministrativeApproval, AdministrativeContext, AdminOverview } from "./types";
import type { Session } from "@/lib/auth/types";

export class AdminError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function resolveAdminContext(session: Session): AdministrativeContext {
  const assignments = activeAssignmentsForUser(session.user_id);
  const roleIds = assignments.map((a) => a.role_id);
  const roles = loadRoles().filter((r) => roleIds.includes(r.id));
  const effective_permissions = permissionsForRoles(roleIds);
  const scopes = assignments.map((a) => ({ type: a.scope_type, id: a.scope_id }));

  return {
    user_id: session.user_id,
    session_id: session.session_id,
    organization_id: session.active_organization_id,
    workspace_id: session.active_workspace_id,
    administrative_role_ids: roleIds,
    administrative_role_names: roles.map((r) => r.name),
    effective_permissions,
    authentication_strength: session.authentication_strength,
    elevation_state: "normal",
    elevation_expires_at: null,
    scopes,
  };
}

export function hasPermission(ctx: AdministrativeContext, permission: string): boolean {
  return ctx.effective_permissions.includes(permission);
}

export function assertAdminPermission(ctx: AdministrativeContext, permission: string): void {
  const flags = loadAdminFeatureFlags();
  if (!flags.ADMIN_CENTER_ENABLED) {
    throw new AdminError("Administration Center is not enabled", 503);
  }
  if (!hasPermission(ctx, permission)) {
    adminAudit(ctx, "permission_denied", "permission", permission, "failure", { reason: `Missing ${permission}` });
    throw new AdminError(`You do not have permission: ${permission}`, 403);
  }
}

export function assertScopeAccess(
  ctx: AdministrativeContext,
  scopeType: string,
  scopeId: string
): void {
  if (ctx.scopes.some((s) => s.type === "platform" && s.id === "platform")) return;
  if (!ctx.scopes.some((s) => s.type === scopeType && s.id === scopeId)) {
    throw new AdminError("This action is outside your administrative scope", 403);
  }
}

export function adminAudit(
  ctx: AdministrativeContext,
  action_type: string,
  target_type: string,
  target_id: string,
  result: string,
  extra?: { reason?: string; risk_level?: string; scope_type?: string; scope_id?: string }
) {
  appendAdminAudit({
    event_type: action_type,
    actor_user_id: ctx.user_id,
    action_type,
    scope_type: extra?.scope_type ?? ctx.scopes[0]?.type ?? "platform",
    scope_id: extra?.scope_id ?? ctx.scopes[0]?.id ?? "platform",
    target_type,
    target_id,
    reason: extra?.reason,
    risk_level: extra?.risk_level,
    result,
    correlation_id: ctx.session_id,
  });
}

export function getAdminOverview(ctx: AdministrativeContext): AdminOverview {
  const users = loadUsers().filter((u) => u.account_status === "active");
  const orgs = loadOrganizations();
  const workspaces = loadWorkspaces();
  const invitations = loadInvitations().filter((i) => i.status === "sent" || i.status === "created");
  const approvals = loadApprovals().filter((a) => a.status === "pending");
  const jobs = loadJobs().filter((j) => j.status === "failed");
  const integrations = loadIntegrations().filter((i) => i.health_state === "degraded" || i.health_state === "failed");

  let usersScoped = users.length;
  if (!ctx.scopes.some((s) => s.type === "platform")) {
    const orgIds = ctx.scopes.filter((s) => s.type === "organization").map((s) => s.id);
    usersScoped = users.length; // simplified — full membership filter in production
    if (orgIds.length === 1) usersScoped = Math.min(users.length, 50);
  }

  return {
    users_active: usersScoped,
    pending_invitations: invitations.length,
    organizations: ctx.scopes.some((s) => s.type === "platform") ? orgs.length : orgIdsFromContext(ctx).length,
    workspaces: workspaces.length,
    security_alerts: 0,
    failed_jobs: jobs.length,
    pending_approvals: approvals.length,
    integration_failures: integrations.length,
    platform_health: jobs.length > 0 ? "degraded" : "operational",
  };
}

function orgIdsFromContext(ctx: AdministrativeContext): string[] {
  return ctx.scopes.filter((s) => s.type === "organization").map((s) => s.id);
}

export function createApprovalRequest(input: {
  ctx: AdministrativeContext;
  action_type: string;
  target_type: string;
  target_id: string;
  reason: string;
  scope_type: string;
  scope_id: string;
}): AdministrativeApproval {
  const perm = getPermission(input.action_type.replace("_", "."));
  const approval: AdministrativeApproval = {
    id: `appr-${randomBytes(6).toString("hex")}`,
    action_type: input.action_type,
    requested_by: input.ctx.user_id,
    scope_type: input.scope_type,
    scope_id: input.scope_id,
    target_type: input.target_type,
    target_id: input.target_id,
    reason: input.reason,
    risk_level: perm?.risk_level ?? "high",
    status: "pending",
    required_approvals: 1,
    approved_by: [],
    rejected_by: null,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    executed_at: null,
  };
  const approvals = loadApprovals();
  approvals.push(approval);
  persistApprovals(approvals);
  adminAudit(input.ctx, "approval_requested", input.target_type, input.target_id, "success", {
    reason: input.reason,
    risk_level: approval.risk_level,
  });
  return approval;
}

export function approveRequest(approvalId: string, ctx: AdministrativeContext): AdministrativeApproval | null {
  assertAdminPermission(ctx, "approvals.approve");
  const approvals = loadApprovals();
  const idx = approvals.findIndex((a) => a.id === approvalId);
  if (idx < 0) return null;
  const approval = approvals[idx];
  if (approval.requested_by === ctx.user_id) {
    throw new AdminError("You cannot approve your own request", 403);
  }
  if (approval.status !== "pending") return null;
  approvals[idx] = {
    ...approval,
    status: "approved",
    approved_by: [...approval.approved_by, ctx.user_id],
  };
  persistApprovals(approvals);
  adminAudit(ctx, "approval_approved", "approval", approvalId, "success");
  return approvals[idx];
}

export { loadAttentionQueue, readAdminAudit } from "./data";
export { simulateRole, permissionsForRoles } from "./permissions";
