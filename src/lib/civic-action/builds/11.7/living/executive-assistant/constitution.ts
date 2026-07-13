/**
 * CAE-11.7-W3 — Executive Assistant Constitution (LIX-003)
 */
export const LIX_EXECUTIVE_PRINCIPLE =
  "The Executive Assistant may prepare the decision, but the Human owns the decision.";

export const EXECUTIVE_ARCHITECTURE = [
  "verified_human_identity",
  "localbrain_memory_runtime",
  "context_intelligence_runtime",
  "executive_assistant_orchestrator",
  "briefings_meeting_preparation_decision_packages",
  "human_review_and_decision",
  "authorized_institutional_command",
  "follow_through_tracking",
  "institutional_memory",
] as const;

export const EXECUTIVE_CAPABILITY_CLASSES = [
  "observe",
  "retrieve",
  "summarize",
  "compare",
  "prepare",
  "draft",
  "recommend",
  "track",
  "remind",
  "escalate_for_human_attention",
] as const;

export const EXECUTIVE_PROHIBITED_ACTIONS = [
  "approve",
  "reject",
  "publish",
  "send",
  "assign",
  "spend",
  "contract",
  "vote",
  "certify",
  "change_governance",
  "exercise_emergency_authority",
] as const;

export const EXECUTIVE_RISK_CLASSES = ["low", "moderate", "high", "critical"] as const;

export const BRIEFING_TYPES = [
  "morning",
  "midday",
  "end_of_day",
  "weekly_leadership",
  "meeting",
  "mission",
  "travel",
  "decision",
  "crisis",
  "return_from_absence",
  "institution_switch",
  "custom",
] as const;

export const EXECUTIVE_OUTPUT_STATES = [
  "ready_for_review",
  "ready_with_limitations",
  "more_evidence_required",
  "conflicting_evidence",
  "human_clarification_required",
  "permission_restricted",
  "stale_context",
  "unavailable",
] as const;

export const DECISION_READINESS_STATES = [
  "ready_to_decide",
  "ready_with_conditions",
  "more_evidence_needed",
  "required_reviewer_missing",
  "authority_unclear",
  "conflict_of_interest_review_needed",
  "deadline_risk",
  "not_ready",
] as const;

export const COMMITMENT_STATUSES = [
  "suggested",
  "confirmed",
  "in_progress",
  "waiting",
  "delegated",
  "completed",
  "cancelled",
  "overdue",
  "disputed",
] as const;

export const UNCERTAINTY_LABELS = [
  "confirmed",
  "strong_evidence",
  "probable",
  "mixed_evidence",
  "uncertain",
  "disputed",
  "unknown",
  "stale",
] as const;

export const EXECUTIVE_AI_MAY_NOT = [
  "approve_or_reject_decisions",
  "send_communications_autonomously",
  "sign_or_accept_agreements",
  "vote",
  "commit_funds",
  "assign_people_without_authorized_command",
  "promise_action_on_behalf_of_human",
  "impersonate_the_human",
  "infer_authority_solely_from_title",
  "conceal_dissenting_evidence",
  "fabricate_consensus",
  "use_private_memory_as_institutional_evidence",
  "create_hidden_executive_profiling",
  "mutate_canonical_records",
] as const;

export const REQUIRED_EXECUTIVE_SERVICES = [
  "ExecutiveAssistantCapabilityRegistryService",
  "ExecutiveAssistantOrchestrator",
  "ExecutiveRoleContextService",
  "ExecutiveBriefingService",
  "MeetingPreparationService",
  "DecisionPackageService",
  "ExecutiveEvidenceService",
  "DissentLedgerService",
  "ExecutiveAttentionService",
  "ExecutiveCommitmentService",
  "ExecutiveDraftingService",
  "DelegationPreparationService",
  "HandoffPreparationService",
  "RiskPreparationService",
  "OpportunityPreparationService",
  "ExecutiveInquiryService",
  "ExecutivePrivacyService",
  "ExecutiveAuthorityBoundaryService",
  "ExecutiveAssistantAuditService",
] as const;

export const REQUIRED_EXECUTIVE_COMMANDS = [
  "GenerateExecutiveBriefing",
  "RefreshExecutiveBriefing",
  "ExpireExecutiveBriefing",
  "PrepareMeeting",
  "PrepareDecisionPackage",
  "RequestMoreDecisionEvidence",
  "SuggestCommitment",
  "ConfirmCommitment",
  "CorrectCommitment",
  "CompleteCommitment",
  "PrepareExecutiveDraft",
  "PrepareDelegation",
  "PrepareHandoff",
  "PrepareRiskEscalation",
  "PrepareOpportunityBrief",
  "AnswerExecutiveInquiry",
  "ReportExecutiveOutputProblem",
] as const;

export function getExecutiveConstitution() {
  return {
    protocol_id: "CAE-11.7-W3",
    governing_principle: LIX_EXECUTIVE_PRINCIPLE,
    architecture: EXECUTIVE_ARCHITECTURE,
    capability_classes: EXECUTIVE_CAPABILITY_CLASSES,
    prohibited_actions: EXECUTIVE_PROHIBITED_ACTIONS,
    required_services: REQUIRED_EXECUTIVE_SERVICES,
    required_commands: REQUIRED_EXECUTIVE_COMMANDS,
    ai_may_not: EXECUTIVE_AI_MAY_NOT,
  };
}
