/**
 * CAE-11.7-W3 — Communication permission and moderation policy
 */
import { getUserById } from "@/lib/auth/engine";
import type { CommunicationCommandType } from "./commands";
import { COMMUNICATION_PERMISSIONS } from "./commands";
import { CommunicationDomainError } from "./errors";

const SERVICE_IDENTITY_PREFIXES = ["svc-", "service-", "bot-", "ai-"];

export function isServiceOrAiIdentity(humanId: string): boolean {
  const lower = humanId.toLowerCase();
  return SERVICE_IDENTITY_PREFIXES.some((p) => lower.startsWith(p));
}

export interface CommunicationAuthorityDecision {
  allowed: boolean;
  reason_code: string;
  required_permission: string;
  resolved_roles: string[];
}

export function resolveCommunicationAuthority(
  commandType: CommunicationCommandType,
  actorHumanId: string,
  institutionId: string,
  entityInstitutionId: string | null,
  ownerHumanId?: string | null,
  moderatorHumanIds: string[] = [],
  effectivePermissions: string[] = ["civic_action.manage"],
  requestSource: string = "human"
): CommunicationAuthorityDecision {
  const required_permission = COMMUNICATION_PERMISSIONS[commandType];

  if (commandType === "GenerateAISummary") {
    if (isServiceOrAiIdentity(actorHumanId)) {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_SERVICE_IDENTITY_FORBIDDEN",
        message: "AI summary must be requested by a verified Human",
        requirement_ids: ["CAE-11.7-W3-AI-001", "CAE-11.7-W3-AI-003"],
        human_message: "A Human must approve AI summary generation.",
        suggested_action: "Have a verified Human execute GenerateAISummary with request_source ai_suggestion.",
      });
    }
    if (requestSource !== "ai_suggestion") {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_VALIDATION_FAILED",
        message: "GenerateAISummary requires request_source ai_suggestion from human envelope",
        requirement_ids: ["CAE-11.7-W3-AI-003"],
      });
    }
  } else if (isServiceOrAiIdentity(actorHumanId)) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_SERVICE_IDENTITY_FORBIDDEN",
      message: "Service or AI identity cannot perform communication mutations directly",
      requirement_ids: ["CAE-11.7-W3-AI-001", "CAE-11.7-W3-SVC-001"],
      human_message: "Automated identities must submit suggested commands for human approval.",
      suggested_action: "Have a verified Human execute this command.",
    });
  }

  const user = getUserById(actorHumanId);
  if (!user || user.account_status === "suspended") {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_PERMISSION_DENIED",
      message: "Actor is not an active Human",
      requirement_ids: ["CAE-11.7-W3-OWN-001"],
    });
  }

  if (entityInstitutionId && entityInstitutionId !== institutionId) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_INSTITUTION_MISMATCH",
      message: "Institution context mismatch",
      requirement_ids: ["CAE-11.7-W3-VAL-003"],
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
  if (ownerHumanId === actorHumanId) roles.push("owner");
  if (moderatorHumanIds.includes(actorHumanId)) roles.push("moderator");

  return { allowed: true, reason_code: "OK", required_permission, resolved_roles: roles };
}

export function assertCommunicationAuthority(decision: CommunicationAuthorityDecision) {
  if (!decision.allowed) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_PERMISSION_DENIED",
      message: decision.reason_code,
      requirement_ids: ["CAE-11.7-W3-VAL-002"],
      details: { required_permission: decision.required_permission },
    });
  }
}

export function checkModerationPolicy(
  actorHumanId: string,
  moderatorHumanIds: string[],
  entityId: string,
  isArchived: boolean
) {
  if (isArchived) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_ARCHIVED_READ_ONLY",
      message: "Archived communication objects are read-only",
      entity_id: entityId,
      requirement_ids: ["CAE-11.7-W3-MOD-001"],
    });
  }
  if (moderatorHumanIds.includes(actorHumanId)) return;
}

export function assertNoAiImpersonation(isAiGenerated: boolean, authorHumanId: string) {
  if (isAiGenerated && !isServiceOrAiIdentity(authorHumanId)) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_AI_IMPERSONATION_FORBIDDEN",
      message: "AI content cannot be attributed to a Human author",
      requirement_ids: ["CAE-11.7-W3-AI-002"],
      human_message: "AI summaries must not post as Human messages.",
    });
  }
}
