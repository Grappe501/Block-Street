/**
 * CAE-11.2-W6 — Objective intelligence tests
 */
import { objectiveIntelligenceService, AI_PROHIBITED_ACTIONS } from "./intelligence";
import { detectDuplicateObjectives } from "./intelligence/duplicate-detection";
import { runObjectiveCopilotQuery } from "./intelligence/copilot";
import { recordRecommendationFeedback, isRecommendationDismissed } from "./intelligence/feedback-store";
import { generateObjectiveRecommendations } from "./intelligence/recommendation-engine";
import { DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT } from "./ux/experience-context";
import { jaccardSimilarity, tokenize } from "./intelligence/utils";

export type W6TestResult = { name: string; passed: boolean; detail?: string };

export function runObjW6IntelligenceTests(): W6TestResult[] {
  const results: W6TestResult[] = [];
  const institutionId = DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.institution_id;
  const actorId = DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.actor_human_id;

  const sim = jaccardSimilarity(tokenize("volunteer registration drive"), tokenize("youth volunteer registration"));
  results.push({ name: "similarity_scoring", passed: sim > 0.2 && sim < 1, detail: String(sim) });

  const dupes = detectDuplicateObjectives(institutionId, undefined, 0.3);
  results.push({ name: "duplicate_detection_runs", passed: Array.isArray(dupes), detail: `${dupes.length} pairs` });

  const recs = generateObjectiveRecommendations(institutionId, actorId);
  const hasExplainable =
    recs.length === 0 || recs.every((r) => r.why && r.evidence && r.confidence && r.advisory_only);
  results.push({ name: "recommendations_explainable", passed: hasExplainable, detail: `${recs.length} recs` });

  const prohibited = runObjectiveCopilotQuery("please approve this objective", institutionId, actorId);
  results.push({
    name: "copilot_blocks_approval",
    passed: prohibited.intent === "prohibited_action" && prohibited.advisory_only,
  });

  const brief = objectiveIntelligenceService.getBriefing({ actor_human_id: actorId, institution_id: institutionId });
  results.push({
    name: "executive_brief_generated",
    passed: !!brief.brief_id && brief.reading_time_minutes === 5,
  });

  const graph = objectiveIntelligenceService.getObjectiveGraph("obj-nonexistent");
  results.push({ name: "objective_graph_null_safe", passed: graph === null });

  recordRecommendationFeedback({
    recommendation_id: "rec-obj-test-dismiss",
    action: "dismiss",
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "feedback_dismiss_non_mutating",
    passed: isRecommendationDismissed("rec-obj-test-dismiss", actorId),
  });

  results.push({
    name: "ai_prohibited_actions_registered",
    passed: AI_PROHIBITED_ACTIONS.length >= 10,
    detail: `${AI_PROHIBITED_ACTIONS.length} rules`,
  });

  const portfolio = objectiveIntelligenceService.getPortfolio({ actor_human_id: actorId, institution_id: institutionId });
  results.push({ name: "portfolio_intelligence", passed: portfolio.advisory_only === true });

  const progress = objectiveIntelligenceService.getProgress({ actor_human_id: actorId, institution_id: institutionId });
  results.push({ name: "progress_intelligence", passed: Array.isArray(progress) });

  return results;
}

export function allW6TestsPassed(): boolean {
  return runObjW6IntelligenceTests().every((t) => t.passed);
}
