/**
 * CAE-11.12-W3 — Knowledge validation pipeline
 */
import type { KnowledgeCommandEnvelope } from "./commands";
import { KnowledgeDomainError } from "./errors";
import { resolveKnowledgeAuthority, assertKnowledgeAuthority, assertPublishedArtifactImmutable } from "./policy";
import {
  isArtifactTransitionAllowed,
  isCourseTransitionAllowed,
  childExceedsParent,
} from "../state-machines";
import type {
  CourseRecord,
  KnowledgeArtifactRecord,
  KnowledgeClaimRecord,
} from "../data-model";
import { loadArtifact, loadCourse } from "./repository";

export interface PipelineContext {
  envelope: KnowledgeCommandEnvelope;
  permissions: string[];
  artifact?: KnowledgeArtifactRecord | null;
  claim?: KnowledgeClaimRecord | null;
  course?: CourseRecord | null;
}

export function runValidationPipeline(
  ctx: PipelineContext,
  stages: {
    skipPermission?: boolean;
    skipInstitution?: boolean;
    skipStewardship?: boolean;
    skipBusinessRules?: boolean;
  } = {}
) {
  const { envelope, permissions } = ctx;

  if (!stages.skipPermission) {
    const auth = resolveKnowledgeAuthority(
      envelope.command_type,
      envelope.actor_human_id,
      envelope.institution_id,
      ctx.artifact?.institution_id ?? ctx.claim?.institution_id ?? ctx.course?.institution_id ?? null,
      permissions,
      envelope.request_source ?? "human",
      ctx.artifact?.steward_human_id
    );
    assertKnowledgeAuthority(auth);
  }

  if (!stages.skipInstitution && ctx.artifact && ctx.artifact.institution_id !== envelope.institution_id) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_INSTITUTION_MISMATCH",
      message: "Artifact institution mismatch",
      requirement_ids: ["CAE-11.12-W3-VAL-003"],
    });
  }

  if (!stages.skipBusinessRules && ctx.claim && ctx.artifact) {
    if (childExceedsParent(ctx.claim.lifecycle_state, ctx.artifact.lifecycle_state)) {
      throw new KnowledgeDomainError({
        code: "KNOWLEDGE_CHILD_CONSTRAINT",
        message: "Claim lifecycle cannot exceed parent artifact lifecycle",
        entity_id: ctx.claim.canonical_id,
        requirement_ids: ["CAE-11.12-W2-DATA-012"],
      });
    }
  }
}

export function assertArtifactTransition(from: string, to: string, entityId: string) {
  if (!isArtifactTransitionAllowed(from as never, to as never)) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_TRANSITION_NOT_ALLOWED",
      message: `Illegal Artifact transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "KnowledgeArtifact",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.12-W3-LIF-001"],
      suggested_action: "Follow lawful intermediate states (draft → review → validated → published)",
    });
  }
}

export function assertCourseTransition(from: string, to: string, entityId: string) {
  if (!isCourseTransitionAllowed(from as never, to as never)) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_TRANSITION_NOT_ALLOWED",
      message: `Illegal Course transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "Course",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.12-W3-LIF-002"],
    });
  }
}

export function requireArtifact(artifactId: string): KnowledgeArtifactRecord {
  const artifact = loadArtifact(artifactId);
  if (!artifact) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_NOT_FOUND",
      message: "Knowledge artifact not found — orphan knowledge prohibited",
      entity_id: artifactId,
      requirement_ids: ["CAE-11.12-W1-CON-003"],
    });
  }
  return artifact;
}

export function requireCourse(courseId: string): CourseRecord {
  const course = loadCourse(courseId);
  if (!course) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_NOT_FOUND",
      message: "Course not found",
      entity_id: courseId,
      requirement_ids: ["CAE-11.12-W2-DATA-007"],
    });
  }
  return course;
}

export function assertVersionMatch(
  entity: { canonical_id: string; current_version: number },
  expected: number | null | undefined
) {
  if (expected != null && entity.current_version !== expected) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_VERSION_CONFLICT",
      message: "Version conflict — stale expected_version",
      entity_id: entity.canonical_id,
      retryable: true,
      requirement_ids: ["CAE-11.12-W3-CON-002"],
    });
  }
}

export function assertDraftEditable(artifact: KnowledgeArtifactRecord) {
  if (artifact.lifecycle_state !== "draft") {
    assertPublishedArtifactImmutable(artifact.lifecycle_state, artifact.canonical_id);
  }
}

export function assertPublishAllowed(artifact: KnowledgeArtifactRecord, hasApproval: boolean) {
  if (artifact.lifecycle_state !== "validated") {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_PUBLICATION_BLOCKED",
      message: "Artifact must be validated before publication",
      entity_id: artifact.canonical_id,
      current_state: artifact.lifecycle_state,
      requested_state: "published",
      requirement_ids: ["CAE-11.12-W3-LIF-003"],
    });
  }
  if (!hasApproval) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_APPROVAL_REQUIRED",
      message: "Publication blocked without human approval",
      entity_id: artifact.canonical_id,
      requirement_ids: ["CAE-11.12-W3-LIF-004"],
      blocking_requirement: "ApproveKnowledgeArtifact",
    });
  }
}
