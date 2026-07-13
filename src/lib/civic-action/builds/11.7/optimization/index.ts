/**
 * CAE-11.7-W7 — Communication Optimization facade (COM-OPT-001)
 */
export * from "./contracts";
export * from "./api-context";
export * from "./feedback-store";
export * from "./lesson-engine";
export * from "./conversation-learning";
export * from "./meeting-learning";
export * from "./decision-learning";
export * from "./documentation-optimization";
export * from "./knowledge-evolution";
export * from "./template-evolution";
export * from "./playbook-evolution";
export * from "./collaboration-optimization";
export * from "./communication-health-optimization";
export * from "./translation-learning";
export * from "./institutional-memory-governance";
export * from "./organizational-learning";
export * from "./communication-maturity";
export * from "./knowledge-stewardship";
export * from "./pattern-recognition";
export * from "./simulation-engine";
export * from "./executive-improvement-brief";
export * from "./optimization-advisor";
export * from "./continuous-improvement";

import { nowIso } from "../../../utils";
import { OPTIMIZATION_CONTRACT_VERSION } from "./contracts";
import { generateContinuousImprovements, analyzeCommunicationCompletion } from "./continuous-improvement";
import { extractLessons } from "./lesson-engine";
import { detectOptimizationPatterns } from "./pattern-recognition";
import { getTemplateEvolution } from "./template-evolution";
import { getPlaybookEvolution } from "./playbook-evolution";
import { analyzeKnowledgeEvolution } from "./knowledge-evolution";
import { measureCommunicationHealthOptimization } from "./communication-health-optimization";
import { measureCommunicationMaturity } from "./communication-maturity";
import { generateKnowledgeStewardshipRecommendations } from "./knowledge-stewardship";
import { assessInstitutionalMemoryGovernance } from "./institutional-memory-governance";
import { runSimulation } from "./simulation-engine";
import { buildExecutiveImprovementBrief } from "./executive-improvement-brief";
import { queryOptimizationAdvisor } from "./optimization-advisor";
import { recordOptimizationFeedback, listOptimizationFeedback } from "./feedback-store";

export type OptimizationContext = {
  actor_human_id: string;
  institution_id: string;
  initiative_id_optional?: string;
  conversation_id_optional?: string;
};

export const communicationOptimizationService = {
  contract_version: OPTIMIZATION_CONTRACT_VERSION,

  getOverview(ctx: OptimizationContext) {
    const initiativeId = ctx.initiative_id_optional;
    return {
      contract_version: OPTIMIZATION_CONTRACT_VERSION,
      institution_id: ctx.institution_id,
      optimizations: generateContinuousImprovements(ctx.institution_id, {
        initiativeId,
        conversationId: ctx.conversation_id_optional,
      }),
      memory_governance: assessInstitutionalMemoryGovernance(ctx.institution_id, initiativeId),
      health_summary: measureCommunicationHealthOptimization(ctx.institution_id, initiativeId),
      maturity: measureCommunicationMaturity(ctx.institution_id, initiativeId),
      advisory_only: true as const,
      generated_at: nowIso(),
    };
  },

  getLessons: (institutionId: string, initiativeId?: string, conversationId?: string) =>
    extractLessons(institutionId, { initiativeId, conversationId }),

  getPatterns: detectOptimizationPatterns,
  getTemplates: getTemplateEvolution,
  getPlaybooks: getPlaybookEvolution,
  getKnowledge: analyzeKnowledgeEvolution,
  getKnowledgeHealth: generateKnowledgeStewardshipRecommendations,
  getHealth: measureCommunicationHealthOptimization,
  getMaturity: measureCommunicationMaturity,
  getMemoryGovernance: assessInstitutionalMemoryGovernance,
  analyzeCommunication: analyzeCommunicationCompletion,

  runSimulation: (institutionId: string, request: Parameters<typeof runSimulation>[1], initiativeId?: string) =>
    runSimulation(institutionId, request, initiativeId),

  queryAdvisor: queryOptimizationAdvisor,
  buildExecutiveBrief: buildExecutiveImprovementBrief,

  recordFeedback: recordOptimizationFeedback,
  listFeedback: listOptimizationFeedback,
};

export type CommunicationOptimizationService = typeof communicationOptimizationService;
