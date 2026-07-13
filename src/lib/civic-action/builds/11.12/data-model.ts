/**
 * CAE-11.12-W2 — Canonical Knowledge Data Model (ADP-001)
 */
import type { KNOWLEDGE_LIFECYCLE } from "./constitution";

export type KnowledgeLifecycleState = (typeof KNOWLEDGE_LIFECYCLE)[number];

export type KnowledgeVisibility =
  | "private"
  | "institution_internal"
  | "initiative_participants"
  | "member_public"
  | "public";

export type GovernanceClassification = 1 | 2 | 3 | 4 | 5;

export type CanonicalArtifactStatus = KnowledgeLifecycleState;

export type CanonicalCourseStatus = "draft" | "review" | "published" | "active" | "retired" | "archived";

export type CanonicalCertificationStatus = "draft" | "review" | "active" | "suspended" | "expired" | "archived";

export type CanonicalCompetencyStatus = "draft" | "defined" | "active" | "deprecated" | "archived";

export type CanonicalClaimStatus =
  | "draft"
  | "pending_evidence"
  | "evidence_attached"
  | "validated"
  | "disputed"
  | "retracted"
  | "archived";

export type EvidenceStatus = "none" | "pending" | "attached" | "verified" | "insufficient";

export type ConfidenceLevel = "low" | "medium" | "high" | "verified";

export type ContentOrigin = "human" | "ai_assisted" | "ai_generated" | "imported" | "translated";

export interface KnowledgeEntityBase {
  canonical_id: string;
  public_id: string;
  display_name: string;
  canonical_slug: string;
  institution_id: string;
  initiative_id: string | null;
  parent_object_id: string | null;
  parent_object_type: string | null;
  object_type: string;
  visibility: KnowledgeVisibility;
  governance_classification: GovernanceClassification;
  steward_human_id: string;
  created_by: string;
  last_modified_by: string;
  created_at: string;
  updated_at: string;
  current_version: number;
  lifecycle_state: string;
  tags: string[];
  confidence_level: ConfidenceLevel;
  content_origin: ContentOrigin;
  is_ai_generated: boolean;
  human_summary_optional?: string;
  machine_summary_optional?: string;
  embedding_text_optional?: string;
}

export interface KnowledgeDomainRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeDomain";
  lifecycle_state: CanonicalArtifactStatus;
  description: string;
  domain_code: string;
  parent_domain_id: string | null;
}

export interface KnowledgeCollectionRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeCollection";
  lifecycle_state: CanonicalArtifactStatus;
  domain_id: string;
  description: string;
  collection_type: string;
}

export interface KnowledgeArtifactRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeArtifact";
  lifecycle_state: CanonicalArtifactStatus;
  collection_id: string;
  domain_id: string;
  artifact_type: string;
  body: string;
  summary: string;
  language: string;
  published_version_id: string | null;
  evidence_status: EvidenceStatus;
}

export interface KnowledgeVersionRecord {
  version_id: string;
  artifact_id: string;
  version_number: number;
  changed_by: string;
  changed_at: string;
  reason: string;
  affected_fields: string[];
  previous_version_id: string | null;
  snapshot: Record<string, unknown>;
  immutable: true;
}

export interface KnowledgeClaimRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeClaim";
  lifecycle_state: CanonicalClaimStatus;
  artifact_id: string;
  claim_text: string;
  evidence_status: EvidenceStatus;
  confidence_level: ConfidenceLevel;
  requires_evidence: boolean;
}

export interface SourceRecord extends KnowledgeEntityBase {
  object_type: "Source";
  lifecycle_state: CanonicalArtifactStatus;
  source_type: string;
  uri_optional: string | null;
  citation_text: string;
  reliability_score: number;
}

export interface CitationRecord extends KnowledgeEntityBase {
  object_type: "Citation";
  lifecycle_state: CanonicalArtifactStatus;
  claim_id: string;
  source_id: string;
  artifact_id: string;
  locator: string;
  excerpt_optional: string | null;
}

export interface EvidenceReferenceRecord extends KnowledgeEntityBase {
  object_type: "EvidenceReference";
  lifecycle_state: CanonicalArtifactStatus;
  claim_id: string;
  evidence_entity_id: string;
  evidence_entity_type: string;
  verification_status: EvidenceStatus;
  verified_by_human_id: string | null;
}

export interface KnowledgeRelationshipRecord {
  relationship_id: string;
  institution_id: string;
  source_entity_id: string;
  source_entity_type: string;
  target_entity_id: string;
  target_entity_type: string;
  relationship_type: string;
  created_at: string;
}

export interface KnowledgeReviewRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeReview";
  lifecycle_state: CanonicalArtifactStatus;
  artifact_id: string;
  reviewer_human_id: string;
  review_type: string;
  findings: string | null;
  completed_at: string | null;
}

export interface KnowledgeApprovalRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeApproval";
  lifecycle_state: CanonicalArtifactStatus;
  artifact_id: string;
  approver_human_id: string;
  approval_type: string;
  approved_at: string | null;
}

export interface CourseRecord extends KnowledgeEntityBase {
  object_type: "Course";
  lifecycle_state: CanonicalCourseStatus;
  domain_id: string;
  description: string;
  estimated_hours: number;
  published_version: number | null;
}

export interface ModuleRecord extends KnowledgeEntityBase {
  object_type: "Module";
  lifecycle_state: CanonicalCourseStatus;
  course_id: string;
  sequence_order: number;
}

export interface LessonRecord extends KnowledgeEntityBase {
  object_type: "Lesson";
  lifecycle_state: CanonicalCourseStatus;
  module_id: string;
  course_id: string;
  sequence_order: number;
  content: string;
}

export interface LearningObjectRecord extends KnowledgeEntityBase {
  object_type: "LearningObject";
  lifecycle_state: CanonicalCourseStatus;
  lesson_id: string;
  object_type_detail: string;
  content_uri_optional: string | null;
}

export interface LearningPathRecord extends KnowledgeEntityBase {
  object_type: "LearningPath";
  lifecycle_state: CanonicalCourseStatus;
  description: string;
  course_ids: string[];
  competency_ids: string[];
}

export interface LearningEnrollmentRecord extends KnowledgeEntityBase {
  object_type: "LearningEnrollment";
  lifecycle_state: "enrolled" | "active" | "completed" | "withdrawn" | "archived";
  human_id: string;
  course_id: string | null;
  learning_path_id: string | null;
  enrolled_at: string;
}

export interface LearningCompletionRecord extends KnowledgeEntityBase {
  object_type: "LearningCompletion";
  lifecycle_state: "completed" | "archived";
  human_id: string;
  course_id: string;
  completed_at: string;
  bound_artifact_version: number;
  bound_course_version: number;
}

export interface SkillRecord extends KnowledgeEntityBase {
  object_type: "Skill";
  lifecycle_state: CanonicalCompetencyStatus;
  description: string;
  skill_category: string;
}

export interface CompetencyRecord extends KnowledgeEntityBase {
  object_type: "Competency";
  lifecycle_state: CanonicalCompetencyStatus;
  description: string;
  skill_ids: string[];
  assessment_required: boolean;
}

export interface CompetencyLevelRecord extends KnowledgeEntityBase {
  object_type: "CompetencyLevel";
  lifecycle_state: CanonicalCompetencyStatus;
  competency_id: string;
  level_name: string;
  level_rank: number;
  criteria: string;
}

export interface HumanCompetencyRecord extends KnowledgeEntityBase {
  object_type: "HumanCompetencyRecord";
  lifecycle_state: "pending" | "demonstrated" | "verified" | "expired" | "archived";
  human_id: string;
  competency_id: string;
  competency_level_id: string;
  evidence_ids: string[];
  verified_by_human_id: string | null;
}

export interface AssessmentRecord extends KnowledgeEntityBase {
  object_type: "Assessment";
  lifecycle_state: CanonicalCourseStatus;
  competency_id: string | null;
  course_id: string | null;
  passing_score: number;
  max_attempts: number;
}

export interface AssessmentAttemptRecord extends KnowledgeEntityBase {
  object_type: "AssessmentAttempt";
  lifecycle_state: "in_progress" | "submitted" | "graded" | "archived";
  assessment_id: string;
  human_id: string;
  attempt_number: number;
  started_at: string;
  submitted_at: string | null;
}

export interface AssessmentResultRecord extends KnowledgeEntityBase {
  object_type: "AssessmentResult";
  lifecycle_state: "passed" | "failed" | "archived";
  attempt_id: string;
  assessment_id: string;
  human_id: string;
  score: number;
  passed: boolean;
  graded_by_human_id: string;
}

export interface CertificationRecord extends KnowledgeEntityBase {
  object_type: "Certification";
  lifecycle_state: CanonicalCertificationStatus;
  description: string;
  competency_ids: string[];
  course_ids: string[];
  requirement_ids: string[];
  expiration_months: number | null;
  issuing_authority_human_id: string;
}

export interface CertificationAwardRecord extends KnowledgeEntityBase {
  object_type: "CertificationAward";
  lifecycle_state: "pending" | "awarded" | "expired" | "revoked" | "archived";
  certification_id: string;
  human_id: string;
  awarded_at: string | null;
  expires_at: string | null;
  requirements_met: boolean;
  awarded_by_human_id: string | null;
}

export interface PlaybookRecord extends KnowledgeEntityBase {
  object_type: "Playbook";
  lifecycle_state: CanonicalArtifactStatus;
  artifact_id: string;
  playbook_type: string;
  applicable_contexts: string[];
}

export interface StandardOperatingProcedureRecord extends KnowledgeEntityBase {
  object_type: "StandardOperatingProcedure";
  lifecycle_state: CanonicalArtifactStatus;
  artifact_id: string;
  procedure_code: string;
  steps: string[];
}

export interface ResearchProjectRecord extends KnowledgeEntityBase {
  object_type: "ResearchProject";
  lifecycle_state: CanonicalArtifactStatus;
  hypothesis: string;
  methodology: string;
  lead_researcher_human_id: string;
}

export interface ResearchFindingRecord extends KnowledgeEntityBase {
  object_type: "ResearchFinding";
  lifecycle_state: CanonicalArtifactStatus;
  project_id: string;
  finding_text: string;
  confidence_level: ConfidenceLevel;
  evidence_ids: string[];
}

export interface InstitutionalInsightRecord extends KnowledgeEntityBase {
  object_type: "InstitutionalInsight";
  lifecycle_state: CanonicalArtifactStatus;
  insight_text: string;
  source_entity_id: string;
  source_entity_type: string;
  applicability: string;
}

export interface InstitutionalLessonRecord extends KnowledgeEntityBase {
  object_type: "InstitutionalLesson";
  lifecycle_state: CanonicalArtifactStatus;
  observation: string;
  recommendation: string;
  linked_objective_id_optional: string | null;
  linked_mission_id_optional: string | null;
}

export interface InstitutionalMemoryRecord extends KnowledgeEntityBase {
  object_type: "InstitutionalMemoryRecord";
  lifecycle_state: CanonicalArtifactStatus;
  memory_type: string;
  content: string;
  retention_policy: string;
  source_entity_ids: string[];
}

export interface KnowledgeTranslationRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeTranslation";
  lifecycle_state: CanonicalArtifactStatus;
  source_artifact_id: string;
  target_language: string;
  translated_body: string;
  translator_human_id: string | null;
  is_ai_generated: boolean;
}

export interface TutorConversationRecord extends KnowledgeEntityBase {
  object_type: "TutorConversation";
  lifecycle_state: "active" | "completed" | "archived";
  human_id: string;
  course_id_optional: string | null;
  topic: string;
  is_ai_generated: boolean;
}

export interface AIKnowledgeSuggestionRecord extends KnowledgeEntityBase {
  object_type: "AIKnowledgeSuggestion";
  lifecycle_state: "pending" | "accepted" | "rejected" | "archived";
  artifact_id_optional: string | null;
  suggestion_text: string;
  generated_by_service_id: string;
  reviewed_by_human_id: string | null;
  is_ai_generated: true;
  does_not_create_truth: true;
}

export interface HumanReviewDecisionRecord extends KnowledgeEntityBase {
  object_type: "HumanReviewDecision";
  lifecycle_state: "pending" | "decided" | "archived";
  target_entity_id: string;
  target_entity_type: string;
  decision: string;
  decided_by_human_id: string;
  rationale: string;
}

export interface KnowledgeConflictRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeConflict";
  lifecycle_state: "open" | "under_review" | "resolved" | "archived";
  claim_a_id: string;
  claim_b_id: string;
  conflict_description: string;
  resolution_optional: string | null;
}

export interface KnowledgeGapRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeGap";
  lifecycle_state: "identified" | "in_progress" | "addressed" | "archived";
  domain_id: string;
  gap_description: string;
  priority: number;
  identified_by: string;
}

export interface KnowledgeCorrectionRecord extends KnowledgeEntityBase {
  object_type: "KnowledgeCorrection";
  lifecycle_state: "proposed" | "approved" | "applied" | "rejected" | "archived";
  artifact_id: string;
  correction_text: string;
  proposed_by_human_id: string;
  approved_by_human_id: string | null;
}

export interface KnowledgeHistoryEvent {
  event_id: string;
  entity_id: string;
  entity_type: string;
  event_type: string;
  institution_id: string;
  actor_human_id: string;
  occurred_at: string;
  payload: Record<string, unknown>;
}

export const KNOWLEDGE_STORE_KEYS = {
  knowledge_domains: "knowledge_domains",
  knowledge_collections: "knowledge_collections",
  knowledge_artifacts: "knowledge_artifacts",
  knowledge_versions: "knowledge_versions",
  knowledge_claims: "knowledge_claims",
  sources: "knowledge_sources",
  citations: "knowledge_citations",
  evidence_references: "knowledge_evidence_references",
  knowledge_relationships: "knowledge_relationships",
  knowledge_reviews: "knowledge_reviews",
  knowledge_approvals: "knowledge_approvals",
  courses: "knowledge_courses",
  modules: "knowledge_modules",
  lessons: "knowledge_lessons",
  learning_objects: "knowledge_learning_objects",
  learning_paths: "knowledge_learning_paths",
  learning_enrollments: "knowledge_learning_enrollments",
  learning_completions: "knowledge_learning_completions",
  learning_progress: "knowledge_learning_progress",
  skills: "knowledge_skills",
  competencies: "knowledge_competencies",
  competency_levels: "knowledge_competency_levels",
  human_competency_records: "knowledge_human_competency_records",
  assessments: "knowledge_assessments",
  assessment_attempts: "knowledge_assessment_attempts",
  assessment_results: "knowledge_assessment_results",
  certifications: "knowledge_certifications",
  certification_awards: "knowledge_certification_awards",
  certification_requirements: "knowledge_certification_requirements",
  playbooks: "knowledge_playbooks",
  standard_operating_procedures: "knowledge_sops",
  research_projects: "knowledge_research_projects",
  research_findings: "knowledge_research_findings",
  institutional_insights: "knowledge_institutional_insights",
  institutional_lessons: "knowledge_institutional_lessons",
  institutional_memory_records: "knowledge_institutional_memory",
  knowledge_translations: "knowledge_translations",
  tutor_conversations: "knowledge_tutor_conversations",
  ai_knowledge_suggestions: "knowledge_ai_suggestions",
  human_review_decisions: "knowledge_human_review_decisions",
  knowledge_conflicts: "knowledge_conflicts",
  knowledge_gaps: "knowledge_gaps",
  knowledge_corrections: "knowledge_corrections",
  stewardship_assignments: "knowledge_stewardship_assignments",
  version_audit: "knowledge_version_audit",
  history_events: "knowledge_history_events",
} as const;
