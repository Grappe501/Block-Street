/**
 * CAE-11.12-W3 — Knowledge Domain Engine (ADP-001)
 * All knowledge mutations must pass through this service.
 */
import { createHash } from "crypto";
import { caeId, nowIso } from "../../../utils";
import type {
  AIKnowledgeSuggestionRecord,
  AssessmentAttemptRecord,
  AssessmentResultRecord,
  CertificationAwardRecord,
  CitationRecord,
  CourseRecord,
  HumanCompetencyRecord,
  KnowledgeApprovalRecord,
  KnowledgeArtifactRecord,
  KnowledgeClaimRecord,
  KnowledgeConflictRecord,
  KnowledgeCorrectionRecord,
  KnowledgeReviewRecord,
  KnowledgeTranslationRecord,
  LearningCompletionRecord,
  LearningEnrollmentRecord,
} from "../data-model";
import type {
  ApproveKnowledgeArtifactPayload,
  ApproveKnowledgeTranslationPayload,
  AttachCitationPayload,
  AwardCertificationPayload,
  CompleteKnowledgeReviewPayload,
  CompleteLearningTargetPayload,
  CreateAIKnowledgeSuggestionPayload,
  CreateCoursePayload,
  CreateKnowledgeArtifactPayload,
  CreateKnowledgeClaimPayload,
  CreateKnowledgeTranslationDraftPayload,
  EditKnowledgeArtifactDraftPayload,
  EnrollHumanInLearningPayload,
  EvaluateAssessmentAttemptPayload,
  EvaluateCertificationEligibilityPayload,
  IdentifyKnowledgeConflictPayload,
  KnowledgeCommandEnvelope,
  KnowledgeCommandResult,
  PublishCourseVersionPayload,
  PublishKnowledgeArtifactPayload,
  RecordLearningProgressPayload,
  ReportKnowledgeCorrectionPayload,
  ReviewAIKnowledgeSuggestionPayload,
  StartAssessmentAttemptPayload,
  SubmitKnowledgeArtifactForReviewPayload,
  ValidateKnowledgeArtifactPayload,
  VerifyHumanCompetencyPayload,
} from "./commands";
import { KnowledgeDomainError } from "./errors";
import { publishKnowledgeEvent } from "./events";
import {
  assertArtifactTransition,
  assertCourseTransition,
  assertDraftEditable,
  assertPublishAllowed,
  assertVersionMatch,
  requireArtifact,
  requireCourse,
  runValidationPipeline,
} from "./validation-pipeline";
import { KNOWLEDGE_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "./repository";
import {
  appendKnowledgeHistory,
  getKnowledgeIdempotencyResult,
  hasApprovalForArtifact,
  loadAISuggestion,
  loadAssessment,
  loadAssessmentAttempt,
  loadCertification,
  loadClaim,
  loadCompetency,
  loadEnrollment,
  loadTranslation,
  markTranslationsStaleForArtifact,
  saveAISuggestion,
  saveApproval,
  saveArtifact,
  saveAssessmentAttempt,
  saveAssessmentResult,
  saveCertificationAward,
  saveCitation,
  saveClaim,
  saveCompletion,
  saveConflict,
  saveCorrection,
  saveCourse,
  saveEnrollment,
  saveHumanCompetency,
  saveReview,
  saveTranslation,
  setKnowledgeIdempotencyResult,
} from "./repository";
import { createKnowledgeVersion, recordKnowledgeAudit } from "./version-audit";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function hashPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
}

function ok(
  entityId: string,
  entityType: string,
  prev: string | null,
  next: string | null,
  version: number,
  events: string[],
  auditId?: string
): KnowledgeCommandResult {
  return {
    success: true,
    entity_id: entityId,
    entity_type: entityType,
    previous_status_optional: prev,
    new_status_optional: next,
    version,
    events,
    warnings: [],
    next_required_actions: [],
    validation_errors: [],
    audit_id_optional: auditId ?? null,
  };
}

function failResult(e: KnowledgeDomainError): KnowledgeCommandResult {
  return {
    success: false,
    entity_id: e.entity_id ?? null,
    entity_type: e.entity_type ?? null,
    previous_status_optional: e.current_state ?? null,
    new_status_optional: e.requested_state ?? null,
    version: null,
    events: [],
    warnings: [],
    next_required_actions: [],
    validation_errors: [e.toValidationError()],
  };
}

function bumpEntity<
  T extends { canonical_id: string; current_version: number; updated_at: string; last_modified_by: string },
>(entity: T, actorId: string, reason: string, fields: string[]): T {
  const version = createKnowledgeVersion({
    entity_id: entity.canonical_id,
    current_version: entity.current_version,
    changed_by: actorId,
    reason,
    affected_fields: fields,
    snapshot: { ...entity } as unknown as Record<string, unknown>,
  });
  entity.current_version = version.version_number;
  entity.updated_at = nowIso();
  entity.last_modified_by = actorId;
  return entity;
}

function writeHistory(
  entityId: string,
  entityType: string,
  eventType: string,
  institutionId: string,
  actorId: string,
  payload: Record<string, unknown>
) {
  appendKnowledgeHistory({
    event_id: caeId("khx"),
    entity_id: entityId,
    entity_type: entityType,
    event_type: eventType,
    institution_id: institutionId,
    actor_human_id: actorId,
    occurred_at: nowIso(),
    payload,
  });
}

function baseEntityFields(
  envelope: KnowledgeCommandEnvelope,
  displayName: string,
  objectType: string,
  lifecycleState: string,
  parentId: string | null,
  parentType: string | null,
  initiativeId: string | null
) {
  const now = nowIso();
  const id = caeId("knw");
  return {
    canonical_id: id,
    public_id: `KNW-${id.slice(-6).toUpperCase()}`,
    display_name: displayName,
    canonical_slug: slugify(displayName),
    institution_id: envelope.institution_id,
    initiative_id: initiativeId,
    parent_object_id: parentId,
    parent_object_type: parentType,
    object_type: objectType,
    visibility: "institution_internal" as const,
    governance_classification: 3 as const,
    steward_human_id: envelope.actor_human_id,
    created_by: envelope.actor_human_id,
    last_modified_by: envelope.actor_human_id,
    created_at: now,
    updated_at: now,
    current_version: 1,
    lifecycle_state: lifecycleState,
    tags: [] as string[],
    confidence_level: "medium" as const,
    content_origin: "human" as const,
    is_ai_generated: false,
  };
}

export class KnowledgeDomainService {
  execute(
    envelope: KnowledgeCommandEnvelope,
    permissions: string[] = ["civic_action.manage"]
  ): KnowledgeCommandResult {
    if (envelope.idempotency_key) {
      const cached = getKnowledgeIdempotencyResult(envelope.idempotency_key);
      if (cached) return cached as KnowledgeCommandResult;
    }

    let result: KnowledgeCommandResult;
    try {
      result = this.dispatch(envelope, permissions);
    } catch (e) {
      if (e instanceof KnowledgeDomainError) return failResult(e);
      throw e;
    }

    if (envelope.idempotency_key) {
      const okIdem = setKnowledgeIdempotencyResult(envelope.idempotency_key, result, hashPayload(envelope));
      if (!okIdem) {
        throw new KnowledgeDomainError({
          code: "KNOWLEDGE_IDEMPOTENCY_CONFLICT",
          message: "Idempotency key reused with different payload",
          requirement_ids: ["CAE-11.12-W3-CON-001"],
        });
      }
    }
    return result;
  }

  private dispatch(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    switch (envelope.command_type) {
      case "CreateKnowledgeArtifact":
        return this.createKnowledgeArtifact(envelope, permissions);
      case "EditKnowledgeArtifactDraft":
        return this.editKnowledgeArtifactDraft(envelope, permissions);
      case "CreateKnowledgeClaim":
        return this.createKnowledgeClaim(envelope, permissions);
      case "AttachCitation":
        return this.attachCitation(envelope, permissions);
      case "SubmitKnowledgeArtifactForReview":
        return this.submitForReview(envelope, permissions);
      case "CompleteKnowledgeReview":
        return this.completeReview(envelope, permissions);
      case "ValidateKnowledgeArtifact":
        return this.validateArtifact(envelope, permissions);
      case "ApproveKnowledgeArtifact":
        return this.approveArtifact(envelope, permissions);
      case "PublishKnowledgeArtifact":
        return this.publishArtifact(envelope, permissions);
      case "CreateCourse":
        return this.createCourse(envelope, permissions);
      case "PublishCourseVersion":
        return this.publishCourseVersion(envelope, permissions);
      case "EnrollHumanInLearning":
        return this.enrollHuman(envelope, permissions);
      case "RecordLearningProgress":
        return this.recordProgress(envelope, permissions);
      case "CompleteLearningTarget":
        return this.completeLearning(envelope, permissions);
      case "VerifyHumanCompetency":
        return this.verifyCompetency(envelope, permissions);
      case "StartAssessmentAttempt":
        return this.startAssessmentAttempt(envelope, permissions);
      case "EvaluateAssessmentAttempt":
        return this.evaluateAssessment(envelope, permissions);
      case "AwardCertification":
        return this.awardCertification(envelope, permissions);
      case "EvaluateCertificationEligibility":
        return this.evaluateEligibility(envelope, permissions);
      case "CreateAIKnowledgeSuggestion":
        return this.createAISuggestion(envelope, permissions);
      case "ReviewAIKnowledgeSuggestion":
        return this.reviewAISuggestion(envelope, permissions);
      case "CreateKnowledgeTranslationDraft":
        return this.createTranslationDraft(envelope, permissions);
      case "ApproveKnowledgeTranslation":
        return this.approveTranslation(envelope, permissions);
      case "ReportKnowledgeCorrection":
        return this.reportCorrection(envelope, permissions);
      case "IdentifyKnowledgeConflict":
        return this.identifyConflict(envelope, permissions);
      default:
        throw new KnowledgeDomainError({
          code: "KNOWLEDGE_DIRECT_MUTATION_FORBIDDEN",
          message: `Unsupported command: ${envelope.command_type}`,
        });
    }
  }

  private createKnowledgeArtifact(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as CreateKnowledgeArtifactPayload;
    runValidationPipeline({ envelope, permissions }, { skipInstitution: true });

    const initiativeId = payload.initiative_id_optional ?? envelope.initiative_id_optional ?? null;
    const fields = baseEntityFields(
      envelope,
      payload.display_name,
      "KnowledgeArtifact",
      "draft",
      payload.collection_id,
      "KnowledgeCollection",
      initiativeId
    );

    const artifact: KnowledgeArtifactRecord = {
      ...fields,
      object_type: "KnowledgeArtifact",
      lifecycle_state: "draft",
      collection_id: payload.collection_id,
      domain_id: payload.domain_id,
      artifact_type: payload.artifact_type ?? "knowledge_article",
      body: payload.body,
      summary: payload.summary ?? payload.display_name,
      language: payload.language ?? "en",
      published_version_id: null,
      evidence_status: "none",
      visibility: payload.visibility ?? "institution_internal",
    };

    saveArtifact(artifact);
    const event = publishKnowledgeEvent({
      event_type: "knowledge.artifact_created",
      entity_id: artifact.canonical_id,
      entity_type: "KnowledgeArtifact",
      institution_id: envelope.institution_id,
      initiative_id_optional: initiativeId,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { display_name: payload.display_name, lifecycle_state: "draft" },
    });
    const audit = recordKnowledgeAudit({
      who: envelope.actor_human_id,
      what: "CreateKnowledgeArtifact",
      where: envelope.institution_id,
      previous_state: null,
      new_state: { lifecycle_state: "draft" },
      reason: envelope.reason_optional ?? null,
      authority: "knowledge.artifact.create",
      request_source: envelope.request_source ?? "human",
    });
    writeHistory(artifact.canonical_id, "KnowledgeArtifact", "artifact_created", envelope.institution_id, envelope.actor_human_id, {
      lifecycle_state: "draft",
    });
    return ok(artifact.canonical_id, "KnowledgeArtifact", null, "draft", 1, [event.event_id], audit.audit_id);
  }

  private editKnowledgeArtifactDraft(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as EditKnowledgeArtifactDraftPayload;
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });
    assertDraftEditable(artifact);
    assertVersionMatch(artifact, envelope.expected_version_optional);

    const prev = artifact.lifecycle_state;
    if (payload.body != null) artifact.body = payload.body;
    if (payload.summary != null) artifact.summary = payload.summary;
    if (payload.display_name != null) artifact.display_name = payload.display_name;
    bumpEntity(artifact, envelope.actor_human_id, "Edit draft artifact", ["body", "summary", "display_name"]);
    saveArtifact(artifact);
    markTranslationsStaleForArtifact(artifact.canonical_id, artifact.current_version);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.artifact_edited",
      entity_id: artifact.canonical_id,
      entity_type: "KnowledgeArtifact",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: artifact.current_version,
      payload: { from: prev },
    });
    return ok(artifact.canonical_id, "KnowledgeArtifact", prev, artifact.lifecycle_state, artifact.current_version, [event.event_id]);
  }

  private createKnowledgeClaim(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as CreateKnowledgeClaimPayload;
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });

    const fields = baseEntityFields(
      envelope,
      payload.claim_text.slice(0, 80),
      "KnowledgeClaim",
      "draft",
      artifact.canonical_id,
      "KnowledgeArtifact",
      artifact.initiative_id
    );
    const claim: KnowledgeClaimRecord = {
      ...fields,
      object_type: "KnowledgeClaim",
      lifecycle_state: "draft",
      artifact_id: artifact.canonical_id,
      claim_text: payload.claim_text,
      evidence_status: "none",
      confidence_level: "low",
      requires_evidence: payload.requires_evidence ?? true,
    };
    saveClaim(claim);
    const event = publishKnowledgeEvent({
      event_type: "knowledge.claim_created",
      entity_id: claim.canonical_id,
      entity_type: "KnowledgeClaim",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { artifact_id: artifact.canonical_id },
    });
    return ok(claim.canonical_id, "KnowledgeClaim", null, "draft", 1, [event.event_id]);
  }

  private attachCitation(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as AttachCitationPayload;
    const claim = loadClaim(payload.claim_id);
    if (!claim) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Claim not found", entity_id: payload.claim_id });
    }
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact, claim });

    const fields = baseEntityFields(
      envelope,
      `Citation for ${claim.claim_text.slice(0, 40)}`,
      "Citation",
      "draft",
      claim.canonical_id,
      "KnowledgeClaim",
      artifact.initiative_id
    );
    const citation: CitationRecord = {
      ...fields,
      object_type: "Citation",
      lifecycle_state: "draft",
      claim_id: claim.canonical_id,
      source_id: payload.source_id,
      artifact_id: artifact.canonical_id,
      locator: payload.locator,
      excerpt_optional: payload.excerpt_optional ?? null,
    };
    saveCitation(citation);
    if (claim.lifecycle_state === "draft") {
      claim.lifecycle_state = "pending_evidence";
      saveClaim(claim);
    }
    const event = publishKnowledgeEvent({
      event_type: "knowledge.citation_attached",
      entity_id: citation.canonical_id,
      entity_type: "Citation",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { claim_id: claim.canonical_id, source_id: payload.source_id },
    });
    return ok(citation.canonical_id, "Citation", null, "draft", 1, [event.event_id]);
  }

  private submitForReview(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as SubmitKnowledgeArtifactForReviewPayload;
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });
    const prev = artifact.lifecycle_state;
    assertArtifactTransition(prev, "review", artifact.canonical_id);
    artifact.lifecycle_state = "review";
    bumpEntity(artifact, envelope.actor_human_id, "Submit for review", ["lifecycle_state"]);
    saveArtifact(artifact);

    const reviewId = caeId("krv");
    const review: KnowledgeReviewRecord = {
      ...baseEntityFields(envelope, "Review", "KnowledgeReview", "review", artifact.canonical_id, "KnowledgeArtifact", artifact.initiative_id),
      object_type: "KnowledgeReview",
      lifecycle_state: "review",
      artifact_id: artifact.canonical_id,
      reviewer_human_id: envelope.actor_human_id,
      review_type: "peer",
      findings: null,
      completed_at: null,
    };
    review.canonical_id = reviewId;
    saveReview(review);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.artifact_submitted_for_review",
      entity_id: artifact.canonical_id,
      entity_type: "KnowledgeArtifact",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: artifact.current_version,
      payload: { from: prev, to: "review", review_id: reviewId },
    });
    return ok(artifact.canonical_id, "KnowledgeArtifact", prev, "review", artifact.current_version, [event.event_id]);
  }

  private completeReview(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as CompleteKnowledgeReviewPayload;
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });

    const review = readStoreSlice<KnowledgeReviewRecord>(KNOWLEDGE_STORE_KEYS.knowledge_reviews).find(
      (r) => r.canonical_id === payload.review_id
    );
    if (!review) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Review not found", entity_id: payload.review_id });
    }
    review.findings = payload.findings ?? "Review complete";
    review.completed_at = nowIso();
    review.lifecycle_state = "validated";
    saveReview(review);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.artifact_review_completed",
      entity_id: artifact.canonical_id,
      entity_type: "KnowledgeArtifact",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: artifact.current_version,
      payload: { review_id: payload.review_id },
    });
    return ok(artifact.canonical_id, "KnowledgeArtifact", artifact.lifecycle_state, artifact.lifecycle_state, artifact.current_version, [event.event_id]);
  }

  private validateArtifact(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as ValidateKnowledgeArtifactPayload;
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });
    const prev = artifact.lifecycle_state;
    assertArtifactTransition(prev, "validated", artifact.canonical_id);
    artifact.lifecycle_state = "validated";
    bumpEntity(artifact, envelope.actor_human_id, "Validate artifact", ["lifecycle_state"]);
    saveArtifact(artifact);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.artifact_validated",
      entity_id: artifact.canonical_id,
      entity_type: "KnowledgeArtifact",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: artifact.current_version,
      payload: { from: prev, to: "validated" },
    });
    return ok(artifact.canonical_id, "KnowledgeArtifact", prev, "validated", artifact.current_version, [event.event_id]);
  }

  private approveArtifact(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as ApproveKnowledgeArtifactPayload;
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });
    if (artifact.lifecycle_state !== "validated") {
      throw new KnowledgeDomainError({
        code: "KNOWLEDGE_APPROVAL_REQUIRED",
        message: "Artifact must be validated before approval",
        entity_id: artifact.canonical_id,
        current_state: artifact.lifecycle_state,
      });
    }

    const approvalId = caeId("kap");
    const approval: KnowledgeApprovalRecord = {
      ...baseEntityFields(envelope, "Approval", "KnowledgeApproval", "validated", artifact.canonical_id, "KnowledgeArtifact", artifact.initiative_id),
      object_type: "KnowledgeApproval",
      lifecycle_state: "validated",
      artifact_id: artifact.canonical_id,
      approver_human_id: envelope.actor_human_id,
      approval_type: payload.approval_type ?? "steward",
      approved_at: nowIso(),
    };
    approval.canonical_id = approvalId;
    saveApproval(approval);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.artifact_approved",
      entity_id: artifact.canonical_id,
      entity_type: "KnowledgeArtifact",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: artifact.current_version,
      payload: { approval_id: approvalId },
    });
    return ok(artifact.canonical_id, "KnowledgeArtifact", artifact.lifecycle_state, artifact.lifecycle_state, artifact.current_version, [event.event_id]);
  }

  private publishArtifact(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as PublishKnowledgeArtifactPayload;
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });
    assertPublishAllowed(artifact, hasApprovalForArtifact(artifact.canonical_id));

    const prev = artifact.lifecycle_state;
    assertArtifactTransition(prev, "published", artifact.canonical_id);
    artifact.lifecycle_state = "published";
    artifact.published_version_id = `ver-${artifact.current_version}`;
    bumpEntity(artifact, envelope.actor_human_id, "Publish artifact", ["lifecycle_state", "published_version_id"]);
    saveArtifact(artifact);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.artifact_published",
      entity_id: artifact.canonical_id,
      entity_type: "KnowledgeArtifact",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: artifact.current_version,
      payload: { from: prev, to: "published" },
    });
    return ok(artifact.canonical_id, "KnowledgeArtifact", prev, "published", artifact.current_version, [event.event_id]);
  }

  private createCourse(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as CreateCoursePayload;
    runValidationPipeline({ envelope, permissions }, { skipInstitution: true });

    const initiativeId = payload.initiative_id_optional ?? envelope.initiative_id_optional ?? null;
    const fields = baseEntityFields(
      envelope,
      payload.display_name,
      "Course",
      "draft",
      payload.domain_id,
      "KnowledgeDomain",
      initiativeId
    );
    const course: CourseRecord = {
      ...fields,
      object_type: "Course",
      lifecycle_state: "draft",
      domain_id: payload.domain_id,
      description: payload.description,
      estimated_hours: payload.estimated_hours ?? 1,
      published_version: null,
    };
    saveCourse(course);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.course_created",
      entity_id: course.canonical_id,
      entity_type: "Course",
      institution_id: envelope.institution_id,
      initiative_id_optional: initiativeId,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { display_name: payload.display_name },
    });
    return ok(course.canonical_id, "Course", null, "draft", 1, [event.event_id]);
  }

  private publishCourseVersion(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as PublishCourseVersionPayload;
    const course = requireCourse(payload.course_id);
    runValidationPipeline({ envelope, permissions, course });
    const prev = course.lifecycle_state;
    if (prev === "draft") assertCourseTransition(prev, "review", course.canonical_id);
    if (prev === "review" || prev === "draft") {
      if (prev === "draft") {
        course.lifecycle_state = "review";
        bumpEntity(course, envelope.actor_human_id, "Move to review", ["lifecycle_state"]);
      }
      assertCourseTransition(course.lifecycle_state, "published", course.canonical_id);
      course.lifecycle_state = "published";
    } else {
      assertCourseTransition(prev, "published", course.canonical_id);
      course.lifecycle_state = "published";
    }
    course.published_version = course.current_version;
    bumpEntity(course, envelope.actor_human_id, "Publish course version", ["lifecycle_state", "published_version"]);
    saveCourse(course);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.course_version_published",
      entity_id: course.canonical_id,
      entity_type: "Course",
      institution_id: envelope.institution_id,
      initiative_id_optional: course.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: course.current_version,
      payload: { published_version: course.published_version },
    });
    return ok(course.canonical_id, "Course", prev, course.lifecycle_state, course.current_version, [event.event_id]);
  }

  private enrollHuman(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as EnrollHumanInLearningPayload;
    if (payload.course_id) requireCourse(payload.course_id);
    runValidationPipeline({ envelope, permissions }, { skipInstitution: true });

    const fields = baseEntityFields(
      envelope,
      `Enrollment ${payload.human_id}`,
      "LearningEnrollment",
      "enrolled",
      payload.course_id ?? payload.learning_path_id ?? null,
      payload.course_id ? "Course" : "LearningPath",
      envelope.initiative_id_optional ?? null
    );
    const enrollment: LearningEnrollmentRecord = {
      ...fields,
      object_type: "LearningEnrollment",
      lifecycle_state: "enrolled",
      human_id: payload.human_id,
      course_id: payload.course_id ?? null,
      learning_path_id: payload.learning_path_id ?? null,
      enrolled_at: nowIso(),
    };
    saveEnrollment(enrollment);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.enrollment_created",
      entity_id: enrollment.canonical_id,
      entity_type: "LearningEnrollment",
      institution_id: envelope.institution_id,
      initiative_id_optional: enrollment.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { human_id: payload.human_id, course_id: payload.course_id },
    });
    return ok(enrollment.canonical_id, "LearningEnrollment", null, "enrolled", 1, [event.event_id]);
  }

  private recordProgress(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as RecordLearningProgressPayload;
    const enrollment = loadEnrollment(payload.enrollment_id);
    if (!enrollment) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Enrollment not found", entity_id: payload.enrollment_id });
    }
    runValidationPipeline({ envelope, permissions });
    enrollment.lifecycle_state = payload.progress_percent >= 100 ? "active" : "active";
    enrollment.updated_at = nowIso();
    saveEnrollment(enrollment);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.learning_progress_recorded",
      entity_id: enrollment.canonical_id,
      entity_type: "LearningEnrollment",
      institution_id: envelope.institution_id,
      initiative_id_optional: enrollment.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: enrollment.current_version,
      payload: { progress_percent: payload.progress_percent },
    });
    return ok(enrollment.canonical_id, "LearningEnrollment", enrollment.lifecycle_state, enrollment.lifecycle_state, enrollment.current_version, [event.event_id]);
  }

  private completeLearning(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as CompleteLearningTargetPayload;
    const course = requireCourse(payload.course_id);
    runValidationPipeline({ envelope, permissions, course });
    if (course.lifecycle_state === "draft") {
      throw new KnowledgeDomainError({
        code: "KNOWLEDGE_CHILD_CONSTRAINT",
        message: "Completion cannot bind to Draft Course",
        entity_id: course.canonical_id,
        requirement_ids: ["CAE-11.12-W2-DATA-014"],
      });
    }
    const publishedVersion = course.published_version ?? course.current_version;

    const fields = baseEntityFields(
      envelope,
      `Completion ${payload.human_id}`,
      "LearningCompletion",
      "completed",
      course.canonical_id,
      "Course",
      course.initiative_id
    );
    const completion: LearningCompletionRecord = {
      ...fields,
      object_type: "LearningCompletion",
      lifecycle_state: "completed",
      human_id: payload.human_id,
      course_id: course.canonical_id,
      completed_at: nowIso(),
      bound_artifact_version: course.current_version,
      bound_course_version: publishedVersion,
    };
    saveCompletion(completion);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.learning_completed",
      entity_id: completion.canonical_id,
      entity_type: "LearningCompletion",
      institution_id: envelope.institution_id,
      initiative_id_optional: course.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: {
        bound_course_version: publishedVersion,
        bound_artifact_version: course.current_version,
        human_id: payload.human_id,
      },
    });
    return ok(completion.canonical_id, "LearningCompletion", null, "completed", 1, [event.event_id]);
  }

  private verifyCompetency(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as VerifyHumanCompetencyPayload;
    const competency = loadCompetency(payload.competency_id);
    if (!competency) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Competency not found", entity_id: payload.competency_id });
    }
    runValidationPipeline({ envelope, permissions });

    const fields = baseEntityFields(
      envelope,
      `Competency ${payload.human_id}`,
      "HumanCompetencyRecord",
      "verified",
      competency.canonical_id,
      "Competency",
      competency.initiative_id
    );
    const record: HumanCompetencyRecord = {
      ...fields,
      object_type: "HumanCompetencyRecord",
      lifecycle_state: "verified",
      human_id: payload.human_id,
      competency_id: payload.competency_id,
      competency_level_id: payload.competency_level_id,
      evidence_ids: payload.evidence_ids ?? [],
      verified_by_human_id: envelope.actor_human_id,
    };
    saveHumanCompetency(record);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.competency_verified",
      entity_id: record.canonical_id,
      entity_type: "HumanCompetencyRecord",
      institution_id: envelope.institution_id,
      initiative_id_optional: competency.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { human_id: payload.human_id, competency_id: payload.competency_id },
    });
    return ok(record.canonical_id, "HumanCompetencyRecord", null, "verified", 1, [event.event_id]);
  }

  private startAssessmentAttempt(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as StartAssessmentAttemptPayload;
    const assessment = loadAssessment(payload.assessment_id);
    if (!assessment) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Assessment not found", entity_id: payload.assessment_id });
    }
    runValidationPipeline({ envelope, permissions });

    const fields = baseEntityFields(
      envelope,
      `Attempt ${payload.human_id}`,
      "AssessmentAttempt",
      "in_progress",
      assessment.canonical_id,
      "Assessment",
      assessment.initiative_id
    );
    const attempt: AssessmentAttemptRecord = {
      ...fields,
      object_type: "AssessmentAttempt",
      lifecycle_state: "in_progress",
      assessment_id: assessment.canonical_id,
      human_id: payload.human_id,
      attempt_number: 1,
      started_at: nowIso(),
      submitted_at: null,
    };
    saveAssessmentAttempt(attempt);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.assessment_attempt_started",
      entity_id: attempt.canonical_id,
      entity_type: "AssessmentAttempt",
      institution_id: envelope.institution_id,
      initiative_id_optional: assessment.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { assessment_id: assessment.canonical_id },
    });
    return ok(attempt.canonical_id, "AssessmentAttempt", null, "in_progress", 1, [event.event_id]);
  }

  private evaluateAssessment(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as EvaluateAssessmentAttemptPayload;
    const attempt = loadAssessmentAttempt(payload.attempt_id);
    if (!attempt) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Attempt not found", entity_id: payload.attempt_id });
    }
    const assessment = loadAssessment(attempt.assessment_id);
    if (!assessment) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Assessment not found", entity_id: attempt.assessment_id });
    }
    runValidationPipeline({ envelope, permissions });

    const passed = payload.score >= assessment.passing_score;
    attempt.lifecycle_state = "graded";
    attempt.submitted_at = nowIso();
    saveAssessmentAttempt(attempt);

    const resultId = caeId("kar");
    const result: AssessmentResultRecord = {
      ...baseEntityFields(envelope, "Assessment result", "AssessmentResult", passed ? "passed" : "failed", attempt.canonical_id, "AssessmentAttempt", assessment.initiative_id),
      object_type: "AssessmentResult",
      lifecycle_state: passed ? "passed" : "failed",
      attempt_id: attempt.canonical_id,
      assessment_id: assessment.canonical_id,
      human_id: attempt.human_id,
      score: payload.score,
      passed,
      graded_by_human_id: envelope.actor_human_id,
    };
    result.canonical_id = resultId;
    saveAssessmentResult(result);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.assessment_evaluated",
      entity_id: result.canonical_id,
      entity_type: "AssessmentResult",
      institution_id: envelope.institution_id,
      initiative_id_optional: assessment.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { score: payload.score, passed },
    });
    return ok(result.canonical_id, "AssessmentResult", null, result.lifecycle_state, 1, [event.event_id]);
  }

  private evaluateEligibility(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as EvaluateCertificationEligibilityPayload;
    const certification = loadCertification(payload.certification_id);
    if (!certification) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Certification not found", entity_id: payload.certification_id });
    }
    runValidationPipeline({ envelope, permissions });

    const eligible = certification.competency_ids.length === 0 && certification.course_ids.length === 0;
    const event = publishKnowledgeEvent({
      event_type: "knowledge.certification_eligibility_evaluated",
      entity_id: certification.canonical_id,
      entity_type: "Certification",
      institution_id: envelope.institution_id,
      initiative_id_optional: certification.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: certification.current_version,
      payload: { human_id: payload.human_id, eligible },
    });
    return {
      success: true,
      entity_id: certification.canonical_id,
      entity_type: "Certification",
      previous_status_optional: certification.lifecycle_state,
      new_status_optional: certification.lifecycle_state,
      version: certification.current_version,
      events: [event.event_id],
      warnings: eligible ? [] : ["Requirements not met"],
      next_required_actions: eligible ? [] : ["Complete required courses and competencies"],
      validation_errors: [],
    };
  }

  private awardCertification(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as AwardCertificationPayload;
    const certification = loadCertification(payload.certification_id);
    if (!certification) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Certification not found", entity_id: payload.certification_id });
    }
    runValidationPipeline({ envelope, permissions });

    const hasRequirements = certification.competency_ids.length > 0 || certification.course_ids.length > 0 || certification.requirement_ids.length > 0;
    if (hasRequirements) {
      throw new KnowledgeDomainError({
        code: "CERTIFICATION_REQUIREMENTS_UNMET",
        message: "Certification award blocked without verified requirements",
        entity_id: certification.canonical_id,
        requirement_ids: ["CAE-11.12-W1-CERT-001", "CAE-11.12-W3-CERT-001"],
        blocking_requirement: "EvaluateCertificationEligibility with requirements_met",
      });
    }

    const fields = baseEntityFields(
      envelope,
      `Award ${payload.human_id}`,
      "CertificationAward",
      "awarded",
      certification.canonical_id,
      "Certification",
      certification.initiative_id
    );
    const award: CertificationAwardRecord = {
      ...fields,
      object_type: "CertificationAward",
      lifecycle_state: "awarded",
      certification_id: certification.canonical_id,
      human_id: payload.human_id,
      awarded_at: nowIso(),
      expires_at: certification.expiration_months
        ? new Date(Date.now() + certification.expiration_months * 30 * 24 * 60 * 60 * 1000).toISOString()
        : null,
      requirements_met: true,
      awarded_by_human_id: envelope.actor_human_id,
    };
    saveCertificationAward(award);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.certification_awarded",
      entity_id: award.canonical_id,
      entity_type: "CertificationAward",
      institution_id: envelope.institution_id,
      initiative_id_optional: certification.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { human_id: payload.human_id, certification_id: certification.canonical_id },
    });
    return ok(award.canonical_id, "CertificationAward", null, "awarded", 1, [event.event_id]);
  }

  private createAISuggestion(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as CreateAIKnowledgeSuggestionPayload;
    runValidationPipeline({ envelope, permissions }, { skipInstitution: true });

    const fields = baseEntityFields(
      envelope,
      "AI Suggestion",
      "AIKnowledgeSuggestion",
      "pending",
      payload.artifact_id_optional ?? null,
      payload.artifact_id_optional ? "KnowledgeArtifact" : null,
      envelope.initiative_id_optional ?? null
    );
    const suggestion: AIKnowledgeSuggestionRecord = {
      ...fields,
      object_type: "AIKnowledgeSuggestion",
      lifecycle_state: "pending",
      artifact_id_optional: payload.artifact_id_optional ?? null,
      suggestion_text: payload.suggestion_text,
      generated_by_service_id: payload.service_identity_id,
      reviewed_by_human_id: null,
      is_ai_generated: true,
      does_not_create_truth: true,
      content_origin: "ai_generated",
    };
    saveAISuggestion(suggestion);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.ai_suggestion_created",
      entity_id: suggestion.canonical_id,
      entity_type: "AIKnowledgeSuggestion",
      institution_id: envelope.institution_id,
      initiative_id_optional: envelope.initiative_id_optional ?? null,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: payload.service_identity_id,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { does_not_create_truth: true },
    });
    return ok(suggestion.canonical_id, "AIKnowledgeSuggestion", null, "pending", 1, [event.event_id]);
  }

  private reviewAISuggestion(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as ReviewAIKnowledgeSuggestionPayload;
    const suggestion = loadAISuggestion(payload.suggestion_id);
    if (!suggestion) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Suggestion not found", entity_id: payload.suggestion_id });
    }
    runValidationPipeline({ envelope, permissions });

    const prev = suggestion.lifecycle_state;
    suggestion.lifecycle_state = payload.decision === "accepted" ? "accepted" : "rejected";
    suggestion.reviewed_by_human_id = envelope.actor_human_id;
    suggestion.updated_at = nowIso();
    saveAISuggestion(suggestion);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.ai_suggestion_reviewed",
      entity_id: suggestion.canonical_id,
      entity_type: "AIKnowledgeSuggestion",
      institution_id: envelope.institution_id,
      initiative_id_optional: suggestion.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: suggestion.current_version,
      payload: { decision: payload.decision, rationale: payload.rationale },
    });
    return ok(suggestion.canonical_id, "AIKnowledgeSuggestion", prev, suggestion.lifecycle_state, suggestion.current_version, [event.event_id]);
  }

  private createTranslationDraft(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as CreateKnowledgeTranslationDraftPayload;
    const artifact = requireArtifact(payload.source_artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });

    const fields = baseEntityFields(
      envelope,
      `Translation ${payload.target_language}`,
      "KnowledgeTranslation",
      "draft",
      artifact.canonical_id,
      "KnowledgeArtifact",
      artifact.initiative_id
    );
    const translation: KnowledgeTranslationRecord & { source_version?: number; is_stale?: boolean } = {
      ...fields,
      object_type: "KnowledgeTranslation",
      lifecycle_state: "draft",
      source_artifact_id: artifact.canonical_id,
      target_language: payload.target_language,
      translated_body: payload.translated_body,
      translator_human_id: envelope.actor_human_id,
      is_ai_generated: false,
      source_version: artifact.current_version,
      is_stale: false,
    };
    saveTranslation(translation);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.translation_draft_created",
      entity_id: translation.canonical_id,
      entity_type: "KnowledgeTranslation",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { source_version: artifact.current_version, target_language: payload.target_language },
    });
    return ok(translation.canonical_id, "KnowledgeTranslation", null, "draft", 1, [event.event_id]);
  }

  private approveTranslation(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as ApproveKnowledgeTranslationPayload;
    const translation = loadTranslation(payload.translation_id) as (KnowledgeTranslationRecord & { is_stale?: boolean }) | null;
    if (!translation) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "Translation not found", entity_id: payload.translation_id });
    }
    const artifact = requireArtifact(translation.source_artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });

    if (translation.is_stale) {
      throw new KnowledgeDomainError({
        code: "TRANSLATION_STALE_SOURCE",
        message: "Translation is stale because source artifact version changed",
        entity_id: translation.canonical_id,
        requirement_ids: ["CAE-11.12-W3-TRN-001"],
        suggested_action: "Create a new translation draft from current artifact version",
      });
    }

    const prev = translation.lifecycle_state;
    translation.lifecycle_state = "published";
    translation.updated_at = nowIso();
    saveTranslation(translation);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.translation_approved",
      entity_id: translation.canonical_id,
      entity_type: "KnowledgeTranslation",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: translation.current_version,
      payload: { from: prev, to: "published" },
    });
    return ok(translation.canonical_id, "KnowledgeTranslation", prev, "published", translation.current_version, [event.event_id]);
  }

  private reportCorrection(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as ReportKnowledgeCorrectionPayload;
    const artifact = requireArtifact(payload.artifact_id);
    runValidationPipeline({ envelope, permissions, artifact });

    const fields = baseEntityFields(
      envelope,
      "Correction",
      "KnowledgeCorrection",
      "proposed",
      artifact.canonical_id,
      "KnowledgeArtifact",
      artifact.initiative_id
    );
    const correction: KnowledgeCorrectionRecord = {
      ...fields,
      object_type: "KnowledgeCorrection",
      lifecycle_state: "proposed",
      artifact_id: artifact.canonical_id,
      correction_text: payload.correction_text,
      proposed_by_human_id: envelope.actor_human_id,
      approved_by_human_id: null,
    };
    saveCorrection(correction);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.correction_reported",
      entity_id: correction.canonical_id,
      entity_type: "KnowledgeCorrection",
      institution_id: envelope.institution_id,
      initiative_id_optional: artifact.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { artifact_id: artifact.canonical_id },
    });
    return ok(correction.canonical_id, "KnowledgeCorrection", null, "proposed", 1, [event.event_id]);
  }

  private identifyConflict(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    const payload = envelope.payload as unknown as IdentifyKnowledgeConflictPayload;
    const claimA = loadClaim(payload.claim_a_id);
    const claimB = loadClaim(payload.claim_b_id);
    if (!claimA || !claimB) {
      throw new KnowledgeDomainError({ code: "KNOWLEDGE_NOT_FOUND", message: "One or both claims not found" });
    }
    runValidationPipeline({ envelope, permissions, claim: claimA });

    const fields = baseEntityFields(
      envelope,
      "Knowledge conflict",
      "KnowledgeConflict",
      "open",
      claimA.canonical_id,
      "KnowledgeClaim",
      claimA.initiative_id
    );
    const conflict: KnowledgeConflictRecord = {
      ...fields,
      object_type: "KnowledgeConflict",
      lifecycle_state: "open",
      claim_a_id: payload.claim_a_id,
      claim_b_id: payload.claim_b_id,
      conflict_description: payload.conflict_description,
      resolution_optional: null,
    };
    saveConflict(conflict);

    const event = publishKnowledgeEvent({
      event_type: "knowledge.conflict_identified",
      entity_id: conflict.canonical_id,
      entity_type: "KnowledgeConflict",
      institution_id: envelope.institution_id,
      initiative_id_optional: claimA.initiative_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { claim_a_id: payload.claim_a_id, claim_b_id: payload.claim_b_id },
    });
    return ok(conflict.canonical_id, "KnowledgeConflict", null, "open", 1, [event.event_id]);
  }
}

export const knowledgeDomainService = new KnowledgeDomainService();

export function assertKnowledgeMutationViaService(): never {
  throw new KnowledgeDomainError({
    code: "KNOWLEDGE_DIRECT_MUTATION_FORBIDDEN",
    message: "Direct knowledge mutation is forbidden; use KnowledgeDomainService",
    requirement_ids: ["CAE-11.12-W3-SVC-001"],
  });
}
