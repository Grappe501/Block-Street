import matrix from "../../../../data/calendar/calendar-rbac-matrix.json";
import { getCalendarRbacMode, getGateAStatus, isRbacEnforcementBlocked } from "./policy";
import { isKnownPermission, isSensitivePermission, normalizePermissionKey } from "./permissions";
import { roleExplicitDenies, roleGrantsPermission } from "./roles";
import { scopeAllowsActor } from "./scopes";
import type {
  CalendarActor,
  CalendarPermissionKey,
  CalendarPolicyContext,
  CalendarPolicyDecision,
  CalendarPolicyReasonCode,
  CalendarPolicyRequest,
  CalendarPolicyResource,
  CalendarRoleKey,
} from "./types";
import { defaultPolicyContext, emptyActor } from "./types";

const PUBLIC_SENSITIVE_STRIP = [
  "private_travel_notes",
  "private_security_notes",
  "exact_arrival_time",
  "exact_departure_time",
  "unpublished_location",
  "lodging",
  "private_transportation",
  "candidate_conflict_notes",
];

function decision(
  partial: Omit<CalendarPolicyDecision, "mode" | "enforcement_active" | "should_block"> & {
    mode?: CalendarPolicyDecision["mode"];
  },
): CalendarPolicyDecision {
  const mode = partial.mode ?? getCalendarRbacMode();
  const gateClosed = getGateAStatus().verdict === "CLOSED";
  const enforcement_active = mode === "enforced" && gateClosed;
  const should_block = enforcement_active && !partial.allowed && !isRbacEnforcementBlocked();
  return {
    ...partial,
    mode,
    enforcement_active,
    should_block: Boolean(should_block && !partial.allowed),
  };
}

function requireAuth(permission: string): boolean {
  return permission !== "calendar.event.view_public";
}

function mutationOkForAccount(actor: CalendarActor, ctx: CalendarPolicyContext): boolean {
  if (!ctx.isMutation) return true;
  return actor.accountStatus === "active";
}

function publicationReady(resource: CalendarPolicyResource): boolean {
  const approval = (resource.approvalStatus ?? "").toLowerCase();
  const pub = (resource.publicationStatus ?? "").toLowerCase();
  return (approval === "approved" || approval === "campaign_approved") && (pub === "ready" || pub === "scheduled");
}

/**
 * Full policy evaluation (CAL-P1.2 decision order).
 * In audit_only / disabled / Gate A OPEN: never should_block.
 */
export function evaluatePolicy(request: CalendarPolicyRequest): CalendarPolicyDecision {
  const mode = getCalendarRbacMode();
  const actor = request.actor;
  const permission = normalizePermissionKey(request.permission);
  const resource = request.resource ?? {};
  const context = request.context ?? defaultPolicyContext();
  const roles = actor.systemRoleKeys?.length ? actor.systemRoleKeys : (["viewer"] as CalendarRoleKey[]);

  if (mode === "disabled") {
    return decision({
      allowed: false,
      reasonCode: "mode_disabled",
      reason: "CALENDAR_RBAC_MODE=disabled — operator warning; not a production default",
      matchedRoles: [],
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: true,
      sensitiveFieldsAllowed: [],
      mode,
    });
  }

  // 1. authentication
  if (requireAuth(permission) && !actor.authenticated) {
    return decision({
      allowed: false,
      reasonCode: "unauthenticated",
      reason: matrix.denial_behavior.safe_message,
      matchedRoles: [],
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: true,
      sensitiveFieldsAllowed: [],
    });
  }

  // 2. account active for mutations
  if (!mutationOkForAccount(actor, context)) {
    return decision({
      allowed: false,
      reasonCode: "account_inactive",
      reason: "Inactive, suspended, or pending accounts may not perform calendar mutations.",
      matchedRoles: roles,
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: true,
      sensitiveFieldsAllowed: [],
    });
  }

  // 3. permission registered
  if (!isKnownPermission(permission)) {
    return decision({
      allowed: false,
      reasonCode: "unknown_permission",
      reason: `Unknown permission: ${permission}`,
      matchedRoles: [],
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: true,
      sensitiveFieldsAllowed: [],
    });
  }

  // 6/8 style early denies
  if (context.selfConfirm && permission === "calendar.staffing.confirm_participant") {
    return decision({
      allowed: false,
      reasonCode: "self_confirm",
      reason: matrix.denial_behavior.messages?.staffing ?? "Volunteer self-confirmation denied.",
      matchedRoles: roles,
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: true,
      sensitiveFieldsAllowed: [],
    });
  }

  if (
    (context.separationOfDuties || resource.ownerUserId) &&
    permission === "calendar.approval.approve_campaign" &&
    actor.userId &&
    resource.ownerUserId &&
    actor.userId === resource.ownerUserId
  ) {
    return decision({
      allowed: false,
      reasonCode: "self_approval",
      reason: matrix.denial_behavior.messages?.approval ?? "Self-approval denied.",
      matchedRoles: roles,
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: true,
      sensitiveFieldsAllowed: [],
    });
  }

  // Candidate private — never infer from campaign-wide alone; require scheduler role or explicit grant
  const candidatePrivatePerms = new Set([
    "calendar.event.view_candidate_private",
    "calendar.candidate.manage_travel",
    "calendar.conflict.view_candidate_private",
  ]);
  if (candidatePrivatePerms.has(permission)) {
    const scheduler = roles.includes("candidate_scheduler") || actor.candidateScheduleAccess;
    if (!scheduler) {
      return decision({
        allowed: false,
        reasonCode: "candidate_privacy",
        reason: matrix.denial_behavior.messages?.candidate_privacy ?? "Candidate details restricted.",
        matchedRoles: roles,
        matchedScopes: [],
        missingPermissions: [permission],
        auditRequired: true,
        sensitiveFieldsAllowed: [],
      });
    }
  }

  // Publication readiness
  if (permission === "calendar.publication.publish") {
    if (!publicationReady(resource)) {
      return decision({
        allowed: false,
        reasonCode: "publication_not_ready",
        reason: matrix.denial_behavior.messages?.publication ?? "Not ready for publication.",
        matchedRoles: roles,
        matchedScopes: [],
        missingPermissions: [],
        auditRequired: true,
        sensitiveFieldsAllowed: [],
      });
    }
    if (resource.visibility && resource.visibility !== "public") {
      return decision({
        allowed: false,
        reasonCode: "publication_not_ready",
        reason: "Private/internal events cannot publish without a visibility transition.",
        matchedRoles: roles,
        matchedScopes: [],
        missingPermissions: [],
        auditRequired: true,
        sensitiveFieldsAllowed: [],
      });
    }
  }

  // Completed-event mutation
  if (
    context.isMutation &&
    (resource.operationalStatus ?? "").toLowerCase() === "completed" &&
    permission.startsWith("calendar.event.edit")
  ) {
    return decision({
      allowed: false,
      reasonCode: "state_forbidden",
      reason: "Completed events are largely immutable without correction authority.",
      matchedRoles: roles,
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: true,
      sensitiveFieldsAllowed: [],
    });
  }

  // 4–5: roles + scopes + explicit denies
  const matchedRoles: CalendarRoleKey[] = [];
  const matchedScopesAcc = [];
  let anyGrant = false;
  let anyExplicitDeny = false;

  for (const roleKey of roles) {
    if (roleExplicitDenies(roleKey).includes(permission)) {
      anyExplicitDeny = true;
      continue;
    }
    if (!roleGrantsPermission(roleKey, permission)) continue;
    const scope = scopeAllowsActor(actor, resource, roleKey);
    if (!scope.ok) continue;
    anyGrant = true;
    matchedRoles.push(roleKey);
    matchedScopesAcc.push(...scope.matched);
  }

  if (anyExplicitDeny && !anyGrant) {
    return decision({
      allowed: false,
      reasonCode: "explicit_deny",
      reason: matrix.denial_behavior.safe_message,
      matchedRoles: roles,
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: true,
      sensitiveFieldsAllowed: [],
    });
  }

  if (!anyGrant) {
    const hasRolePerm = roles.some((r) => roleGrantsPermission(r, permission));
    return decision({
      allowed: false,
      reasonCode: hasRolePerm ? "scope_mismatch" : "role_lacks_permission",
      reason: hasRolePerm
        ? matrix.denial_behavior.messages?.scope ?? "Scope mismatch."
        : matrix.denial_behavior.safe_message,
      matchedRoles: roles,
      matchedScopes: [],
      missingPermissions: [permission],
      auditRequired: isSensitivePermission(permission),
      sensitiveFieldsAllowed: [],
    });
  }

  const sensitiveFieldsAllowed =
    matchedRoles.some((r) => roleGrantsPermission(r, "calendar.event.view_candidate_private")) &&
    (actor.candidateScheduleAccess || matchedRoles.includes("candidate_scheduler"))
      ? [...PUBLIC_SENSITIVE_STRIP]
      : [];

  return decision({
    allowed: true,
    reasonCode: "allowed",
    reason: "allowed",
    matchedRoles,
    matchedScopes: matchedScopesAcc,
    missingPermissions: [],
    auditRequired: context.isMutation || isSensitivePermission(permission),
    sensitiveFieldsAllowed,
  });
}

/** Convenience overload used by scenarios and tests */
export function evaluateCalendarPermission(
  actorInput: CalendarActor | { role?: string; userId?: string | null; collegeSlugs?: string[]; countySlugs?: string[]; citySlugs?: string[]; authenticated?: boolean },
  permission: CalendarPermissionKey,
  resource: CalendarPolicyResource = {},
  context: Partial<CalendarPolicyContext> = {},
): CalendarPolicyDecision {
  let actor: CalendarActor;
  if ("systemRoleKeys" in actorInput && Array.isArray(actorInput.systemRoleKeys)) {
    actor = emptyActor(actorInput as Partial<CalendarActor>);
  } else {
    const legacy = actorInput as {
      role?: string;
      userId?: string | null;
      collegeSlugs?: string[];
      countySlugs?: string[];
      citySlugs?: string[];
      authenticated?: boolean;
      campaignWide?: boolean;
      candidateScheduleAccess?: boolean;
      publicationAccess?: boolean;
      accountStatus?: CalendarActor["accountStatus"];
    };
    actor = emptyActor({
      userId: legacy.userId ?? null,
      authenticated: legacy.authenticated ?? true,
      systemRoleKeys: [legacy.role ?? "viewer"],
      collegeSlugs: legacy.collegeSlugs ?? [],
      countySlugs: legacy.countySlugs ?? [],
      citySlugs: legacy.citySlugs ?? [],
      campaignWide: Boolean(legacy.campaignWide),
      candidateScheduleAccess: Boolean(legacy.candidateScheduleAccess),
      publicationAccess: Boolean(legacy.publicationAccess),
      accountStatus: legacy.accountStatus ?? "active",
    });
  }
  return evaluatePolicy({
    actor,
    permission,
    resource,
    context: defaultPolicyContext(context),
  });
}
