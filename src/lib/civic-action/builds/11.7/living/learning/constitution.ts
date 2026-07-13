/**
 * CAE-11.7-W7 — Learning Runtime Constitution (LIX-007)
 */
export const LIX_LEARNING_PRINCIPLE =
  "Experience becomes education. Education becomes competency. Competency becomes institutional capability.";

export const LEARNING_ARCHITECTURE = [
  "identity",
  "localbrain",
  "context_runtime",
  "executive_assistant",
  "organizer",
  "research_network",
  "conversation_intelligence",
  "learning_runtime",
  "competency_graph",
  "institutional_capability",
] as const;

export const COMPETENCY_DOMAINS = [
  "leadership",
  "community_organizing",
  "campaign_finance",
  "public_speaking",
  "canvassing",
  "legislative_analysis",
  "volunteer_management",
  "research",
  "grant_writing",
  "emergency_response",
  "governance",
  "education",
] as const;

export const CURRICULUM_TYPES = [
  "course",
  "learning_path",
  "micro_learning",
  "certification",
  "bootcamp",
  "seminar",
  "video",
  "podcast",
  "interactive_lab",
  "field_experience",
  "mission_based",
] as const;

export const LEARNING_MAY = [
  "teach",
  "coach",
  "explain",
  "recommend",
  "quiz",
  "simulate",
  "evaluate_competencies",
  "recommend_practice",
  "build_learning_plans",
  "generate_curricula",
] as const;

export const LEARNING_MAY_NOT = [
  "falsify_competency",
  "grant_certifications_without_requirements",
  "hide_deficiencies",
  "manipulate_assessments",
  "invent_training_history",
  "replace_human_evaluators",
  "rank_human_worth",
  "sell_educational_data",
  "share_learning_history_without_authorization",
  "mutate_canonical_records",
  "auto_certify",
] as const;

export const REQUIRED_LEARNING_SERVICES = [
  "LearningService",
  "CurriculumService",
  "CompetencyService",
  "AITutorService",
  "LearningPlanService",
  "CertificationService",
  "SimulationService",
  "KnowledgeGapService",
  "MentorService",
  "ExperienceLearningService",
  "UniversityService",
  "LearningAnalyticsService",
  "LearningGovernanceService",
] as const;

export function getLearningConstitution() {
  return {
    protocol_id: "CAE-11.7-W7",
    governing_principle: LIX_LEARNING_PRINCIPLE,
    architecture: LEARNING_ARCHITECTURE,
    competency_domains: COMPETENCY_DOMAINS,
    curriculum_types: CURRICULUM_TYPES,
    may: LEARNING_MAY,
    may_not: LEARNING_MAY_NOT,
    required_services: REQUIRED_LEARNING_SERVICES,
  };
}
