/**
 * CAE-11.1-W6 — Initiative intelligence tests
 */
import { initiativeIntelligenceService, AI_PROHIBITED_ACTIONS } from "./intelligence";
import { detectDuplicateCandidates } from "./intelligence/duplicate-detection";
import { runInitiativeCopilotQuery } from "./intelligence/copilot";
import { recordRecommendationFeedback, isRecommendationDismissed } from "./intelligence/feedback-store";
import { generateInstitutionRecommendations } from "./intelligence/recommendation-engine";
import { DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT } from "./ux/experience-context";
import { jaccardSimilarity, tokenize } from "./intelligence/utils";

export type W6TestResult = { name: string; passed: boolean; detail?: string };

export function runIniW6IntelligenceTests(): W6TestResult[] {
  const results: W6TestResult[] = [];
  const institutionId = DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.institution_id;
  const actorId = DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.actor_human_id;

  const sim = jaccardSimilarity(tokenize("youth voter registration"), tokenize("youth registration drive"));
  results.push({ name: "similarity_scoring", passed: sim > 0.2 && sim < 1, detail: String(sim) });

  const dupes = detectDuplicateCandidates(institutionId, 0.3);
  results.push({ name: "duplicate_detection_runs", passed: Array.isArray(dupes), detail: `${dupes.length} pairs` });

  const recs = generateInstitutionRecommendations(institutionId, actorId);
  const hasExplainable = recs.length === 0 || recs.every((r) => r.why && r.evidence && r.confidence && r.advisory_only);
  results.push({ name: "recommendations_explainable", passed: hasExplainable, detail: `${recs.length} recs` });

  const prohibited = runInitiativeCopilotQuery("please approve this initiative", institutionId, actorId);
  results.push({
    name: "copilot_blocks_approval",
    passed: prohibited.intent === "prohibited_action" && prohibited.advisory_only,
  });

  const brief = initiativeIntelligenceService.getBriefing({ actor_human_id: actorId, institution_id: institutionId });
  results.push({ name: "executive_brief_generated", passed: !!brief.brief_id && brief.reading_time_minutes === 5 });

  const graph = initiativeIntelligenceService.getInstitutionGraph(institutionId);
  results.push({ name: "institution_graph_built", passed: graph.node_count > 0, detail: `${graph.node_count} nodes` });

  recordRecommendationFeedback({
    recommendation_id: "rec-test-dismiss",
    action: "dismiss",
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "feedback_dismiss_non_mutating",
    passed: isRecommendationDismissed("rec-test-dismiss", actorId),
  });

  results.push({
    name: "ai_prohibited_actions_registered",
    passed: AI_PROHIBITED_ACTIONS.length >= 8,
    detail: `${AI_PROHIBITED_ACTIONS.length} rules`,
  });

  const portfolio = initiativeIntelligenceService.getPortfolio({ actor_human_id: actorId, institution_id: institutionId });
  results.push({ name: "portfolio_intelligence", passed: portfolio.advisory_only === true });

  return results;
}

export function allW6TestsPassed(): boolean {
  return runIniW6IntelligenceTests().every((t) => t.passed);
}
