/**
 * CAE-11.2-W3 — Execution permission and ownership policy
 */
import { getUserById } from "@/lib/auth/engine";
import type { ExecutionCommandType } from "./commands";
import { EXECUTION_PERMISSIONS } from "./commands";
import { ExecutionDomainError } from "./errors";

const SERVICE_IDENTITY_PREFIXES = ["svc-", "service-", "bot-", "ai-"];

export function isServiceOrAiIdentity(humanId: string): boolean {
  const lower = humanId.toLowerCase();
  return SERVICE_IDENTITY_PREFIXES.some((p) => lower.startsWith(p));
}

export interface ExecutionAuthorityDecision {
  allowed: boolean;
  reason_code: string;
  required_permission: string;
  resolved_roles: string[];
}

export function resolveExecutionAuthority(
  commandType: ExecutionCommandType,
  actorHumanId: string,
  institutionId: string,
  entityInstitutionId: string | null,
  executiveOwnerId?: string | null,
  operationalOwnerId?: string | null,
  effectivePermissions: string[] = ["civic_action.manage"]
): ExecutionAuthorityDecision {
  const required_permission = EXECUTION_PERMISSIONS[commandType];

  if (isServiceOrAiIdentity(actorHumanId)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_SERVICE_IDENTITY_FORBIDDEN",
      message: "Service or AI identity cannot perform execution mutations directly",
      requirement_ids: ["CAE-11.2-W3-AI-001", "CAE-11.2-W3-SVC-001"],
      human_message: "Automated identities must submit suggested commands for human approval.",
      suggested_action: "Have a verified Human execute this command.",
    });
  }

  const user = getUserById(actorHumanId);
  if (!user || user.account_status === "suspended") {
    throw new ExecutionDomainError({
      code: "EXECUTION_PERMISSION_DENIED",
      message: "Actor is not an active Human",
      requirement_ids: ["CAE-11.2-W3-OWN-001"],
    });
  }

  if (entityInstitutionId && entityInstitutionId !== institutionId) {
    throw new ExecutionDomainError({
      code: "EXECUTION_INSTITUTION_MISMATCH",
      message: "Institution context mismatch",
      requirement_ids: ["CAE-11.2-W3-VAL-003"],
    });
  }

  const hasPermission =
    effectivePermissions.includes(required_permission) ||
    effectivePermissions.includes("civic_action.manage");

  if (!hasPermission) {
    return {
      allowed: false,
      reason_code: "PERMISSION_DENIED",
      required_permission,
      resolved_roles: [],
    };
  }

  const roles: string[] = [];
  if (executiveOwnerId === actorHumanId) roles.push("executive_owner");
  if (operationalOwnerId === actorHumanId) roles.push("operational_owner");

  return { allowed: true, reason_code: "OK", required_permission, resolved_roles: roles };
}

export function assertExecutionAuthority(decision: ExecutionAuthorityDecision) {
  if (!decision.allowed) {
    throw new ExecutionDomainError({
      code: "EXECUTION_PERMISSION_DENIED",
      message: decision.reason_code,
      requirement_ids: ["CAE-11.2-W3-VAL-002"],
      details: { required_permission: decision.required_permission },
    });
  }
}

export function validateOwnershipForActivation(
  executiveOwnerId: string,
  operationalOwnerId: string,
  entityId: string
) {
  if (!executiveOwnerId || !operationalOwnerId) {
    throw new ExecutionDomainError({
      code: "EXECUTION_OWNER_REQUIRED",
      message: "Executive and operational owners are required before activation",
      entity_id: entityId,
      requirement_ids: ["CAE-11.2-W3-OWN-002"],
      blocking_requirement: "Assign executive and operational owners",
    });
  }
  if (isServiceOrAiIdentity(executiveOwnerId) || isServiceOrAiIdentity(operationalOwnerId)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_OWNER_INELIGIBLE",
      message: "Owners must be verified Humans, not service identities",
      entity_id: entityId,
      requirement_ids: ["CAE-11.2-W3-OWN-003"],
    });
  }
  for (const ownerId of [executiveOwnerId, operationalOwnerId]) {
    const user = getUserById(ownerId);
    if (!user || user.account_status === "suspended") {
      throw new ExecutionDomainError({
        code: "EXECUTION_OWNER_INELIGIBLE",
        message: `Owner ${ownerId} is not an active verified Human`,
        entity_id: entityId,
        requirement_ids: ["CAE-11.2-W3-OWN-001"],
      });
    }
  }
}
