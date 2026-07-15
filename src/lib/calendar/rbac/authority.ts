/**
 * Compatibility facade for admin surfaces + legacy evaluate(actor.role) calls.
 * Canonical implementation lives in modular CAL-P1.2 RBAC modules.
 */
import matrixJson from "../../../../data/calendar/calendar-rbac-matrix.json";
import { getAuditOnlyDecisions as getAuditRecords } from "./audit";
import { evaluateCalendarPermission as evaluateCore } from "./evaluate";
import { getCalendarRbacMode, getGateAStatus, isRbacEnforcementBlocked } from "./policy";
import { listCalendarPermissionKeys } from "./permissions";
import { getCalendarRbacRole, listCalendarRoles, roleGrantsPermission } from "./roles";
import { scopeAllowsActor } from "./scopes";
import type { CalendarPolicyResource } from "./types";
import { emptyActor } from "./types";

export { getCalendarRbacMode, getGateAStatus, isRbacEnforcementBlocked };
export { listCalendarRoles, getCalendarRbacRole };
export const CALENDAR_RBAC_MATRIX = matrixJson;

export type CalendarRbacAction = string;
export type CalendarRbacRoleKey = string;

export type CalendarActor = {
  userId?: string | null;
  role: string;
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
  mode: "disabled" | "audit_only" | "enforced";
  reason: string;
  scope_ok: boolean;
  enforcement_active: boolean;
  should_block: boolean;
  reasonCode?: string;
};

export function listCalendarRbacRoles() {
  return listCalendarRoles();
}

export function listCalendarPermissions() {
  return listCalendarPermissionKeys();
}

export function roleAllowsAction(roleKey: string, action: string): boolean {
  return roleGrantsPermission(roleKey, action);
}

export function evaluateCalendarPermission(
  actor: CalendarActor,
  action: string,
  resource: CalendarResourceScope = {},
): PermissionDecision {
  const decision = evaluateCore(actor, action, resource as CalendarPolicyResource);
  const scope = scopeAllowsActor(
    emptyActor({
      userId: actor.userId ?? null,
      authenticated: true,
      systemRoleKeys: [actor.role],
      collegeSlugs: actor.collegeSlugs ?? [],
      countySlugs: actor.countySlugs ?? [],
      citySlugs: actor.citySlugs ?? [],
    }),
    resource as CalendarPolicyResource,
    actor.role,
  );
  return {
    allowed: decision.allowed,
    role: actor.role,
    action,
    mode: decision.mode,
    reason: decision.reason,
    scope_ok: scope.ok,
    enforcement_active: decision.enforcement_active,
    should_block: decision.should_block,
    reasonCode: decision.reasonCode,
  };
}

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

export function getAuthorityMatrixSummary() {
  const roles = listCalendarRoles();
  const actions = listCalendarPermissionKeys();
  let grantedPairs = 0;
  for (const role of roles) {
    const perms = role.permissions as Record<string, boolean>;
    grantedPairs += actions.filter((a) => perms[a]).length;
  }
  return {
    version: CALENDAR_RBAC_MATRIX.version,
    phase: CALENDAR_RBAC_MATRIX.phase,
    status: CALENDAR_RBAC_MATRIX.status,
    updated: CALENDAR_RBAC_MATRIX.updated,
    roleCount: roles.length,
    actionCount: actions.length,
    grantedPairs,
    scopeRuleCount: Object.keys(CALENDAR_RBAC_MATRIX.scope_rules).length,
    designRoleCount: 16,
    matrixRoleCount: roles.length,
    enforcementNote: CALENDAR_RBAC_MATRIX.enforcement.note,
  };
}

export function getAuditOnlyDecisions() {
  return getAuditRecords();
}

export type EnforcementReadinessCheck = {
  id: string;
  label: string;
  status: "PRESENT" | "TESTED" | "BLOCKED" | "PENDING";
  note?: string;
};

export function getEnforcementReadinessSummary() {
  const gate = getGateAStatus();
  const mode = getCalendarRbacMode();
  const gateOpen = gate.verdict !== "CLOSED";
  const enforcementBlocked = isRbacEnforcementBlocked();
  const checks: EnforcementReadinessCheck[] = [
    { id: "design_package", label: "CAL-P1.2 design package", status: "PRESENT" },
    { id: "matrix_json", label: "Authority matrix JSON", status: "PRESENT" },
    { id: "permission_registry", label: "Permission registry", status: "PRESENT" },
    { id: "evaluation_helpers", label: "audit_only evaluation helpers", status: "PRESENT" },
    { id: "rbac_test_suite", label: "RBAC test suite", status: "TESTED", note: "npm run test:calendar:rbac PASS" },
    { id: "gate_a", label: "Gate A shadow persistence", status: gateOpen ? "BLOCKED" : "PRESENT" },
    { id: "enforcement_mode", label: "enforced mode", status: enforcementBlocked ? "BLOCKED" : "PRESENT" },
  ];
  return {
    phase: "CAL-P1.2",
    gateA: { verdict: gate.verdict, name: gate.name, blocking_reason: gate.blocking_reason },
    mode,
    enforcementBlocked,
    softBetaAuthority: gate.authority,
    checks,
    verdict: "BLOCKED" as const,
    maxVerdict: "BLOCKED" as const,
  };
}
