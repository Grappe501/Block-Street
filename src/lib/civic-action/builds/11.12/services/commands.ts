/**
 * CAE-11.12-W3 — Knowledge command model (ADP-001)
 */
import type { CanonicalArtifactStatus, CanonicalCourseStatus, KnowledgeVisibility } from "../data-model";

export type KnowledgeCommandType =
  | "CreateKnowledgeDomain"
  | "CreateKnowledgeCollection"
  | "CreateKnowledgeArtifact"
  | "EditKnowledgeArtifactDraft"
  | "CreateKnowledgeClaim"
  | "RegisterKnowledgeSource"
  | "AttachCitation"
  | "AttachEvidenceReference"
  | "SubmitKnowledgeArtifactForReview"
  | "CompleteKnowledgeReview"
  | "ValidateKnowledgeArtifact"
  | "ApproveKnowledgeArtifact"
  | "PublishKnowledgeArtifact"
  | "SupersedeKnowledgeArtifact"
  | "ArchiveKnowledgeArtifact"
  | "RetractKnowledgeClaim"
  | "CreateCourse"
  | "PublishCourseVersion"
  | "CreateLearningPath"
  | "EnrollHumanInLearning"
  | "RecordLearningProgress"
  | "CompleteLearningTarget"
  | "WithdrawFromLearning"
  | "CreateCompetency"
  | "DefineCompetencyLevel"
  | "VerifyHumanCompetency"
  | "CreateAssessment"
  | "StartAssessmentAttempt"
  | "EvaluateAssessmentAttempt"
  | "CreateCertification"
  | "EvaluateCertificationEligibility"
  | "AwardCertification"
  | "RenewCertification"
  | "RevokeCertification"
  | "CreateAIKnowledgeSuggestion"
  | "ReviewAIKnowledgeSuggestion"
  | "CreateKnowledgeTranslationDraft"
  | "ApproveKnowledgeTranslation"
  | "ReportKnowledgeCorrection"
  | "IdentifyKnowledgeConflict"
  | "ResolveKnowledgeConflict"
  | "CreatePlaybook";

export interface KnowledgeCommandEnvelope<T = Record<string, unknown>> {
  command_id: string;
  command_type: KnowledgeCommandType;
  actor_human_id: string;
  service_identity_id_optional?: string | null;
  institution_id: string;
  active_membership_id: string;
  initiative_id_optional?: string | null;
  entity_id_optional?: string | null;
  expected_version_optional?: number | null;
  requested_at: string;
  request_id: string;
  correlation_id: string;
  idempotency_key?: string | null;
  reason_optional?: string | null;
  request_source?: "human" | "api" | "automation" | "ai_suggestion";
  payload: T;
}

export interface CreateKnowledgeArtifactPayload {
  display_name: string;
  body: string;
  summary?: string;
  domain_id: string;
  collection_id: string;
  artifact_type?: string;
  language?: string;
  visibility?: KnowledgeVisibility;
  initiative_id_optional?: string | null;
}

export interface EditKnowledgeArtifactDraftPayload {
  artifact_id: string;
  body?: string;
  summary?: string;
  display_name?: string;
}

export interface CreateKnowledgeClaimPayload {
  artifact_id: string;
  claim_text: string;
  requires_evidence?: boolean;
}

export interface AttachCitationPayload {
  claim_id: string;
  source_id: string;
  artifact_id: string;
  locator: string;
  excerpt_optional?: string | null;
}

export interface SubmitKnowledgeArtifactForReviewPayload {
  artifact_id: string;
}

export interface CompleteKnowledgeReviewPayload {
  artifact_id: string;
  review_id: string;
  findings?: string | null;
}

export interface ValidateKnowledgeArtifactPayload {
  artifact_id: string;
}

export interface ApproveKnowledgeArtifactPayload {
  artifact_id: string;
  approval_type?: string;
}

export interface PublishKnowledgeArtifactPayload {
  artifact_id: string;
}

export interface CreateCoursePayload {
  display_name: string;
  description: string;
  domain_id: string;
  estimated_hours?: number;
  initiative_id_optional?: string | null;
}

export interface PublishCourseVersionPayload {
  course_id: string;
}

export interface EnrollHumanInLearningPayload {
  human_id: string;
  course_id?: string | null;
  learning_path_id?: string | null;
}

export interface RecordLearningProgressPayload {
  enrollment_id: string;
  progress_percent: number;
  lesson_id_optional?: string | null;
}

export interface CompleteLearningTargetPayload {
  human_id: string;
  course_id: string;
  enrollment_id?: string | null;
}

export interface VerifyHumanCompetencyPayload {
  human_id: string;
  competency_id: string;
  competency_level_id: string;
  evidence_ids?: string[];
}

export interface StartAssessmentAttemptPayload {
  assessment_id: string;
  human_id: string;
}

export interface EvaluateAssessmentAttemptPayload {
  attempt_id: string;
  score: number;
}

export interface AwardCertificationPayload {
  certification_id: string;
  human_id: string;
}

export interface EvaluateCertificationEligibilityPayload {
  certification_id: string;
  human_id: string;
}

export interface CreateAIKnowledgeSuggestionPayload {
  suggestion_text: string;
  artifact_id_optional?: string | null;
  service_identity_id: string;
}

export interface ReviewAIKnowledgeSuggestionPayload {
  suggestion_id: string;
  decision: "accepted" | "rejected";
  rationale: string;
}

export interface CreateKnowledgeTranslationDraftPayload {
  source_artifact_id: string;
  target_language: string;
  translated_body: string;
}

export interface ApproveKnowledgeTranslationPayload {
  translation_id: string;
}

export interface ReportKnowledgeCorrectionPayload {
  artifact_id: string;
  correction_text: string;
}

export interface IdentifyKnowledgeConflictPayload {
  claim_a_id: string;
  claim_b_id: string;
  conflict_description: string;
}

export interface KnowledgeValidationError {
  code: string;
  message: string;
  field?: string;
  human_message?: string;
  technical_reason?: string;
  suggested_action?: string;
  blocking_requirement?: string;
  reference_id?: string;
}

export interface KnowledgeCommandResult {
  success: boolean;
  entity_id: string | null;
  entity_type: string | null;
  previous_status_optional: string | null;
  new_status_optional: string | null;
  version: number | null;
  events: string[];
  warnings: string[];
  next_required_actions: string[];
  validation_errors: KnowledgeValidationError[];
  audit_id_optional?: string | null;
}

export const KNOWLEDGE_PERMISSIONS: Record<KnowledgeCommandType, string> = {
  CreateKnowledgeDomain: "knowledge.domain.create",
  CreateKnowledgeCollection: "knowledge.collection.create",
  CreateKnowledgeArtifact: "knowledge.artifact.create",
  EditKnowledgeArtifactDraft: "knowledge.artifact.edit",
  CreateKnowledgeClaim: "knowledge.claim.create",
  RegisterKnowledgeSource: "knowledge.source.register",
  AttachCitation: "knowledge.citation.attach",
  AttachEvidenceReference: "knowledge.evidence.attach",
  SubmitKnowledgeArtifactForReview: "knowledge.artifact.review.submit",
  CompleteKnowledgeReview: "knowledge.artifact.review.complete",
  ValidateKnowledgeArtifact: "knowledge.artifact.validate",
  ApproveKnowledgeArtifact: "knowledge.artifact.approve",
  PublishKnowledgeArtifact: "knowledge.artifact.publish",
  SupersedeKnowledgeArtifact: "knowledge.artifact.supersede",
  ArchiveKnowledgeArtifact: "knowledge.artifact.archive",
  RetractKnowledgeClaim: "knowledge.claim.retract",
  CreateCourse: "knowledge.course.create",
  PublishCourseVersion: "knowledge.course.publish",
  CreateLearningPath: "knowledge.learning_path.create",
  EnrollHumanInLearning: "knowledge.enrollment.create",
  RecordLearningProgress: "knowledge.progress.record",
  CompleteLearningTarget: "knowledge.completion.record",
  WithdrawFromLearning: "knowledge.enrollment.withdraw",
  CreateCompetency: "knowledge.competency.create",
  DefineCompetencyLevel: "knowledge.competency.level.define",
  VerifyHumanCompetency: "knowledge.competency.verify",
  CreateAssessment: "knowledge.assessment.create",
  StartAssessmentAttempt: "knowledge.assessment.attempt.start",
  EvaluateAssessmentAttempt: "knowledge.assessment.attempt.evaluate",
  CreateCertification: "knowledge.certification.create",
  EvaluateCertificationEligibility: "knowledge.certification.eligibility",
  AwardCertification: "knowledge.certification.award",
  RenewCertification: "knowledge.certification.renew",
  RevokeCertification: "knowledge.certification.revoke",
  CreateAIKnowledgeSuggestion: "knowledge.ai.suggestion.create",
  ReviewAIKnowledgeSuggestion: "knowledge.ai.suggestion.review",
  CreateKnowledgeTranslationDraft: "knowledge.translation.create",
  ApproveKnowledgeTranslation: "knowledge.translation.approve",
  ReportKnowledgeCorrection: "knowledge.correction.report",
  IdentifyKnowledgeConflict: "knowledge.conflict.identify",
  ResolveKnowledgeConflict: "knowledge.conflict.resolve",
  CreatePlaybook: "knowledge.playbook.create",
};

export type KnowledgeCommand = KnowledgeCommandEnvelope;
export type KnowledgeResult = KnowledgeCommandResult;

export interface KnowledgeAuditEntry {
  audit_id: string;
  who: string;
  what: string;
  when: string;
  where: string;
  previous_state: Record<string, unknown> | null;
  new_state: Record<string, unknown>;
  reason: string | null;
  authority: string;
  request_source: string;
}

export const ALL_KNOWLEDGE_COMMAND_TYPES: KnowledgeCommandType[] = Object.keys(
  KNOWLEDGE_PERMISSIONS
) as KnowledgeCommandType[];
