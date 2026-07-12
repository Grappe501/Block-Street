/**
 * CAE-11.1-W7 — Institutional Optimization facade
 */
export * from "./contracts";
import { caeId, nowIso } from "../../../utils";
import type { ExecutiveOptimizationBrief } from "./contracts";
import { generateContinuousImprovements } from "./continuous-improvement";
import { buildInstitutionalMemory, searchInstitutionalMemory } from "./institutional-memory";
import { analyzeProcessOptimization } from "./process-optimization";
import { getRecommendedWorkflows } from "./workflow-optimization";
import { analyzeGovernanceOptimization } from "./governance-optimization";
import { analyzeKnowledgeEvolution } from "./knowledge-evolution";
import { identifyTrainingNeeds } from "./training-intelligence";
import { getTemplateEvolution } from "./template-evolution";
import { discoverAutomationOpportunities } from "./automation-discovery";
import { measureOrganizationHealth } from "./organization-health";
import { gatherCommunityIntelligence } from "./community-intelligence";
import { generateStrategyRecommendations } from "./strategy-engine";
import { runSimulation } from "./simulation-engine";
import { compareScenarios, defaultScenarioOptions } from "./scenario-planning";
import { buildDigitalTwin, runDigitalTwinTest } from "./digital-twin";
import { queryOptimizationAdvisor } from "./optimization-advisor";
import { recordOptimizationFeedback, listOptimizationFeedback } from "./feedback-store";
import { detectOperationalRisks } from "../intelligence/risk-intelligence";

export const institutionalOptimizationService = {
  getOverview(institutionId: string) {
    return {
      contract_version: "11.1-w7.1",
      institution_id: institutionId,
      optimizations: generateContinuousImprovements(institutionId),
      memory_entry_count: buildInstitutionalMemory(institutionId).length,
      health_summary: measureOrganizationHealth(institutionId),
      advisory_only: true as const,
      generated_at: nowIso(),
    };
  },

  getProcesses: analyzeProcessOptimization,
  getWorkflows: getRecommendedWorkflows,
  getGovernance: analyzeGovernanceOptimization,
  getKnowledge: analyzeKnowledgeEvolution,
  getTraining: identifyTrainingNeeds,
  getTemplates: getTemplateEvolution,
  getAutomation: discoverAutomationOpportunities,
  getHealth: measureOrganizationHealth,
  getCommunity: gatherCommunityIntelligence,
  getStrategy: generateStrategyRecommendations,
  getMemory: buildInstitutionalMemory,
  searchMemory: searchInstitutionalMemory,

  runSimulation,
  compareScenarios: (institutionId: string, options?: Parameters<typeof compareScenarios>[1]) =>
    compareScenarios(institutionId, options ?? defaultScenarioOptions()),
  buildDigitalTwin,
  runDigitalTwinTest,
  queryAdvisor: queryOptimizationAdvisor,

  recordFeedback: recordOptimizationFeedback,
  listFeedback: listOptimizationFeedback,

  buildExecutiveBrief(institutionId: string): ExecutiveOptimizationBrief {
    const memory = buildInstitutionalMemory(institutionId);
    const yesterday = memory.slice(0, 2).map((m) => `${m.initiative_name}: ${m.decision_summary}`);
    const risks = detectOperationalRisks(institutionId)
      .filter((r) => r.severity === "high" || r.severity === "medium")
      .map((r) => r.explanation);

    return {
      brief_id: caeId("obrief"),
      yesterday_we_learned: yesterday.length ? yesterday : ["Awaiting completed Initiatives with documented outcomes."],
      todays_opportunities: generateContinuousImprovements(institutionId).slice(0, 5),
      process_improvements: analyzeProcessOptimization(institutionId),
      training_needed: identifyTrainingNeeds(institutionId),
      emerging_risks: risks.length ? risks : ["No high-severity operational risks in current portfolio."],
      suggested_optimizations: [
        ...analyzeGovernanceOptimization(institutionId),
        ...discoverAutomationOpportunities(institutionId),
      ].slice(0, 5),
      strategic_opportunities: generateStrategyRecommendations(institutionId).map((r) => r.title),
    };
  },
};

export type InstitutionalOptimizationService = typeof institutionalOptimizationService;
