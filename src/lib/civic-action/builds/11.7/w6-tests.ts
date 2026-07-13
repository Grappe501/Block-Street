/**
 * CAE-11.7-W6 — Communication intelligence tests
 */
import { communicationIntelligenceService, AI_PROHIBITED_ACTIONS } from "./intelligence";
import { detectDuplicateConversations } from "./intelligence/duplicate-detection";
import { runCommunicationCopilotQuery } from "./intelligence/copilot";
import { recordRecommendationFeedback, isRecommendationDismissed } from "./intelligence/feedback-store";
import { generateCommunicationRecommendations } from "./intelligence/recommendation-engine";
import { computeCommunicationHealth } from "./intelligence/communication-health";
import { DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT } from "./ux/experience-context";
import { jaccardSimilarity, tokenize } from "./intelligence/utils";

export type W6TestResult = { name: string; passed: boolean; detail?: string };

export function runComW6IntelligenceTests(): W6TestResult[] {
  const results: W6TestResult[] = [];
  const institutionId = DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT.institution_id;
  const actorId = DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT.actor_human_id;

  const sim = jaccardSimilarity(tokenize("volunteer registration drive"), tokenize("youth volunteer registration"));
  results.push({ name: "similarity_scoring", passed: sim > 0.2 && sim < 1, detail: String(sim) });

  const dupes = detectDuplicateConversations(institutionId, undefined, 0.3);
  results.push({ name: "duplicate_detection_runs", passed: Array.isArray(dupes), detail: `${dupes.length} pairs` });

  const recs = generateCommunicationRecommendations(institutionId, actorId);
  const hasExplainable =
    recs.length === 0 || recs.every((r) => r.why && r.evidence && r.confidence && r.advisory_only);
  results.push({ name: "recommendations_explainable", passed: hasExplainable, detail: `${recs.length} recs` });

  const prohibited = runCommunicationCopilotQuery("please approve and send this message", institutionId, actorId);
  results.push({
    name: "copilot_blocks_prohibited",
    passed: prohibited.intent === "prohibited_action" && prohibited.advisory_only,
  });

  const brief = communicationIntelligenceService.getBriefing({ actor_human_id: actorId, institution_id: institutionId });
  results.push({
    name: "executive_brief_generated",
    passed: !!brief.brief_id && brief.reading_time_minutes === 5,
  });

  const graph = communicationIntelligenceService.getKnowledgeGraph("conv-nonexistent", institutionId);
  results.push({ name: "knowledge_graph_null_safe", passed: graph === null });

  recordRecommendationFeedback({
    recommendation_id: "rec-com-test-dismiss",
    action: "dismiss",
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "feedback_dismiss_non_mutating",
    passed: isRecommendationDismissed("rec-com-test-dismiss", actorId),
  });

  results.push({
    name: "ai_prohibited_actions_registered",
    passed: AI_PROHIBITED_ACTIONS.length >= 10,
    detail: `${AI_PROHIBITED_ACTIONS.length} rules`,
  });

  const health = computeCommunicationHealth(institutionId);
  results.push({
    name: "communication_health",
    passed: health.advisory_only === true && typeof health.response_time_score === "number",
    detail: health.overall_health_band,
  });

  const portfolio = communicationIntelligenceService.getPortfolio({ actor_human_id: actorId, institution_id: institutionId });
  results.push({ name: "portfolio_advisory_only", passed: portfolio.advisory_only === true });

  return results;
}

export function allW6TestsPassed(): boolean {
  return runComW6IntelligenceTests().every((t) => t.passed);
}
