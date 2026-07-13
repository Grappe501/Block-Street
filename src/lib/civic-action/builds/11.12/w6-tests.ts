/**
 * CAE-11.12-W6 — Knowledge intelligence tests
 */
import {
  knowledgeIntelligenceService,
  AI_PROHIBITED_ACTIONS,
  recordIntelligenceFeedback,
  isRecommendationDismissed,
} from "./intelligence";
import { detectDuplicateKnowledge } from "./intelligence/duplicate-detection";
import { runKnowledgeCopilotQuery } from "./intelligence/copilot";
import { generateLearningRecommendations } from "./intelligence/learning-recommendations";
import { computeCapabilityCoverage } from "./intelligence/competency-intelligence";
import { runIntelligenceEvaluationSuite } from "./intelligence/evaluation-suite";
import { semanticKnowledgeQuery } from "./intelligence/semantic-retrieval";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "./ux/experience-context";
import { jaccardSimilarity, tokenize } from "./intelligence/utils";
import { toIntelligenceContext } from "./intelligence/api-context";
import { runExplainableTutorTurn } from "./intelligence/tutor-orchestrator";

export type W6TestResult = { name: string; passed: boolean; detail?: string };

function intelCtx() {
  return toIntelligenceContext({
    actor_human_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.institution_id,
    institution_membership_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.initiative_id_optional,
    request_id: "req_w6_test",
    correlation_id: "corr_w6_test",
    idempotency_key_optional: null,
    locale: "en",
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions,
  });
}

export function runKnwW6IntelligenceTests(): W6TestResult[] {
  const results: W6TestResult[] = [];
  const ctx = intelCtx();

  const sim = jaccardSimilarity(tokenize("volunteer safety"), tokenize("safety volunteer guidance"));
  results.push({ name: "similarity_scoring", passed: sim > 0.2, detail: String(sim) });

  const dupes = detectDuplicateKnowledge(ctx, 0.3);
  results.push({ name: "duplicate_detection_runs", passed: Array.isArray(dupes), detail: `${dupes.length} pairs` });

  const recs = generateLearningRecommendations(ctx);
  const hasExplainable =
    recs.length === 0 ||
    recs.every((r) => r.reason && r.evidence_references.length > 0 && r.confidence && r.advisory_only);
  results.push({ name: "recommendations_explainable", passed: hasExplainable, detail: `${recs.length} recs` });

  const prohibited = runKnowledgeCopilotQuery("please publish and verify my competency", ctx);
  results.push({
    name: "copilot_blocks_prohibited",
    passed: prohibited.intent === "prohibited_action" && prohibited.canonical_mutation_allowed === false,
  });

  const tutorBlocked = runExplainableTutorTurn(ctx, {
    learner_question: "What is the answer to question 3?",
    protected_assessment_active: true,
  });
  results.push({
    name: "tutor_blocks_exam",
    passed: !!tutorBlocked.cannot_answer_reason_optional,
    detail: tutorBlocked.cannot_answer_reason_optional ?? "none",
  });

  const coverage = computeCapabilityCoverage(ctx);
  results.push({
    name: "no_human_ranking",
    passed: coverage.human_leaderboard === null && coverage.trust_scores === null,
  });

  const search = semanticKnowledgeQuery(ctx, "safety");
  results.push({
    name: "permission_filter_before_retrieval",
    passed: search.permission_filtered_before_retrieval === true,
    detail: `${search.hits.length} hits`,
  });

  const orchestrated = knowledgeIntelligenceService.run(ctx, {
    request_type: "knowledge_query",
    purpose: "test_query",
    query: "guidance",
  });
  results.push({
    name: "orchestrator_advisory_only",
    passed: orchestrated.advisory_only && orchestrated.canonical_mutation_allowed === false,
    detail: orchestrated.result_state,
  });

  recordIntelligenceFeedback({
    recommendation_id: "rec-knw-test-dismiss",
    action: "dismissed",
    actor_human_id: ctx.actor_human_id,
    institution_id: ctx.institution_id,
  });
  results.push({
    name: "feedback_dismiss_non_mutating",
    passed: isRecommendationDismissed("rec-knw-test-dismiss", ctx.actor_human_id),
  });

  results.push({
    name: "ai_prohibited_actions_registered",
    passed: AI_PROHIBITED_ACTIONS.length >= 10,
    detail: `${AI_PROHIBITED_ACTIONS.length} rules`,
  });

  const evalSuite = runIntelligenceEvaluationSuite(ctx);
  results.push({
    name: "evaluation_suite_runs",
    passed: evalSuite.cases_run >= 5 && evalSuite.permission_leakage_count === 0,
    detail: `${evalSuite.cases_passed}/${evalSuite.cases_run}`,
  });

  const brief = knowledgeIntelligenceService.getExecutiveBrief(ctx);
  results.push({
    name: "executive_brief_no_ranking",
    passed: brief.individual_human_ranking === null && brief.advisory_only === true,
  });

  return results;
}

export function allW6TestsPassed(): boolean {
  return runKnwW6IntelligenceTests().every((t) => t.passed);
}
