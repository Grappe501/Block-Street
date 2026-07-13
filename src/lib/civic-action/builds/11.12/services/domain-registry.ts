/**
 * CAE-11.12-W3 — Domain service registry (ADP-001)
 */
export const KNOWLEDGE_CORE_SERVICES = [
  "KnowledgeArtifactLifecycleService",
  "KnowledgeArtifactCreationService",
  "KnowledgeArtifactPublicationService",
  "KnowledgeArtifactVersionService",
  "KnowledgeClaimLifecycleService",
  "KnowledgeClaimEvidenceService",
  "KnowledgeCitationService",
  "KnowledgeSourceRegistryService",
  "KnowledgeReviewService",
  "KnowledgeApprovalService",
] as const;

export const LEARNING_DOMAIN_SERVICES = [
  "CourseLifecycleService",
  "CoursePublicationService",
  "CourseEnrollmentService",
  "LearningProgressService",
  "LearningCompletionService",
  "ModuleManagementService",
  "LessonManagementService",
  "LearningObjectService",
  "LearningPathService",
  "CourseVersionPinService",
] as const;

export const COMPETENCY_DOMAIN_SERVICES = [
  "CompetencyDefinitionService",
  "CompetencyLevelService",
  "HumanCompetencyVerificationService",
  "SkillRegistryService",
  "CompetencyEvidenceService",
  "CompetencyDeprecationService",
] as const;

export const ASSESSMENT_DOMAIN_SERVICES = [
  "AssessmentCreationService",
  "AssessmentAttemptService",
  "AssessmentGradingService",
  "AssessmentResultService",
  "AssessmentEligibilityService",
] as const;

export const CERTIFICATION_DOMAIN_SERVICES = [
  "CertificationDefinitionService",
  "CertificationEligibilityService",
  "CertificationAwardService",
  "CertificationRenewalService",
  "CertificationRevocationService",
  "CertificationRequirementService",
] as const;

export const PRACTICE_DOMAIN_SERVICES = [
  "PlaybookService",
  "StandardOperatingProcedureService",
  "PracticeContextService",
  "PlaybookEvolutionService",
  "ExecutionTemplateService",
] as const;

export const RESEARCH_DOMAIN_SERVICES = [
  "ResearchProjectService",
  "ResearchFindingService",
  "ResearchEvidenceService",
  "ResearchSynthesisService",
] as const;

export const MEMORY_DOMAIN_SERVICES = [
  "InstitutionalMemoryService",
  "InstitutionalInsightService",
  "InstitutionalLessonService",
  "KnowledgeGapService",
  "KnowledgeCorrectionService",
] as const;

export const AI_KNOWLEDGE_SERVICES = [
  "AIKnowledgeSuggestionService",
  "AIKnowledgeReviewService",
  "TutorConversationService",
  "KnowledgeTranslationService",
  "TranslationStalenessService",
  "AITruthBoundaryService",
] as const;

export const SHARED_KNOWLEDGE_SERVICES = [
  "KnowledgeValidationService",
  "KnowledgeTraceabilityService",
  "KnowledgePermissionService",
  "KnowledgeRelationshipService",
  "KnowledgeHistoryService",
  "KnowledgeAuditService",
  "KnowledgeVersionService",
  "KnowledgeEventPublisher",
  "KnowledgeConflictService",
  "KnowledgeStewardshipService",
] as const;

export const ALL_KNOWLEDGE_DOMAIN_SERVICES = [
  ...KNOWLEDGE_CORE_SERVICES,
  ...LEARNING_DOMAIN_SERVICES,
  ...COMPETENCY_DOMAIN_SERVICES,
  ...ASSESSMENT_DOMAIN_SERVICES,
  ...CERTIFICATION_DOMAIN_SERVICES,
  ...PRACTICE_DOMAIN_SERVICES,
  ...RESEARCH_DOMAIN_SERVICES,
  ...MEMORY_DOMAIN_SERVICES,
  ...AI_KNOWLEDGE_SERVICES,
  ...SHARED_KNOWLEDGE_SERVICES,
] as const;

export const KNOWLEDGE_POLICIES = [
  { policy_id: "KNW-POL-001", rule: "No orphan knowledge artifacts", enforcement: "block" as const },
  { policy_id: "KNW-POL-002", rule: "Published artifacts immutable", enforcement: "block" as const },
  { policy_id: "KNW-POL-003", rule: "Evidence required before claim validation", enforcement: "block" as const },
  { policy_id: "KNW-POL-004", rule: "Course completion does not auto-verify competency", enforcement: "block" as const },
  { policy_id: "KNW-POL-005", rule: "AI cannot publish or certify", enforcement: "block" as const },
  { policy_id: "KNW-POL-006", rule: "Certification requires requirements_met", enforcement: "block" as const },
  { policy_id: "KNW-POL-007", rule: "Completion binds bound_course_version", enforcement: "block" as const },
];
