/**
 * CAE-11.7-W5 — Research Network data model
 */
import type { BRIEF_TYPES, KNOWLEDGE_PROMOTION_STAGES, RESEARCH_DOMAINS } from "./constitution";

export type ResearchDomain = (typeof RESEARCH_DOMAINS)[number];
export type BriefType = (typeof BRIEF_TYPES)[number];
export type KnowledgePromotionStage = (typeof KNOWLEDGE_PROMOTION_STAGES)[number];

export const RESEARCH_STORE_KEYS = {
  sources: "lix_research_sources",
  items: "lix_research_items",
  monitors: "lix_research_monitors",
  changes: "lix_research_changes",
  briefs: "lix_research_briefs",
  opportunities: "lix_research_opportunities",
  threats: "lix_research_threats",
  promotions: "lix_research_promotions",
  memory: "lix_research_memory",
  correlations: "lix_research_correlations",
} as const;

export interface SourceRegistryEntry {
  source_id: string;
  name: string;
  owner: string;
  jurisdiction: string;
  domain: ResearchDomain;
  collection_method: string;
  reliability: number;
  update_frequency: string;
  authentication: string;
  terms_of_use: string;
  last_validated: string;
  status: "active" | "degraded" | "failed" | "restricted";
  permanently_trusted: false;
}

export interface ResearchItemRecord {
  research_id: string;
  human_id: string;
  institution_id: string;
  localbrain_id: string;
  source_id: string;
  source_version: string;
  title: string;
  summary: string;
  domain: ResearchDomain;
  retrieved_at: string;
  confidence: number;
  freshness: string;
  contradictory_evidence: string[];
  evidence_type: "canonical" | "verified" | "news" | "inference";
  status: "discovered" | "updated" | "reviewed";
}

export interface MonitorRecord {
  monitor_id: string;
  human_id: string;
  institution_id: string;
  domain: ResearchDomain;
  query: string;
  source_ids: string[];
  schedule: string;
  permission_aware: true;
  status: "active" | "paused";
  created_at: string;
}

export interface ChangeRecord {
  change_id: string;
  institution_id: string;
  domain: ResearchDomain;
  change_type: "new" | "updated" | "removed" | "contradiction" | "version_diff";
  subject: string;
  summary: string;
  source_id: string;
  detected_at: string;
  confidence: number;
}

export interface ResearchBriefRecord {
  brief_id: string;
  human_id: string;
  institution_id: string;
  brief_type: BriefType;
  title: string;
  summary: string;
  evidence: string[];
  confidence: number;
  open_questions: string[];
  contradictions: string[];
  further_research: string[];
  prepared_at: string;
  human_review_required: true;
  auto_published: false;
}

export interface OpportunityRecord {
  opportunity_id: string;
  institution_id: string;
  human_id: string;
  title: string;
  domain: ResearchDomain;
  description: string;
  evidence: string[];
  source_ids: string[];
  time_window: string | null;
  confidence: number;
  recommendation_only: true;
  status: "discovered" | "dismissed";
}

export interface ThreatRecord {
  threat_id: string;
  institution_id: string;
  human_id: string;
  title: string;
  domain: ResearchDomain;
  summary: string;
  evidence: string[];
  source_ids: string[];
  likelihood: string;
  impact: string;
  confidence: number;
  fear_based: false;
  status: "detected" | "dismissed";
}

export interface KnowledgePromotionRecord {
  promotion_id: string;
  research_id: string;
  human_id: string;
  institution_id: string;
  from_stage: KnowledgePromotionStage;
  to_stage: KnowledgePromotionStage;
  review_required: true;
  reviewed_by: string | null;
  status: "pending" | "approved" | "rejected";
  mutates_canonical: false;
}

export interface ResearchMemoryRecord {
  memory_id: string;
  human_id: string;
  institution_id: string;
  memory_type: "past_research" | "open_question" | "favorite_source" | "institutional_interest" | "historical_comparison";
  content: string;
  reference_ids: string[];
  updated_at: string;
}

export interface EvidenceCorrelationRecord {
  correlation_id: string;
  research_id: string;
  linked_type: "mission" | "knowledge" | "policy" | "training" | "decision_package" | "executive_briefing";
  linked_id: string;
  confidence: number;
  created_at: string;
}

export interface NormalizedEntityRecord {
  entity_type: string;
  canonical_id: string;
  source_id: string;
  label: string;
  normalized_at: string;
}
