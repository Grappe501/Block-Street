import { randomBytes } from "crypto";
import { loadAppointments, loadRolePermissions, appendDenialAudit } from "./data";
import { appointmentCoversRequested, expandAppointmentScopes, institutionCounty } from "./scope";
import type {
  AuthorizationDecision,
  AuthorizationRequest,
  LeadershipAppointment,
} from "./types";
import { scopeToken } from "./types";

function permissionsForRole(roleKey: string): string[] {
  return loadRolePermissions().find((r) => r.role_key === roleKey)?.permissions ?? [];
}

function activeAppointments(actorId: string): LeadershipAppointment[] {
  const now = Date.now();
  return loadAppointments().filter((a) => {
    if (a.user_id !== actorId) return false;
    if (a.status !== "active") return false;
    if (a.expires_at && new Date(a.expires_at).getTime() < now) return false;
    if (new Date(a.starts_at).getTime() > now) return false;
    return true;
  });
}

function normalizeRequestedScopes(req: AuthorizationRequest): string[] {
  const scopes = [...req.requestedScopeIds];
  if (scopes.length === 0 && req.resourceType === "self") {
    scopes.push(scopeToken("self", req.actorId));
  }
  for (const token of [...scopes]) {
    const institutionPrefix = "institution:";
    if (token.startsWith(institutionPrefix)) {
      const instId = token.slice(institutionPrefix.length);
      const county = institutionCounty(instId);
      if (county) scopes.push(scopeToken("county", county));
    }
  }
  return [...new Set(scopes)];
}

function logDenial(req: AuthorizationRequest, reasonCode: AuthorizationDecision["reasonCode"]): void {
  appendDenialAudit({
    id: `deny-${randomBytes(6).toString("hex")}`,
    actor_id: req.actorId,
    route: req.route ?? null,
    method: req.method ?? null,
    permission_requested: req.permission,
    scope_requested: req.requestedScopeIds,
    resource_type: req.resourceType,
    resource_id: req.resourceId ?? null,
    reason_code: reasonCode,
    correlation_id: req.correlationId ?? null,
  });
}

/**
 * Scope-aware authorization: Actor + Permission + Resource + Scope.
 */
export function authorize(req: AuthorizationRequest): AuthorizationDecision {
  const requestedScopes = normalizeRequestedScopes(req);
  const appointments = activeAppointments(req.actorId);

  if (appointments.length === 0) {
    const decision: AuthorizationDecision = {
      allowed: false,
      permission: req.permission,
      actorId: req.actorId,
      resourceType: req.resourceType,
      resourceId: req.resourceId,
      authorizedScopeIds: [],
      matchedRoleIds: [],
      reasonCode: "inactive_appointment",
    };
    logDenial(req, "inactive_appointment");
    return decision;
  }

  const matched: LeadershipAppointment[] = [];
  const authorizedScopeIds = new Set<string>();

  for (const appt of appointments) {
    const rolePerms = permissionsForRole(appt.role_key);
    if (!rolePerms.includes(req.permission) && appt.role_key !== "platform_administrator") continue;

    if (appt.role_key === "platform_administrator" && rolePerms.includes(req.permission)) {
      matched.push(appt);
      expandAppointmentScopes(appt).forEach((s) => authorizedScopeIds.add(s));
      continue;
    }

    const coversAll =
      requestedScopes.length === 0 ||
      requestedScopes.every((scope) => appointmentCoversRequested(appt, scope));

    if (coversAll && rolePerms.includes(req.permission)) {
      matched.push(appt);
      expandAppointmentScopes(appt).forEach((s) => authorizedScopeIds.add(s));
    }
  }

  if (matched.some((a) => a.role_key === "platform_administrator")) {
    return {
      allowed: true,
      permission: req.permission,
      actorId: req.actorId,
      resourceType: req.resourceType,
      resourceId: req.resourceId,
      authorizedScopeIds: [...authorizedScopeIds],
      matchedRoleIds: matched.map((m) => m.role_key),
      reasonCode: "platform_admin",
    };
  }

  if (matched.length > 0) {
    return {
      allowed: true,
      permission: req.permission,
      actorId: req.actorId,
      resourceType: req.resourceType,
      resourceId: req.resourceId,
      authorizedScopeIds: [...authorizedScopeIds],
      matchedRoleIds: matched.map((m) => m.role_key),
      reasonCode: requestedScopes.length > 0 ? "allowed_by_scope" : "allowed_by_role",
    };
  }

  const hasPermissionSomewhere = appointments.some((a) => permissionsForRole(a.role_key).includes(req.permission));
  const reasonCode = hasPermissionSomewhere ? "outside_scope" : "missing_permission";
  logDenial(req, reasonCode);

  return {
    allowed: false,
    permission: req.permission,
    actorId: req.actorId,
    resourceType: req.resourceType,
    resourceId: req.resourceId,
    authorizedScopeIds: [],
    matchedRoleIds: [],
    reasonCode,
  };
}

/** Flat permission list for API context — union of permissions from active appointments only. */
export function resolveEffectivePermissions(actorId: string): string[] {
  const perms = new Set<string>();
  for (const appt of activeAppointments(actorId)) {
    for (const p of permissionsForRole(appt.role_key)) perms.add(p);
  }
  return [...perms];
}

/** Check authorization and throw-compatible result for gateway. */
export function assertAuthorized(req: AuthorizationRequest): AuthorizationDecision {
  const decision = authorize(req);
  return decision;
}
