/**
 * CAE-11.1-W3 — Authority resolution and policy
 */
import { getUserById } from "@/lib/auth/engine";
import type { InitiativeCommandType } from "./commands";
import { INITIATIVE_PERMISSIONS } from "./commands";
import type { InitiativeAggregate } from "../data-model";
import { InitiativeDomainError } from "./errors";

export type AuthorityDecision =
  | "Allowed"
  | "Denied"
  | "Allowed with Conditions"
  | "Approval Required"
  | "Institution Context Mismatch";

export interface InitiativeAuthorityDecision {
  decision: AuthorityDecision;
  reason_code: string;
  required_permission: string;
  resolved_roles: string[];
  initiative_scope: string;
  institution_scope: string;
  requires_secondary_approval: boolean;
}

const SERVICE_IDENTITY_PREFIXES = ["svc-", "service-", "bot-", "ai-"];

export function isServiceOrAiIdentity(humanId: string): boolean {
  const lower = humanId.toLowerCase();
  return SERVICE_IDENTITY_PREFIXES.some((p) => lower.startsWith(p));
}

export function resolveInitiativeAuthority(
  commandType: InitiativeCommandType,
  actorHumanId: string,
  institutionId: string,
  aggregate: InitiativeAggregate | null,
  effectivePermissions: string[] = ["civic_action.manage"]
): InitiativeAuthorityDecision {
  const required_permission = INITIATIVE_PERMISSIONS[commandType] ?? "initiative.admin.configure";

  if (isServiceOrAiIdentity(actorHumanId)) {
    const allowedServiceCommands: InitiativeCommandType[] = [];
    if (!allowedServiceCommands.includes(commandType)) {
      throw new InitiativeDomainError({
        code: "INITIATIVE_SERVICE_IDENTITY_FORBIDDEN",
        message: "Service identity cannot perform this initiative command",
        requirement_ids: ["CAE-11.1-W3-OWN-005", "CAE-11.1-W3-SVC-002"],
      });
    }
  }

  const user = getUserById(actorHumanId);
  if (!user || user.account_status === "suspended") {
    throw new InitiativeDomainError({
      code: "INITIATIVE_PERMISSION_DENIED",
      message: "Actor is not an active Human",
      requirement_ids: ["CAE-11.1-W3-SVC-002"],
    });
  }

  if (aggregate && aggregate.initiative.institution_id !== institutionId) {
    return {
      decision: "Institution Context Mismatch",
      reason_code: "INSTITUTION_MISMATCH",
      required_permission,
      resolved_roles: [],
      initiative_scope: aggregate.initiative.institution_id,
      institution_scope: institutionId,
      requires_secondary_approval: false,
    };
  }

  const hasPermission =
    effectivePermissions.includes(required_permission) ||
    effectivePermissions.includes("civic_action.manage");

  if (!hasPermission) {
    return {
      decision: "Denied",
      reason_code: "PERMISSION_DENIED",
      required_permission,
      resolved_roles: [],
      initiative_scope: aggregate?.initiative.initiative_id ?? "new",
      institution_scope: institutionId,
      requires_secondary_approval: false,
    };
  }

  const roles: string[] = [];
  if (aggregate) {
    if (aggregate.initiative.executive_owner_human_id === actorHumanId) roles.push("executive_owner");
    if (aggregate.initiative.operational_owner_human_id === actorHumanId) roles.push("operational_owner");
  }

  return {
    decision: "Allowed",
    reason_code: "OK",
    required_permission,
    resolved_roles: roles,
    initiative_scope: aggregate?.initiative.initiative_id ?? "new",
    institution_scope: institutionId,
    requires_secondary_approval: false,
  };
}

export function assertAuthorityAllowed(decision: InitiativeAuthorityDecision) {
  if (decision.decision === "Denied" || decision.decision === "Institution Context Mismatch") {
    throw new InitiativeDomainError({
      code: decision.decision === "Institution Context Mismatch" ? "INITIATIVE_INSTITUTION_MISMATCH" : "INITIATIVE_PERMISSION_DENIED",
      message: decision.reason_code,
      requirement_ids: ["CAE-11.1-W3-SVC-002"],
      details: { required_permission: decision.required_permission },
    });
  }
}

export function getGovernanceApprovalRequirements(governanceClass: number): string[] {
  const reqs: string[] = ["executive_approval"];
  if (governanceClass >= 3) reqs.push("sponsoring_authority");
  if (governanceClass >= 4) reqs.push("privacy_review", "safety_review");
  if (governanceClass >= 5) reqs.push("emergency_review");
  return reqs;
}
