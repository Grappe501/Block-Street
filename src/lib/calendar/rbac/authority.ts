import matrixJson from "../../../../data/calendar/calendar-rbac-matrix.json";
import { getCalendarPersistenceConfig } from "../persistence/config";

export type CalendarRbacAction = (typeof matrixJson.actions)[number];
export type CalendarRbacRoleKey = (typeof matrixJson.roles)[number]["role_key"];

export type CalendarActor = {
  userId?: string | null;
  role: CalendarRbacRoleKey | string;
  collegeSlugs?: string[];
  countySlugs?: string[];
  citySlugs?: string[];
};

export type CalendarResourceScope = {
  collegeSlugs?: string[];
  countySlugs?: string[];
  citySlugs?: string[];
  campaignWide?: boolean;
};

export type PermissionDecision = {
  allowed: boolean;
  role: string;
  action: string;
  mode: "audit_only" | "enforced";
  reason: string;
  scope_ok: boolean;
  enforcement_active: boolean;
  /** When audit_only, mutations must not be blocked by this helper. */
  should_block: boolean;
};

export const CALENDAR_RBAC_MATRIX = matrixJson;

export function listCalendarRbacRoles() {
  return CALENDAR_RBAC_MATRIX.roles;
}

export function getCalendarRbacRole(roleKey: string) {
  return CALENDAR_RBAC_MATRIX.roles.find((r) => r.role_key === roleKey) ?? null;
}

export function roleAllowsAction(roleKey: string, action: string): boolean {
  const role = getCalendarRbacRole(roleKey);
  if (!role) return false;
  const perms = role.permissions as Record<string, boolean>;
  return Boolean(perms[action]);
}

export function scopeAllowsActor(actor: CalendarActor, resource: CalendarResourceScope): boolean {
  const role = getCalendarRbacRole(actor.role);
  if (!role) return false;

  const geo = role.geographic_restriction;
  if (geo === "statewide" || geo === "campaign_approved_scopes" || geo === "public_only" || geo === "relevant_public_and_assigned") {
    if (geo === "public_only") return true;
    if (geo === "statewide" || geo === "campaign_approved_scopes") return true;
    // volunteer / assigned: allow if any overlap or public campaign
    if (resource.campaignWide) return true;
    return true;
  }

  if (geo === "assigned_college_only") {
    const assigned = actor.collegeSlugs ?? [];
    const needed = resource.collegeSlugs ?? [];
    if (needed.length === 0) return false;
    return needed.every((slug) => assigned.includes(slug));
  }

  if (geo === "assigned_county_only") {
    const assigned = actor.countySlugs ?? [];
    const needed = resource.countySlugs ?? [];
    if (needed.length === 0) return false;
    return needed.every((slug) => assigned.includes(slug));
  }

  if (geo === "assigned_city_only") {
    const assigned = actor.citySlugs ?? [];
    const needed = resource.citySlugs ?? [];
    if (needed.length === 0) return false;
    return needed.every((slug) => assigned.includes(slug));
  }

  if (geo === "assigned_team_scope") return true;
  return false;
}

/**
 * Evaluate a calendar permission.
 * audit_only: records decision; should_block is always false.
 * enforced: should_block mirrors !allowed — BLOCKED from use until Gate A closes.
 */
export function evaluateCalendarPermission(
  actor: CalendarActor,
  action: string,
  resource: CalendarResourceScope = {},
): PermissionDecision {
  const cfg = getCalendarPersistenceConfig();
  const mode = cfg.rbacMode;
  const roleOk = roleAllowsAction(actor.role, action);
  const scope_ok = scopeAllowsActor(actor, resource);
  const allowed = roleOk && scope_ok;

  let reason = "allowed";
  if (!getCalendarRbacRole(actor.role)) reason = "unknown_role";
  else if (!roleOk) reason = "role_lacks_action";
  else if (!scope_ok) reason = "scope_mismatch";

  const enforcement_active = mode === "enforced";
  // Hard safety: never actually block while Gate A is open / mode is audit_only.
  const should_block = enforcement_active && !allowed;

  return {
    allowed,
    role: actor.role,
    action,
    mode,
    reason,
    scope_ok,
    enforcement_active,
    should_block,
  };
}

/** Convenience: deny path for future enforced mode — throws only when should_block. */
export function assertCalendarPermission(
  actor: CalendarActor,
  action: string,
  resource: CalendarResourceScope = {},
): PermissionDecision {
  const decision = evaluateCalendarPermission(actor, action, resource);
  if (decision.should_block) {
    throw new Error(CALENDAR_RBAC_MATRIX.denial_behavior.safe_message);
  }
  return decision;
}

export function isRbacEnforcementBlocked(): boolean {
  return getCalendarPersistenceConfig().rbacMode !== "enforced";
}
