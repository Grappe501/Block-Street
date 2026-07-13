/**
 * CAE-11.12-W7 — Knowledge Optimization facade (KNW-OPT-001)
 */
export * from "./contracts";
export * from "./feedback-store";
export * from "./improvement-governance";
export * from "./improvement-implementation";
export * from "./continuous-improvement";
export * from "./knowledge-evolution";
export * from "./curriculum-evolution";
export * from "./competency-evolution";
export * from "./assessment-evolution";
export * from "./certification-evolution";
export * from "./playbook-evolution";
export * from "./research-agenda";
export * from "./institutional-wisdom";
export * from "./stewardship-operations";
export * from "./outcome-measurement";
export * from "./ai-improvement";
export * from "./maturity";
export * from "./simulation-engine";
export * from "./optimization-advisor";
export * from "./executive-improvement-brief";
export * from "./lesson-engine";

import { nowIso } from "../../../utils";
import { OPTIMIZATION_CONTRACT_VERSION } from "./contracts";
import { generateContinuousImprovements } from "./continuous-improvement";
import { generateKnowledgeEvolutionProposals } from "./knowledge-evolution";
import { generateCurriculumEvolutionProposals } from "./curriculum-evolution";
import { generateCompetencyEvolutionProposals } from "./competency-evolution";
import { generateAssessmentEvolutionProposals } from "./assessment-evolution";
import { generateCertificationEvolutionProposals } from "./certification-evolution";
import { generatePlaybookEvolutionCandidates } from "./playbook-evolution";
import { generateResearchAgendaCandidates } from "./research-agenda";
import { buildStewardWorkQueue, buildStewardPortfolio } from "./stewardship-operations";
import { recordImprovementOutcome, listImprovementOutcomes } from "./outcome-measurement";
import {
  createAIImprovementProposal,
  evaluateAIImprovementProposal,
  approveAIConfigurationChange,
  NO_AUTONOMOUS_RETRAINING,
} from "./ai-improvement";
import { measureKnowledgeMaturity, measureInstitutionalLearningHealth } from "./maturity";
import { runImprovementSimulation } from "./simulation-engine";
import { queryOptimizationAdvisor } from "./optimization-advisor";
import { buildExecutiveImprovementBrief } from "./executive-improvement-brief";
import { extractLearningLessons } from "./lesson-engine";
import { recordOptimizationFeedback, listOptimizationFeedback } from "./feedback-store";
import {
  createImprovementCandidate,
  triageImprovementCandidate,
  createImprovementProposal,
  transitionProposalStatus,
  createImprovementPilot,
  startImprovementPilot,
  stopImprovementPilot,
  listImprovementCandidates,
  listImprovementProposals,
  listImprovementPilots,
  getImprovementProposal,
} from "./improvement-governance";
import { implementApprovedImprovement } from "./improvement-implementation";
import { seedDefaultWisdom, listWisdomArtifacts } from "./institutional-wisdom";

export const knowledgeOptimizationService = {
  contract_version: OPTIMIZATION_CONTRACT_VERSION,

  getOverview(institutionId: string) {
    return {
      contract_version: OPTIMIZATION_CONTRACT_VERSION,
      institution_id: institutionId,
      optimizations: generateContinuousImprovements(institutionId),
      knowledge_evolution: generateKnowledgeEvolutionProposals(institutionId),
      curriculum_evolution: generateCurriculumEvolutionProposals(institutionId),
      competency_evolution: generateCompetencyEvolutionProposals(institutionId),
      assessment_evolution: generateAssessmentEvolutionProposals(institutionId),
      certification_evolution: generateCertificationEvolutionProposals(institutionId),
      playbook_evolution: generatePlaybookEvolutionCandidates(institutionId),
      research_agenda: generateResearchAgendaCandidates(institutionId),
      maturity: measureKnowledgeMaturity(institutionId),
      advisory_only: true as const,
      canonical_mutation_allowed: false as const,
      generated_at: nowIso(),
    };
  },

  createCandidate: createImprovementCandidate,
  triageCandidate: triageImprovementCandidate,
  createProposal: createImprovementProposal,
  transitionProposal: transitionProposalStatus,
  getProposal: getImprovementProposal,
  listCandidates: listImprovementCandidates,
  listProposals: listImprovementProposals,
  createPilot: createImprovementPilot,
  startPilot: startImprovementPilot,
  stopPilot: stopImprovementPilot,
  listPilots: listImprovementPilots,
  implementApproved: implementApprovedImprovement,
  recordOutcome: recordImprovementOutcome,
  listOutcomes: listImprovementOutcomes,

  getStewardQueue: buildStewardWorkQueue,
  getStewardPortfolio: buildStewardPortfolio,
  getMaturity: measureKnowledgeMaturity,
  getLearningHealth: measureInstitutionalLearningHealth,
  runSimulation: runImprovementSimulation,
  queryAdvisor: queryOptimizationAdvisor,
  buildExecutiveBrief: buildExecutiveImprovementBrief,
  getLessons: extractLearningLessons,
  seedWisdom: seedDefaultWisdom,
  listWisdom: listWisdomArtifacts,

  createAIProposal: createAIImprovementProposal,
  evaluateAIProposal: evaluateAIImprovementProposal,
  approveAIChange: approveAIConfigurationChange,
  noAutonomousRetraining: NO_AUTONOMOUS_RETRAINING,

  recordFeedback: recordOptimizationFeedback,
  listFeedback: listOptimizationFeedback,
};

export type KnowledgeOptimizationService = typeof knowledgeOptimizationService;
