/**
 * CAE-11.7-W7 — Communication optimization tests
 */
import { communicationOptimizationService, OPTIMIZATION_PROHIBITED_ACTIONS } from "./optimization";
import { queryOptimizationAdvisor } from "./optimization/optimization-advisor";
import { recordOptimizationFeedback, isOptimizationRejected } from "./optimization/feedback-store";
import { extractLessons } from "./optimization/lesson-engine";
import { getTemplateEvolution } from "./optimization/template-evolution";
import { getPlaybookRecommendations } from "./optimization/playbook-evolution";
import { generateKnowledgeStewardshipRecommendations } from "./optimization/knowledge-stewardship";
import { DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT } from "./ux/experience-context";

export type W7TestResult = { name: string; passed: boolean; detail?: string };

export function runComW7OptimizationTests(): W7TestResult[] {
  const results: W7TestResult[] = [];
  const institutionId = DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT.institution_id;
  const actorId = DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT.actor_human_id;

  const overview = communicationOptimizationService.getOverview({
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "optimization_overview",
    passed: overview.advisory_only === true && overview.contract_version === "11.7-w7.1",
  });

  const optimizations = overview.optimizations;
  const explainable =
    optimizations.length === 0 ||
    optimizations.every(
      (o) =>
        o.why &&
        o.evidence &&
        o.confidence &&
        o.advisory_only &&
        o.expected_benefit &&
        o.who_should_review &&
        o.what_changed
    );
  results.push({ name: "optimizations_explainable", passed: explainable, detail: `${optimizations.length} items` });

  const prohibited = queryOptimizationAdvisor(institutionId, "please approve and send this message automatically");
  results.push({
    name: "advisor_blocks_approval",
    passed: prohibited.blocked === true && prohibited.advisory_only,
  });

  const brief = communicationOptimizationService.buildExecutiveBrief(institutionId);
  results.push({
    name: "executive_improvement_brief",
    passed: !!brief.brief_id && brief.what_we_learned.length > 0 && brief.reading_time_minutes === 5,
  });

  const health = communicationOptimizationService.getHealth(institutionId);
  results.push({ name: "communication_health", passed: health.length >= 6, detail: `${health.length} dimensions` });

  const maturity = communicationOptimizationService.getMaturity(institutionId);
  results.push({
    name: "communication_maturity",
    passed: !!maturity.level && maturity.score >= 0,
    detail: maturity.level,
  });

  const sim = communicationOptimizationService.runSimulation(institutionId, {
    scenario_type: "communication_plan",
    parameters: { channels: 2 },
  });
  results.push({
    name: "simulation_non_mutating",
    passed: sim.advisory_only === true && sim.outcomes.length > 0,
  });

  const lessons = extractLessons(institutionId);
  results.push({ name: "lessons_engine_runs", passed: Array.isArray(lessons) });

  recordOptimizationFeedback({
    optimization_id: "opt-com-test-reject",
    action: "rejected",
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "feedback_rejection_learns",
    passed: isOptimizationRejected("opt-com-test-reject", institutionId),
  });

  results.push({
    name: "optimization_prohibited_actions",
    passed: OPTIMIZATION_PROHIBITED_ACTIONS.length >= 8,
    detail: `${OPTIMIZATION_PROHIBITED_ACTIONS.length} rules`,
  });

  const templates = getTemplateEvolution(institutionId);
  results.push({
    name: "template_evolution",
    passed: templates.length >= 6 && templates.every((t) => t.version_history.length >= 1),
    detail: `${templates.length} templates`,
  });

  const playbooks = getPlaybookRecommendations(institutionId);
  results.push({
    name: "playbook_recommendations",
    passed: Array.isArray(playbooks),
    detail: `${playbooks.length} recs`,
  });

  const stewardship = generateKnowledgeStewardshipRecommendations(institutionId);
  results.push({
    name: "knowledge_stewardship_advisory",
    passed: stewardship.every((s) => s.human_approval_required && s.advisory_only),
    detail: `${stewardship.length} items`,
  });

  return results;
}

export function allW7TestsPassed(): boolean {
  return runComW7OptimizationTests().every((t) => t.passed);
}
