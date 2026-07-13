/**
 * CAE-11.7-W9 — Multi-Agent Constitution (LIX-009)
 */
export const LIX_AGENT_PRINCIPLE =
  "Many specialized agents. One coordinated answer. One Human decision-maker.";

export const AGENT_ARCHITECTURE = [
  "human",
  "localbrain",
  "agent_orchestrator",
  "specialist_agents",
  "evidence_fusion",
  "human_review",
] as const;

export const AGENT_SPECIALTIES = [
  "executive_advisor",
  "research_analyst",
  "organizer",
  "legal_review",
  "grant_writer",
  "campaign_strategist",
  "volunteer_coordinator",
  "education_coach",
  "calendar_planner",
  "data_scientist",
  "policy_analyst",
  "county_intelligence",
  "communications_advisor",
  "finance_analyst",
  "technology_architect",
] as const;

export const CONSENSUS_STATES = [
  "consensus",
  "majority_recommendation",
  "split_recommendation",
  "insufficient_evidence",
  "human_review_required",
  "unknown",
] as const;

export const AGENT_MAY = [
  "collaborate",
  "share_evidence",
  "challenge_recommendations",
  "expose_disagreements",
  "build_stronger_recommendations",
  "request_human_review",
  "coordinate_parallel_work",
] as const;

export const AGENT_MAY_NOT = [
  "compete_for_authority",
  "replace_humans",
  "hidden_communication",
  "share_unauthorized_memory",
  "bypass_human_approval",
  "suppress_minority_evidence",
  "rewrite_other_agent_evidence",
  "auto_install_third_party",
  "mutate_canonical_records",
  "autonomous_institutional_actions",
  "create_autonomous_hierarchies",
] as const;

export const REQUIRED_AGENT_SERVICES = [
  "AgentRegistryService",
  "AgentOrchestrator",
  "CapabilityService",
  "AgentCommunicationService",
  "EvidenceBusService",
  "ConflictResolutionService",
  "ConsensusService",
  "HumanReviewService",
  "AgentMemoryService",
  "MarketplaceService",
  "IntegrationService",
  "AgentGovernanceService",
] as const;

export function getAgentConstitution() {
  return {
    protocol_id: "CAE-11.7-W9",
    governing_principle: LIX_AGENT_PRINCIPLE,
    architecture: AGENT_ARCHITECTURE,
    specialties: AGENT_SPECIALTIES,
    consensus_states: CONSENSUS_STATES,
    may: AGENT_MAY,
    may_not: AGENT_MAY_NOT,
    required_services: REQUIRED_AGENT_SERVICES,
  };
}
