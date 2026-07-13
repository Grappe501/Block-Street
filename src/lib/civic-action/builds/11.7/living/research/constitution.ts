/**
 * CAE-11.7-W5 — Research Network Constitution (LIX-005)
 */
export const LIX_RESEARCH_PRINCIPLE =
  "The Research Network discovers knowledge. Humans determine its meaning and its use.";

export const RESEARCH_ARCHITECTURE = [
  "identity",
  "localbrain",
  "context_runtime",
  "executive_assistant",
  "organizer",
  "research_network",
  "knowledge_validation",
  "human_review",
  "institutional_knowledge",
  "future_intelligence",
] as const;

export const RESEARCH_DOMAINS = [
  "government",
  "elections",
  "legislation",
  "court_decisions",
  "regulations",
  "public_records",
  "census_demographics",
  "economic_indicators",
  "grants",
  "academic_research",
  "news",
  "organizational_intelligence",
  "community_issues",
  "historical_archives",
  "campaign_intelligence",
  "technology",
  "education",
  "health_institutional",
  "agriculture",
  "environment",
  "transportation",
  "public_safety",
  "international",
  "internal_institutional",
] as const;

export const RESEARCH_MAY = [
  "search",
  "collect",
  "compare",
  "classify",
  "summarize",
  "cross_reference",
  "detect_changes",
  "monitor",
  "recommend",
  "prepare_research_briefs",
] as const;

export const RESEARCH_MAY_NOT = [
  "invent_evidence",
  "alter_historical_records",
  "conceal_contradictory_evidence",
  "manufacture_consensus",
  "change_institutional_policy",
  "publish_research_autonomously",
  "replace_human_judgment",
  "scrape_prohibited_data",
  "circumvent_permissions",
  "collect_personal_surveillance",
  "ignore_copyright",
  "misrepresent_sources",
  "invent_citations",
  "mutate_canonical_records",
] as const;

export const BRIEF_TYPES = [
  "executive",
  "mission",
  "county",
  "legislative",
  "grant",
  "research_summary",
  "historical_timeline",
  "issue_overview",
  "source_comparison",
  "evidence_package",
] as const;

export const KNOWLEDGE_PROMOTION_STAGES = [
  "temporary_research",
  "working_knowledge",
  "reviewed_knowledge",
  "institutional_knowledge",
  "training_material",
  "historical_archive",
] as const;

export const REQUIRED_RESEARCH_SERVICES = [
  "ResearchNetworkService",
  "SourceRegistryService",
  "ResearchAcquisitionService",
  "TrustFrameworkService",
  "NormalizationService",
  "EvidenceCorrelationService",
  "MonitoringService",
  "ChangeDetectionService",
  "ResearchBriefService",
  "OpportunityService",
  "ThreatService",
  "KnowledgePromotionService",
  "ResearchMemoryService",
] as const;

export function getResearchConstitution() {
  return {
    protocol_id: "CAE-11.7-W5",
    governing_principle: LIX_RESEARCH_PRINCIPLE,
    architecture: RESEARCH_ARCHITECTURE,
    domains: RESEARCH_DOMAINS,
    may: RESEARCH_MAY,
    may_not: RESEARCH_MAY_NOT,
    required_services: REQUIRED_RESEARCH_SERVICES,
  };
}
