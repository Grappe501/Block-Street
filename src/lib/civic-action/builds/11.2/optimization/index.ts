/**
 * CAE-11.2-W7 — Objective Optimization facade (OBJ-OPT-001)
 */
export * from "./contracts";
export * from "./api-context";
export * from "./feedback-store";
export * from "./lesson-engine";
export * from "./root-cause-service";
export * from "./institutional-memory";
export * from "./pattern-recognition";
export * from "./template-evolution";
export * from "./workflow-optimization";
export * from "./governance-optimization";
export * from "./training-optimization";
export * from "./knowledge-evolution";
export * from "./automation-discovery";
export * from "./organization-health";
export * from "./objective-maturity";
export * from "./strategic-learning";
export * from "./continuous-improvement";
export * from "./simulation-engine";
export * from "./digital-twin";
export * from "./executive-improvement-brief";
export * from "./optimization-advisor";

import { nowIso } from "../../../utils";
import { OPTIMIZATION_CONTRACT_VERSION } from "./contracts";
import { generateContinuousImprovements, analyzeObjectiveCompletion } from "./continuous-improvement";
import { buildInstitutionalMemory, searchInstitutionalMemory } from "./institutional-memory";
import { extractLessons } from "./lesson-engine";
import { detectOptimizationPatterns } from "./pattern-recognition";
import { getTemplateEvolution } from "./template-evolution";
import { analyzeWorkflowOptimization } from "./workflow-optimization";
import { analyzeGovernanceOptimization } from "./governance-optimization";
import { identifyTrainingNeeds } from "./training-optimization";
import { analyzeKnowledgeEvolution } from "./knowledge-evolution";
import { discoverAutomationOpportunities } from "./automation-discovery";
import { measureOrganizationHealth } from "./organization-health";
import { measureObjectiveMaturity } from "./objective-maturity";
import { generateStrategicLearning } from "./strategic-learning";
import { runSimulation } from "./simulation-engine";
import { buildDigitalTwin, runDigitalTwinTest } from "./digital-twin";
import { buildExecutiveImprovementBrief } from "./executive-improvement-brief";
import { queryOptimizationAdvisor } from "./optimization-advisor";
import { recordOptimizationFeedback, listOptimizationFeedback } from "./feedback-store";

export type OptimizationContext = {
  actor_human_id: string;
  institution_id: string;
  initiative_id_optional?: string;
  objective_id_optional?: string;
};

export const objectiveOptimizationService = {
  contract_version: OPTIMIZATION_CONTRACT_VERSION,

  getOverview(ctx: OptimizationContext) {
    const initiativeId = ctx.initiative_id_optional;
    return {
      contract_version: OPTIMIZATION_CONTRACT_VERSION,
      institution_id: ctx.institution_id,
      optimizations: generateContinuousImprovements(ctx.institution_id, {
        initiativeId,
        objectiveId: ctx.objective_id_optional,
      }),
      memory_entry_count: buildInstitutionalMemory(ctx.institution_id, initiativeId ? { initiativeId } : undefined).length,
      health_summary: measureOrganizationHealth(ctx.institution_id, initiativeId),
      maturity: measureObjectiveMaturity(ctx.institution_id, initiativeId),
      advisory_only: true as const,
      generated_at: nowIso(),
    };
  },

  getLessons: (institutionId: string, initiativeId?: string, objectiveId?: string) =>
    extractLessons(institutionId, { initiativeId, objectiveId }),

  getPatterns: detectOptimizationPatterns,
  getTemplates: getTemplateEvolution,
  getWorkflows: analyzeWorkflowOptimization,
  getGovernance: analyzeGovernanceOptimization,
  getTraining: identifyTrainingNeeds,
  getKnowledge: analyzeKnowledgeEvolution,
  getAutomation: discoverAutomationOpportunities,
  getHealth: measureOrganizationHealth,
  getMaturity: measureObjectiveMaturity,
  getStrategy: generateStrategicLearning,
  getMemory: buildInstitutionalMemory,
  searchMemory: searchInstitutionalMemory,
  analyzeObjective: analyzeObjectiveCompletion,

  runSimulation: (institutionId: string, request: Parameters<typeof runSimulation>[1], initiativeId?: string) =>
    runSimulation(institutionId, request, initiativeId),

  buildDigitalTwin,
  runDigitalTwinTest,
  queryAdvisor: queryOptimizationAdvisor,
  buildExecutiveBrief: buildExecutiveImprovementBrief,

  recordFeedback: recordOptimizationFeedback,
  listFeedback: listOptimizationFeedback,
};

export type ObjectiveOptimizationService = typeof objectiveOptimizationService;
