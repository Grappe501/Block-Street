/**
 * CAE-11.2-W6 — Intelligence service facade
 */
export * from "./contracts";
export * from "./utils";
export * from "./api-context";
export * from "./objective-graph";
export * from "./duplicate-detection";
export * from "./risk-intelligence";
export * from "./capacity-intelligence";
export * from "./progress-intelligence";
export * from "./execution-intelligence";
export * from "./timeline-intelligence";
export * from "./forecast-engine";
export * from "./historical-learning";
export * from "./pattern-engine";
export * from "./recommendation-engine";
export * from "./portfolio-intelligence";
export * from "./executive-brief";
export * from "./copilot";
export * from "./feedback-store";

import { buildObjectiveGraph } from "./objective-graph";
import { generateObjectiveRecommendations, generateAdvisorySuggestions } from "./recommendation-engine";
import { assemblePortfolioIntelligence } from "./portfolio-intelligence";
import { detectExecutionRisks } from "./risk-intelligence";
import { analyzeObjectiveCapacity } from "./capacity-intelligence";
import { analyzeProgress } from "./progress-intelligence";
import { analyzeExecution } from "./execution-intelligence";
import { detectTimelineCollisions } from "./timeline-intelligence";
import { generateForecasts } from "./forecast-engine";
import { generateExecutiveBrief } from "./executive-brief";
import { runObjectiveCopilotQuery, explainObjectiveInsight, recommendObjectiveActions } from "./copilot";
import { detectDuplicateObjectives } from "./duplicate-detection";
import { extractHistoricalInsights } from "./historical-learning";
import { detectExecutionPatterns } from "./pattern-engine";
import { INTELLIGENCE_CONTRACT_VERSION } from "./contracts";

export type IntelligenceContext = {
  actor_human_id: string;
  institution_id: string;
  initiative_id_optional?: string;
  objective_id_optional?: string;
};

export const objectiveIntelligenceService = {
  contract_version: INTELLIGENCE_CONTRACT_VERSION,

  getRecommendations(ctx: IntelligenceContext) {
    return generateObjectiveRecommendations(ctx.institution_id, ctx.actor_human_id, {
      initiativeId: ctx.initiative_id_optional,
      objectiveId: ctx.objective_id_optional,
    });
  },

  getPortfolio(ctx: IntelligenceContext) {
    return assemblePortfolioIntelligence(ctx.institution_id, ctx.initiative_id_optional);
  },

  getProgress(ctx: IntelligenceContext) {
    return analyzeProgress(ctx.institution_id, ctx.initiative_id_optional);
  },

  getExecution(ctx: IntelligenceContext) {
    return analyzeExecution(ctx.institution_id, ctx.initiative_id_optional);
  },

  getRisks(ctx: IntelligenceContext) {
    return detectExecutionRisks(ctx.institution_id, ctx.initiative_id_optional);
  },

  getCapacity(ctx: IntelligenceContext) {
    return analyzeObjectiveCapacity(ctx.institution_id, ctx.initiative_id_optional);
  },

  getTimelineCollisions(ctx: IntelligenceContext) {
    return detectTimelineCollisions(ctx.institution_id, ctx.initiative_id_optional);
  },

  getForecasts(ctx: IntelligenceContext) {
    return generateForecasts(ctx.institution_id, ctx.initiative_id_optional);
  },

  getBriefing(ctx: IntelligenceContext) {
    return generateExecutiveBrief(ctx.institution_id, ctx.actor_human_id, ctx.initiative_id_optional);
  },

  getDuplicates(institutionId: string, initiativeId?: string) {
    return detectDuplicateObjectives(institutionId, initiativeId);
  },

  getObjectiveGraph(objectiveId: string) {
    return buildObjectiveGraph(objectiveId);
  },

  getAdvisorySuggestions(objectiveId: string, ctx: IntelligenceContext) {
    return generateAdvisorySuggestions(objectiveId, ctx.institution_id, ctx.actor_human_id);
  },

  getHistoricalInsights(institutionId: string) {
    return extractHistoricalInsights(institutionId);
  },

  getPatterns(institutionId: string, initiativeId?: string) {
    return detectExecutionPatterns(institutionId, initiativeId);
  },

  copilotQuery(query: string, ctx: IntelligenceContext) {
    return runObjectiveCopilotQuery(query, ctx.institution_id, ctx.actor_human_id, {
      initiativeId: ctx.initiative_id_optional,
      objectiveId: ctx.objective_id_optional,
    });
  },

  explain(topic: string, ctx: IntelligenceContext) {
    return explainObjectiveInsight(topic, ctx.institution_id, ctx.objective_id_optional);
  },

  recommend(ctx: IntelligenceContext) {
    return recommendObjectiveActions(ctx.institution_id, ctx.actor_human_id, ctx.initiative_id_optional);
  },
};
