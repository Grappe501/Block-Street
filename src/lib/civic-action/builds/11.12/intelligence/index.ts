/**
 * CAE-11.12-W6 — Knowledge Intelligence service facade
 */
export * from "./contracts";
export * from "./utils";
export * from "./api-context";
export * from "./orchestrator";
export * from "./semantic-retrieval";
export * from "./graph-intelligence";
export * from "./quality-intelligence";
export * from "./gap-detection";
export * from "./duplicate-detection";
export * from "./contradiction-detection";
export * from "./adaptive-learning";
export * from "./learning-recommendations";
export * from "./competency-intelligence";
export * from "./certification-readiness";
export * from "./assessment-intelligence";
export * from "./research-intelligence";
export * from "./institutional-memory";
export * from "./tutor-orchestrator";
export * from "./executive-brief";
export * from "./copilot";
export * from "./feedback-store";
export * from "./privacy-controls";
export * from "./provenance";
export * from "./incident-service";
export * from "./human-review-routing";
export * from "./evaluation-suite";
export * from "./evidence-ledger";

import { runKnowledgeIntelligence } from "./orchestrator";
import { generateLearningRecommendations } from "./learning-recommendations";
import { computeKnowledgeHealth } from "./quality-intelligence";
import { detectKnowledgeGaps } from "./gap-detection";
import { buildKnowledgeGraph, analyzeKnowledgeImpact } from "./graph-intelligence";
import { computeCapabilityCoverage, evaluateRoleReadiness, detectTeamCapabilityGaps } from "./competency-intelligence";
import { evaluateCertificationReadiness } from "./certification-readiness";
import { recommendAdaptiveNextStep } from "./adaptive-learning";
import { synthesizeResearchEvidence } from "./research-intelligence";
import { queryInstitutionalMemory } from "./institutional-memory";
import { runExplainableTutorTurn } from "./tutor-orchestrator";
import { generateExecutiveKnowledgeBrief } from "./executive-brief";
import { runKnowledgeCopilotQuery } from "./copilot";
import { runIntelligenceEvaluationSuite } from "./evaluation-suite";
import { INTELLIGENCE_CONTRACT_VERSION, AI_PROHIBITED_ACTIONS } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";

export const knowledgeIntelligenceService = {
  contract_version: INTELLIGENCE_CONTRACT_VERSION,
  prohibited_actions: AI_PROHIBITED_ACTIONS,

  run(ctx: KnowledgeIntelligenceContext, input: Parameters<typeof runKnowledgeIntelligence>[1]) {
    return runKnowledgeIntelligence(ctx, input);
  },

  queryKnowledge(ctx: KnowledgeIntelligenceContext, query: string) {
    return runKnowledgeIntelligence(ctx, { request_type: "knowledge_query", purpose: "knowledge_search", query });
  },

  getHealth(ctx: KnowledgeIntelligenceContext) {
    return computeKnowledgeHealth(ctx);
  },

  getGaps(ctx: KnowledgeIntelligenceContext) {
    return detectKnowledgeGaps(ctx);
  },

  getGraph(anchorId: string, anchorType: string, ctx: KnowledgeIntelligenceContext) {
    return buildKnowledgeGraph(anchorId, anchorType, ctx);
  },

  getImpact(entityId: string, entityType: string, ctx: KnowledgeIntelligenceContext) {
    return analyzeKnowledgeImpact(entityId, entityType, ctx);
  },

  getLearningRecommendations(ctx: KnowledgeIntelligenceContext) {
    return generateLearningRecommendations(ctx);
  },

  getNextStep(ctx: KnowledgeIntelligenceContext, courseId?: string) {
    return recommendAdaptiveNextStep(ctx, { course_id: courseId });
  },

  getCapabilityCoverage(ctx: KnowledgeIntelligenceContext) {
    return computeCapabilityCoverage(ctx);
  },

  getRoleReadiness(ctx: KnowledgeIntelligenceContext, roleId: string, required?: string[]) {
    return evaluateRoleReadiness(ctx, { role_id: roleId, required_competency_ids: required });
  },

  getTeamGaps(ctx: KnowledgeIntelligenceContext, teamId: string) {
    return detectTeamCapabilityGaps(ctx, teamId);
  },

  getCertificationReadiness(ctx: KnowledgeIntelligenceContext, certificationId: string) {
    return evaluateCertificationReadiness(ctx, certificationId);
  },

  synthesizeResearch(ctx: KnowledgeIntelligenceContext, question: string) {
    return synthesizeResearchEvidence(ctx, question);
  },

  queryMemory(ctx: KnowledgeIntelligenceContext, query: string) {
    return queryInstitutionalMemory(ctx, query);
  },

  tutorTurn(ctx: KnowledgeIntelligenceContext, input: Parameters<typeof runExplainableTutorTurn>[1]) {
    return runExplainableTutorTurn(ctx, input);
  },

  getExecutiveBrief(ctx: KnowledgeIntelligenceContext) {
    return generateExecutiveKnowledgeBrief(ctx);
  },

  copilotQuery(query: string, ctx: KnowledgeIntelligenceContext) {
    return runKnowledgeCopilotQuery(query, ctx);
  },

  runEvaluationSuite(ctx: KnowledgeIntelligenceContext) {
    return runIntelligenceEvaluationSuite(ctx);
  },
};
