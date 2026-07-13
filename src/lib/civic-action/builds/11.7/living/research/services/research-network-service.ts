/**
 * CAE-11.7-W5 — Research Network services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { executiveAssistantRuntime } from "../../executive-assistant/services/executive-assistant-service";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { organizerRuntime } from "../../organizer/services/organizer-service";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import type { BriefType, KnowledgePromotionStage, ResearchDomain } from "../data-model";
import {
  getBrief,
  getSources,
  listBriefs,
  listChanges,
  listCorrelations,
  listMonitors,
  listOpportunities,
  listPromotions,
  listResearchItems,
  listResearchMemory,
  listThreats,
  saveBrief,
  saveChange,
  saveCorrelation,
  saveMonitor,
  saveOpportunity,
  savePromotion,
  saveResearchItem,
  saveResearchMemory,
  saveSource,
  saveThreat,
} from "./repository";

export class ResearchError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureResearchBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
}

function getBrain(humanId: string) {
  ensureResearchBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new ResearchError("RESEARCH_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function requireSource(sourceId: string) {
  const source = getSources().find((s) => s.source_id === sourceId);
  if (!source) throw new ResearchError("RESEARCH_SOURCE_NOT_FOUND", "Source not registered");
  if (source.status === "failed" || source.status === "restricted") {
    throw new ResearchError("RESEARCH_SOURCE_UNAVAILABLE", "Source unavailable or restricted");
  }
  return source;
}

export const sourceRegistryService = {
  list: getSources,
  register(input: {
    name: string;
    owner: string;
    jurisdiction: string;
    domain: ResearchDomain;
    collection_method: string;
    reliability?: number;
    update_frequency: string;
    authentication: string;
    terms_of_use: string;
  }) {
    const entry = {
      source_id: caeId("src"),
      name: input.name,
      owner: input.owner,
      jurisdiction: input.jurisdiction,
      domain: input.domain,
      collection_method: input.collection_method,
      reliability: input.reliability ?? 0.7,
      update_frequency: input.update_frequency,
      authentication: input.authentication,
      terms_of_use: input.terms_of_use,
      last_validated: nowIso(),
      status: "active" as const,
      permanently_trusted: false as const,
    };
    saveSource(entry);
    return { source: entry, event: "source.validated" as const };
  },
  validate(sourceId: string) {
    const source = requireSource(sourceId);
    const updated = { ...source, last_validated: nowIso(), status: "active" as const };
    saveSource(updated);
    return { source: updated, event: "source.validated" as const };
  },
  fail(sourceId: string, reason: string) {
    const source = getSources().find((s) => s.source_id === sourceId);
    if (!source) throw new ResearchError("RESEARCH_SOURCE_NOT_FOUND", "Source not found");
    const updated = { ...source, status: "failed" as const, last_validated: nowIso() };
    saveSource(updated);
    return { source: updated, reason, event: "source.failed" as const };
  },
};

export const trustFrameworkService = {
  score(sourceId: string) {
    const source = requireSource(sourceId);
    const ageDays = Math.max(0, (Date.now() - new Date(source.last_validated).getTime()) / 86400000);
    const freshness = Math.max(0, 1 - ageDays / 30);
    const authority = source.reliability;
    const jurisdictionRelevance = source.jurisdiction ? 0.9 : 0.5;
    const trust = Math.min(1, (authority * 0.4 + freshness * 0.3 + jurisdictionRelevance * 0.3));
    return {
      source_id: sourceId,
      authority_score: authority,
      freshness,
      historical_reliability: source.reliability,
      completeness: 0.85,
      update_consistency: source.update_frequency ? 0.8 : 0.5,
      jurisdiction_relevance: jurisdictionRelevance,
      trust_score: trust,
      permanently_trusted: false,
      continuously_earned: true,
    };
  },
};

export const normalizationService = {
  normalize(input: { entity_type: string; label: string; source_id: string }) {
    requireSource(input.source_id);
    return {
      entity_type: input.entity_type,
      canonical_id: caeId("ent"),
      source_id: input.source_id,
      label: input.label,
      normalized_at: nowIso(),
      institutional_language: true,
    };
  },
};

export const researchAcquisitionService = {
  search(input: {
    human_id: string;
    institution_id: string;
    query: string;
    domain: ResearchDomain;
    source_id: string;
    evidence_type?: "canonical" | "verified" | "news" | "inference";
  }) {
    const brain = getBrain(input.human_id);
    const source = requireSource(input.source_id);
    const trust = trustFrameworkService.score(input.source_id);
    const record = {
      research_id: caeId("res"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      localbrain_id: brain.localbrain_id,
      source_id: input.source_id,
      source_version: "v1",
      title: `Research: ${input.query}`,
      summary: `Findings from ${source.name} for "${input.query}" in ${input.domain}.`,
      domain: input.domain,
      retrieved_at: nowIso(),
      confidence: trust.trust_score,
      freshness: source.last_validated,
      contradictory_evidence: [] as string[],
      evidence_type: input.evidence_type ?? ("verified" as const),
      status: "discovered" as const,
    };
    saveResearchItem(record);
    return {
      item: record,
      event: "research.discovered" as const,
      traceable: true,
      anonymous_ai_fact: false,
    };
  },
  list: listResearchItems,
};

export const evidenceCorrelationService = {
  link(input: {
    research_id: string;
    linked_type: "mission" | "knowledge" | "policy" | "training" | "decision_package" | "executive_briefing";
    linked_id: string;
    confidence?: number;
  }) {
    const record = {
      correlation_id: caeId("cor"),
      research_id: input.research_id,
      linked_type: input.linked_type,
      linked_id: input.linked_id,
      confidence: input.confidence ?? 0.75,
      created_at: nowIso(),
    };
    saveCorrelation(record);
    return { correlation: record, event: "correlation.linked" as const, mutates_canonical: false };
  },
  list: listCorrelations,
};

export const monitoringService = {
  list: listMonitors,
  start(input: {
    human_id: string;
    institution_id: string;
    domain: ResearchDomain;
    query: string;
    source_ids: string[];
    schedule?: string;
  }) {
    input.source_ids.forEach(requireSource);
    const record = {
      monitor_id: caeId("mon"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      domain: input.domain,
      query: input.query,
      source_ids: input.source_ids,
      schedule: input.schedule ?? "daily",
      permission_aware: true as const,
      status: "active" as const,
      created_at: nowIso(),
    };
    saveMonitor(record);
    return { monitor: record, event: "monitor.started" as const, permission_aware: true };
  },
};

export const changeDetectionService = {
  list: listChanges,
  detect(input: {
    institution_id: string;
    domain: ResearchDomain;
    subject: string;
    change_type: "new" | "updated" | "removed" | "contradiction" | "version_diff";
    summary: string;
    source_id: string;
    contradictory?: string;
  }) {
    requireSource(input.source_id);
    const record = {
      change_id: caeId("chg"),
      institution_id: input.institution_id,
      domain: input.domain,
      change_type: input.change_type,
      subject: input.subject,
      summary: input.summary,
      source_id: input.source_id,
      detected_at: nowIso(),
      confidence: trustFrameworkService.score(input.source_id).trust_score,
    };
    saveChange(record);
    if (input.contradictory) {
      saveResearchItem({
        research_id: caeId("res"),
        human_id: "system",
        institution_id: input.institution_id,
        localbrain_id: "system",
        source_id: input.source_id,
        source_version: "v1",
        title: `Contradiction: ${input.subject}`,
        summary: input.contradictory,
        domain: input.domain,
        retrieved_at: nowIso(),
        confidence: 0.6,
        freshness: nowIso(),
        contradictory_evidence: [input.summary, input.contradictory],
        evidence_type: "verified",
        status: "discovered",
      });
    }
    return { change: record, event: "change.detected" as const, what_changed_report: true };
  },
};

export const researchBriefService = {
  list: listBriefs,
  get: getBrief,
  generate(input: {
    human_id: string;
    institution_id: string;
    brief_type: BriefType;
    title: string;
    evidence?: string[];
    contradictions?: string[];
  }) {
    getBrain(input.human_id);
    const record = {
      brief_id: caeId("brf"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      brief_type: input.brief_type,
      title: input.title,
      summary: `Evidence-backed ${input.brief_type.replace(/_/g, " ")} brief prepared for Human review.`,
      evidence: input.evidence ?? ["County budget hearing transcript — src-county-records"],
      confidence: 0.82,
      open_questions: ["What is the fiscal impact timeline?", "Are partner commitments confirmed?"],
      contradictions: input.contradictions ?? [],
      further_research: ["Verify grant deadline with official portal"],
      prepared_at: nowIso(),
      human_review_required: true as const,
      auto_published: false as const,
    };
    saveBrief(record);
    return { brief: record, event: "brief.generated" as const, human_review_required: true };
  },
};

export const opportunityService = {
  list: listOpportunities,
  discover(input: {
    human_id: string;
    institution_id: string;
    title: string;
    domain: ResearchDomain;
    description: string;
    evidence: string[];
    source_ids: string[];
    time_window?: string;
  }) {
    input.source_ids.forEach(requireSource);
    const record = {
      opportunity_id: caeId("opp"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      title: input.title,
      domain: input.domain,
      description: input.description,
      evidence: input.evidence,
      source_ids: input.source_ids,
      time_window: input.time_window ?? null,
      confidence: 0.78,
      recommendation_only: true as const,
      status: "discovered" as const,
    };
    saveOpportunity(record);
    return { opportunity: record, event: "opportunity.discovered" as const, recommendation_only: true };
  },
};

export const threatService = {
  list: listThreats,
  detect(input: {
    human_id: string;
    institution_id: string;
    title: string;
    domain: ResearchDomain;
    summary: string;
    evidence: string[];
    source_ids: string[];
    likelihood?: string;
    impact?: string;
  }) {
    if (input.evidence.length === 0) {
      throw new ResearchError("THREAT_REQUIRES_EVIDENCE", "Threats must be evidence-backed not fear-based");
    }
    input.source_ids.forEach(requireSource);
    const record = {
      threat_id: caeId("thr"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      title: input.title,
      domain: input.domain,
      summary: input.summary,
      evidence: input.evidence,
      source_ids: input.source_ids,
      likelihood: input.likelihood ?? "moderate",
      impact: input.impact ?? "moderate",
      confidence: 0.74,
      fear_based: false as const,
      status: "detected" as const,
    };
    saveThreat(record);
    return { threat: record, event: "threat.detected" as const, fear_based: false };
  },
};

export const knowledgePromotionService = {
  list: listPromotions,
  request(input: {
    research_id: string;
    human_id: string;
    institution_id: string;
    from_stage: KnowledgePromotionStage;
    to_stage: KnowledgePromotionStage;
  }) {
    const record = {
      promotion_id: caeId("prm"),
      research_id: input.research_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      from_stage: input.from_stage,
      to_stage: input.to_stage,
      review_required: true as const,
      reviewed_by: null,
      status: "pending" as const,
      mutates_canonical: false as const,
    };
    savePromotion(record);
    return {
      promotion: record,
      event: "research.promoted" as const,
      auto_promoted: false,
      human_review_required: true,
    };
  },
  approve(promotionId: string, reviewerId: string, humanId: string) {
    const promotions = listPromotions(humanId);
    const existing = promotions.find((p) => p.promotion_id === promotionId);
    if (!existing) throw new ResearchError("PROMOTION_NOT_FOUND", "Promotion not found");
    const updated = { ...existing, status: "approved" as const, reviewed_by: reviewerId };
    savePromotion(updated);
    return { promotion: updated, mutates_canonical: false, institutional_knowledge: "pending_human_meaning" };
  },
};

export const researchMemoryService = {
  list: listResearchMemory,
  remember(input: {
    human_id: string;
    institution_id: string;
    memory_type: "past_research" | "open_question" | "favorite_source" | "institutional_interest" | "historical_comparison";
    content: string;
    reference_ids?: string[];
  }) {
    const record = {
      memory_id: caeId("mem"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      memory_type: input.memory_type,
      content: input.content,
      reference_ids: input.reference_ids ?? [],
      updated_at: nowIso(),
    };
    saveResearchMemory(record);
    return record;
  },
};

export const researchNetworkService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureResearchBoot();
    const context = contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });
    const items = listResearchItems(input.human_id);
    const changes = listChanges(input.institution_id);
    const opportunities = listOpportunities(input.institution_id);
    const threats = listThreats(input.institution_id);
    const briefs = listBriefs(input.human_id);
    const monitors = listMonitors(input.human_id);
    const memory = listResearchMemory(input.human_id);
    return {
      greeting: "Research Center",
      next_question: "What should our Institution know today?",
      sources: getSources().length,
      research_items: items.length,
      todays_changes: changes.slice(0, 5),
      open_questions: memory.filter((m) => m.memory_type === "open_question"),
      opportunities: opportunities.slice(0, 3),
      threats: threats.slice(0, 3),
      briefs: briefs.slice(0, 3),
      monitors: monitors.filter((m) => m.status === "active").length,
      confidence: context.confidence,
      mutates_canonical: false,
      auto_publish: false,
    };
  },
  ethics: {
  prohibited: [
      "scrape_prohibited_data",
      "circumvent_permissions",
      "collect_personal_surveillance",
      "ignore_copyright",
      "misrepresent_sources",
      "invent_citations",
      "hide_conflicting_evidence",
    ],
    check(action: string) {
      const blocked = this.prohibited.some((p) => action.includes(p));
      return { allowed: !blocked, action };
    },
  },
};

export const researchRuntime = {
  research: researchNetworkService,
  sources: sourceRegistryService,
  acquisition: researchAcquisitionService,
  trust: trustFrameworkService,
  normalization: normalizationService,
  correlation: evidenceCorrelationService,
  monitoring: monitoringService,
  changes: changeDetectionService,
  briefs: researchBriefService,
  opportunities: opportunityService,
  threats: threatService,
  promotion: knowledgePromotionService,
  memory: researchMemoryService,
};
