/**
 * CAE-11.12-W3 — Knowledge authorization and AI boundary policy
 */
import { getUserById } from "@/lib/auth/engine";
import type { KnowledgeCommandType } from "./commands";
import { KNOWLEDGE_PERMISSIONS } from "./commands";
import { KnowledgeDomainError } from "./errors";

const SERVICE_IDENTITY_PREFIXES = ["svc-", "service-", "bot-", "ai-"];

const AI_BLOCKED_COMMANDS: KnowledgeCommandType[] = [
  "PublishKnowledgeArtifact",
  "ApproveKnowledgeArtifact",
  "AwardCertification",
  "VerifyHumanCompetency",
  "ApproveKnowledgeTranslation",
];

const AI_ALLOWED_WITH_HUMAN_GATE: KnowledgeCommandType[] = [
  "CreateAIKnowledgeSuggestion",
];

export function isServiceOrAiIdentity(humanId: string): boolean {
  const lower = humanId.toLowerCase();
  return SERVICE_IDENTITY_PREFIXES.some((p) => lower.startsWith(p));
}

export interface KnowledgeAuthorityDecision {
  allowed: boolean;
  reason_code: string;
  required_permission: string;
  resolved_roles: string[];
}

export function canActorPerformCommand(
  commandType: KnowledgeCommandType,
  actorHumanId: string,
  requestSource: string = "human"
): boolean {
  try {
    resolveKnowledgeAuthority(commandType, actorHumanId, "inst-block-street", null, ["civic_action.manage"], requestSource);
    return true;
  } catch {
    return false;
  }
}

export function resolveKnowledgeAuthority(
  commandType: KnowledgeCommandType,
  actorHumanId: string,
  institutionId: string,
  entityInstitutionId: string | null,
  effectivePermissions: string[] = ["civic_action.manage"],
  requestSource: string = "human",
  stewardHumanId?: string | null
): KnowledgeAuthorityDecision {
  const required_permission = KNOWLEDGE_PERMISSIONS[commandType];

  if (AI_ALLOWED_WITH_HUMAN_GATE.includes(commandType)) {
    if (commandType === "CreateAIKnowledgeSuggestion") {
      if (isServiceOrAiIdentity(actorHumanId)) {
        throw new KnowledgeDomainError({
          code: "KNOWLEDGE_SERVICE_IDENTITY_FORBIDDEN",
          message: "AI suggestion must be requested by a verified Human",
          requirement_ids: ["CAE-11.12-W3-AI-001"],
          human_message: "A Human must initiate AI knowledge suggestions.",
        });
      }
      if (requestSource !== "ai_suggestion" && requestSource !== "human") {
        throw new KnowledgeDomainError({
          code: "KNOWLEDGE_VALIDATION_FAILED",
          message: "CreateAIKnowledgeSuggestion requires human envelope with service_identity in payload",
          requirement_ids: ["CAE-11.12-W3-AI-002"],
        });
      }
    }
  } else if (isServiceOrAiIdentity(actorHumanId)) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_SERVICE_IDENTITY_FORBIDDEN",
      message: "Service or AI identity cannot perform knowledge mutations directly",
      requirement_ids: ["CAE-11.12-W3-AI-001", "CAE-11.12-W3-SVC-001"],
      suggested_action: "Have a verified Human execute this command.",
    });
  }

  if (AI_BLOCKED_COMMANDS.includes(commandType) && requestSource === "ai_suggestion") {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_AI_PUBLISH_FORBIDDEN",
      message: "AI cannot publish, approve, certify, or verify competency",
      requirement_ids: ["CAE-11.12-W3-AI-003"],
    });
  }

  const user = getUserById(actorHumanId);
  if (!user || user.account_status === "suspended") {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_PERMISSION_DENIED",
      message: "Actor is not an active Human",
      requirement_ids: ["CAE-11.12-W3-OWN-001"],
    });
  }

  if (entityInstitutionId && entityInstitutionId !== institutionId) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_INSTITUTION_MISMATCH",
      message: "Institution context mismatch",
      requirement_ids: ["CAE-11.12-W3-VAL-003"],
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
  if (stewardHumanId === actorHumanId) roles.push("steward");

  return { allowed: true, reason_code: "OK", required_permission, resolved_roles: roles };
}

export function assertKnowledgeAuthority(decision: KnowledgeAuthorityDecision) {
  if (!decision.allowed) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_PERMISSION_DENIED",
      message: decision.reason_code,
      requirement_ids: ["CAE-11.12-W3-VAL-002"],
      details: { required_permission: decision.required_permission },
    });
  }
}

export function assertPublishedArtifactImmutable(lifecycleState: string, entityId: string) {
  if (lifecycleState === "published" || lifecycleState === "operational" || lifecycleState === "historical") {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_IMMUTABLE_PUBLISHED",
      message: "Published artifacts are immutable; create a new version via draft edit flow",
      entity_id: entityId,
      requirement_ids: ["CAE-11.12-W3-LIF-005"],
      suggested_action: "Supersede with a new draft version or create a correction record.",
    });
  }
}
