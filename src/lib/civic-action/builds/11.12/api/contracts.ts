/**
 * CAE-11.12-W5 — Knowledge API contracts (KNW-API-001)
 */
import type { CanonicalArtifactStatus } from "../data-model";
import type { KnowledgeCommandType } from "../services/commands";

export type KnowledgeViewLevel =
  | "public"
  | "member"
  | "contributor"
  | "steward"
  | "owner"
  | "administrator"
  | "auditor";

export type KnowledgeApiContext = {
  actor_human_id: string;
  service_identity_id_optional: string | null;
  institution_id: string;
  institution_membership_id: string;
  initiative_id_optional: string | null;
  request_id: string;
  correlation_id: string;
  idempotency_key_optional: string | null;
  locale: "en" | "es";
  timezone: string;
  effective_permissions: string[];
};

export type KnowledgeApiErrorBody = {
  code: string;
  message: string;
  requirement_ids: string[];
  field_errors?: Record<string, string>;
  current_state_optional?: string;
  requested_state_optional?: string;
  retryable: boolean;
  human_blocked?: {
    title: string;
    explanation: string;
    items: string[];
    next_action?: string;
  };
};

export type KnowledgeArtifactView = {
  id: string;
  public_id: string;
  institution_id: string;
  initiative_id_optional: string | null;
  display_name: string;
  summary: string;
  artifact_type: string;
  lifecycle_state: CanonicalArtifactStatus;
  status_label: string;
  language: string;
  visibility: string;
  confidence_level: string;
  evidence_status: string;
  version: number;
  is_current: boolean;
  created_at: string;
  updated_at: string;
  view_level: KnowledgeViewLevel;
  permissions: string[];
  available_actions: string[];
};

export type KnowledgeListQuery = {
  institution_id?: string;
  initiative_id?: string;
  status?: string;
  artifact_type?: string;
  domain_id?: string;
  search?: string;
  cursor?: string;
  limit?: number;
  include_historical?: boolean;
};

export type LearningWorkspaceProjection = {
  actor_human_id: string;
  institution_id: string;
  active_enrollments: number;
  assigned_learning: { course_id: string; display_name: string; progress_percent: number }[];
  recommended_learning: { course_id: string; display_name: string; reason: string }[];
  due_soon: { enrollment_id: string; course_name: string; due_at: string | null }[];
  next_lesson: { lesson_id: string | null; course_id: string | null };
  competency_implications: string[];
  certification_implications: string[];
};

export const KNOWLEDGE_API_CONTRACT_VERSION = "11.12-w5.1";

export const LIFECYCLE_ACTION_ROUTES: Record<string, KnowledgeCommandType> = {
  "submit-review": "SubmitKnowledgeArtifactForReview",
  validate: "ValidateKnowledgeArtifact",
  approve: "ApproveKnowledgeArtifact",
  publish: "PublishKnowledgeArtifact",
};

export const HIGH_IMPACT_ACTIONS = new Set(["publish", "approve"]);

export const IDEMPOTENT_COMMANDS = new Set<KnowledgeCommandType>([
  "EnrollHumanInLearning",
  "RecordLearningProgress",
  "AwardCertification",
  "StartAssessmentAttempt",
  "CreateKnowledgeTranslationDraft",
]);

export const AI_TUTOR_PROHIBITED_INTENTS = [
  "exam_answer",
  "certification_issue",
  "private_human_data",
  "unrestricted_source",
] as const;
