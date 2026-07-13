/**
 * CAE-11.7-W6 — Intelligence service facade
 */
export * from "./contracts";
export * from "./utils";
export * from "./api-context";
export * from "./conversation-analysis";
export * from "./meeting-analysis";
export * from "./decision-analysis";
export * from "./knowledge-intelligence";
export * from "./collaboration-intelligence";
export * from "./relationship-discovery";
export * from "./translation-intelligence";
export * from "./search-intelligence";
export * from "./communication-health";
export * from "./duplicate-detection";
export * from "./pattern-engine";
export * from "./recommendation-engine";
export * from "./portfolio-intelligence";
export * from "./executive-brief";
export * from "./institutional-memory";
export * from "./knowledge-evolution";
export * from "./copilot";
export * from "./feedback-store";

import { generateCommunicationRecommendations } from "./recommendation-engine";
import { assembleCommunicationPortfolio } from "./portfolio-intelligence";
import { computeCommunicationHealth } from "./communication-health";
import { generateExecutiveCommunicationBrief } from "./executive-brief";
import { runCommunicationCopilotQuery, explainCommunicationInsight } from "./copilot";
import { detectDuplicateConversations } from "./duplicate-detection";
import { detectCommunicationPatterns } from "./pattern-engine";
import { buildKnowledgeGraph, discoverRelationships } from "./relationship-discovery";
import { detectEmergingFaqs, suggestPlaybooks } from "./knowledge-intelligence";
import { analyzeDecisions } from "./decision-analysis";
import { analyzeMeetings } from "./meeting-analysis";
import { analyzeThreadHealth, detectUnansweredQuestions } from "./conversation-analysis";
import { indexInstitutionalMemory } from "./institutional-memory";
import { trackKnowledgeEvolution } from "./knowledge-evolution";
import { parseNaturalLanguageQuery } from "./search-intelligence";
import { suggestConversationalSpanish } from "./translation-intelligence";
import { INTELLIGENCE_CONTRACT_VERSION } from "./contracts";

export type IntelligenceContext = {
  actor_human_id: string;
  institution_id: string;
  initiative_id_optional?: string;
  conversation_id_optional?: string;
};

export const communicationIntelligenceService = {
  contract_version: INTELLIGENCE_CONTRACT_VERSION,

  getRecommendations(ctx: IntelligenceContext) {
    return generateCommunicationRecommendations(ctx.institution_id, ctx.actor_human_id, {
      initiativeId: ctx.initiative_id_optional,
      conversationId: ctx.conversation_id_optional,
    });
  },

  getPortfolio(ctx: IntelligenceContext) {
    return assembleCommunicationPortfolio(ctx.institution_id, ctx.initiative_id_optional);
  },

  getHealth(ctx: IntelligenceContext) {
    return computeCommunicationHealth(ctx.institution_id, ctx.initiative_id_optional);
  },

  getBriefing(ctx: IntelligenceContext) {
    return generateExecutiveCommunicationBrief(ctx.institution_id, ctx.actor_human_id, ctx.initiative_id_optional);
  },

  getDuplicates(institutionId: string, initiativeId?: string) {
    return detectDuplicateConversations(institutionId, initiativeId);
  },

  getKnowledgeGraph(conversationId: string, institutionId: string) {
    return buildKnowledgeGraph(conversationId, "conversation", institutionId);
  },

  getRelationships(institutionId: string, initiativeId?: string) {
    return discoverRelationships(institutionId, initiativeId);
  },

  getPatterns(institutionId: string, initiativeId?: string) {
    return detectCommunicationPatterns(institutionId, initiativeId);
  },

  getDecisions(institutionId: string, initiativeId?: string) {
    return analyzeDecisions(institutionId, initiativeId);
  },

  getMeetings(institutionId: string, initiativeId?: string) {
    return analyzeMeetings(institutionId, initiativeId);
  },

  getThreadHealth(institutionId: string, initiativeId?: string) {
    return analyzeThreadHealth(institutionId, initiativeId);
  },

  getUnansweredQuestions(institutionId: string, initiativeId?: string) {
    return detectUnansweredQuestions(institutionId, initiativeId);
  },

  getKnowledgeFaqs(institutionId: string, initiativeId?: string) {
    return detectEmergingFaqs(institutionId, initiativeId);
  },

  getPlaybookSuggestions(institutionId: string, initiativeId?: string) {
    return suggestPlaybooks(institutionId, initiativeId);
  },

  getInstitutionalMemory(institutionId: string, initiativeId?: string) {
    return indexInstitutionalMemory(institutionId, initiativeId);
  },

  getKnowledgeEvolution(institutionId: string, initiativeId?: string) {
    return trackKnowledgeEvolution(institutionId, initiativeId);
  },

  parseSearchQuery(query: string, initiativeId?: string) {
    return parseNaturalLanguageQuery(query, { initiativeId });
  },

  getTranslationAdvisory(institutionId: string) {
    return suggestConversationalSpanish(institutionId);
  },

  copilotQuery(query: string, ctx: IntelligenceContext) {
    return runCommunicationCopilotQuery(query, ctx.institution_id, ctx.actor_human_id, {
      initiativeId: ctx.initiative_id_optional,
      conversationId: ctx.conversation_id_optional,
    });
  },

  explain(topic: string, ctx: IntelligenceContext) {
    return explainCommunicationInsight(topic, ctx.institution_id, ctx.conversation_id_optional);
  },
};
