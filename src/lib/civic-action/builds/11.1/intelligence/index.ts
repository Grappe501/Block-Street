/**
 * CAE-11.1-W6 — Intelligence service facade
 */
export * from "./contracts";
export * from "./institution-graph";
export * from "./initiative-graph";
export * from "./duplicate-detection";
export * from "./risk-intelligence";
export * from "./capacity-intelligence";
export * from "./dependency-forecast";
export * from "./timeline-intelligence";
export * from "./historical-learning";
export * from "./pattern-engine";
export * from "./recommendation-engine";
export * from "./portfolio-intelligence";
export * from "./executive-brief";
export * from "./copilot";
export * from "./feedback-store";

import { buildInstitutionGraph } from "./institution-graph";
import { buildInitiativeGraph } from "./initiative-graph";
import { generateAdvisorySuggestions, generateInstitutionRecommendations } from "./recommendation-engine";
import { assemblePortfolioIntelligence } from "./portfolio-intelligence";
import { detectOperationalRisks } from "./risk-intelligence";
import { analyzeInstitutionCapacity } from "./capacity-intelligence";
import { detectTimelineCollisions } from "./timeline-intelligence";
import { forecastDependencyCascades } from "./dependency-forecast";
import { generateExecutiveBrief } from "./executive-brief";
import { runInitiativeCopilotQuery } from "./copilot";
import { detectDuplicateCandidates } from "./duplicate-detection";
import { extractHistoricalInsights } from "./historical-learning";
import { INTELLIGENCE_CONTRACT_VERSION } from "./contracts";

export type IntelligenceContext = {
  actor_human_id: string;
  institution_id: string;
  initiative_id_optional?: string;
};

export const initiativeIntelligenceService = {
  contract_version: INTELLIGENCE_CONTRACT_VERSION,

  getRecommendations(ctx: IntelligenceContext) {
    return generateInstitutionRecommendations(ctx.institution_id, ctx.actor_human_id, {
      initiativeId: ctx.initiative_id_optional,
    });
  },

  getPortfolio(ctx: IntelligenceContext) {
    return assemblePortfolioIntelligence(ctx.institution_id);
  },

  getRisks(ctx: IntelligenceContext) {
    return detectOperationalRisks(ctx.institution_id);
  },

  getCapacity(ctx: IntelligenceContext) {
    return analyzeInstitutionCapacity(ctx.institution_id);
  },

  getTimelineCollisions(ctx: IntelligenceContext) {
    return detectTimelineCollisions(ctx.institution_id);
  },

  getDependencyForecast(initiativeId: string) {
    return forecastDependencyCascades(initiativeId);
  },

  getBriefing(ctx: IntelligenceContext) {
    return generateExecutiveBrief(ctx.institution_id, ctx.actor_human_id);
  },

  getDuplicates(institutionId: string) {
    return detectDuplicateCandidates(institutionId);
  },

  getInstitutionGraph(institutionId: string) {
    return buildInstitutionGraph(institutionId);
  },

  getInitiativeGraph(initiativeId: string) {
    return buildInitiativeGraph(initiativeId);
  },

  getAdvisorySuggestions(initiativeId: string, ctx: IntelligenceContext) {
    return generateAdvisorySuggestions(initiativeId, ctx.institution_id, ctx.actor_human_id);
  },

  getHistoricalInsights(institutionId: string) {
    return extractHistoricalInsights(institutionId);
  },

  copilotQuery(query: string, ctx: IntelligenceContext) {
    return runInitiativeCopilotQuery(query, ctx.institution_id, ctx.actor_human_id);
  },
};
