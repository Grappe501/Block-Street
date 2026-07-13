/**
 * CAE-11.7-W10 — Partnership Constitution (LIX-010)
 */
export const LIX_PARTNERSHIP_PRINCIPLE =
  "Trust is earned through repeated transparency, not intelligence.";

export const PARTNERSHIP_ARCHITECTURE = [
  "identity",
  "localbrain",
  "memory",
  "context",
  "executive_assistant",
  "organizer",
  "research",
  "conversation",
  "learning",
  "prediction",
  "multi_agent",
  "human_partnership",
  "living_institution",
] as const;

export const COLLABORATION_PATTERNS = [
  "solo_work",
  "pair_work",
  "committee_support",
  "executive_support",
  "field_organizing",
  "education",
  "research",
  "incident_response",
  "campaign_planning",
  "board_governance",
] as const;

export const PARTNERSHIP_MAY = [
  "calibrate_trust",
  "accumulate_wisdom",
  "self_evaluate",
  "collect_human_feedback",
  "track_outcomes",
  "evolve_institutional_memory",
  "measure_organizational_health",
  "expose_reasoning",
  "invite_not_instruct",
] as const;

export const PARTNERSHIP_MAY_NOT = [
  "hidden_reputation_systems",
  "secret_human_trust_scores",
  "penalize_disagreement",
  "hide_ai_mistakes",
  "rewrite_institutional_history",
  "silent_history_modification",
  "behavioral_manipulation",
  "replace_human_accountability",
  "autonomous_governance",
  "auto_mutate_canonical_records",
] as const;

export const REQUIRED_PARTNERSHIP_SERVICES = [
  "PartnershipService",
  "TrustCalibrationService",
  "InstitutionalWisdomService",
  "AISelfEvaluationService",
  "HumanFeedbackService",
  "RecommendationQualityService",
  "InstitutionalLearningService",
  "OrganizationalHealthService",
  "DecisionOutcomeService",
  "MemoryEvolutionService",
  "CollaborationService",
  "TransparencyService",
] as const;

export function getPartnershipConstitution() {
  return {
    protocol_id: "CAE-11.7-W10",
    governing_principle: LIX_PARTNERSHIP_PRINCIPLE,
    architecture: PARTNERSHIP_ARCHITECTURE,
    collaboration_patterns: COLLABORATION_PATTERNS,
    may: PARTNERSHIP_MAY,
    may_not: PARTNERSHIP_MAY_NOT,
    required_services: REQUIRED_PARTNERSHIP_SERVICES,
  };
}
