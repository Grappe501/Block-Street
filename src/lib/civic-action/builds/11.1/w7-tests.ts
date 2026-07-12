/**
 * CAE-11.1-W7 — Institutional optimization tests
 */
import { institutionalOptimizationService, OPTIMIZATION_PROHIBITED_ACTIONS } from "./optimization";
import { queryOptimizationAdvisor } from "./optimization/optimization-advisor";
import { recordOptimizationFeedback, isOptimizationRejected } from "./optimization/feedback-store";
import { DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT } from "./ux/experience-context";

export type W7TestResult = { name: string; passed: boolean; detail?: string };

export function runIniW7OptimizationTests(): W7TestResult[] {
  const results: W7TestResult[] = [];
  const institutionId = DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.institution_id;
  const actorId = DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.actor_human_id;

  const overview = institutionalOptimizationService.getOverview(institutionId);
  results.push({
    name: "optimization_overview",
    passed: overview.advisory_only === true && overview.contract_version === "11.1-w7.1",
  });

  const optimizations = overview.optimizations;
  const explainable =
    optimizations.length === 0 ||
    optimizations.every(
      (o) => o.why && o.evidence && o.confidence && o.advisory_only && o.expected_benefit && o.who_should_review
    );
  results.push({ name: "optimizations_explainable", passed: explainable, detail: `${optimizations.length} items` });

  const prohibited = queryOptimizationAdvisor(institutionId, "please approve this initiative automatically");
  results.push({
    name: "advisor_blocks_approval",
    passed: prohibited.blocked === true && prohibited.advisory_only,
  });

  const brief = institutionalOptimizationService.buildExecutiveBrief(institutionId);
  results.push({
    name: "executive_optimization_brief",
    passed: !!brief.brief_id && brief.yesterday_we_learned.length > 0,
  });

  const health = institutionalOptimizationService.getHealth(institutionId);
  results.push({ name: "organization_health", passed: health.length >= 6, detail: `${health.length} dimensions` });

  const sim = institutionalOptimizationService.runSimulation(institutionId, {
    scenario_type: "volunteer_loss",
    parameters: { percent: 40 },
  });
  results.push({
    name: "simulation_non_mutating",
    passed: sim.advisory_only === true && sim.outcomes.length > 0,
  });

  const twin = institutionalOptimizationService.buildDigitalTwin(institutionId);
  results.push({ name: "digital_twin_snapshot", passed: twin.safe_to_test === true && twin.advisory_only });

  const comparison = institutionalOptimizationService.compareScenarios(institutionId);
  results.push({ name: "scenario_comparison", passed: comparison.advisory_only && comparison.options.length >= 2 });

  recordOptimizationFeedback({
    optimization_id: "opt-test-reject",
    action: "rejected",
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "feedback_rejection_learns",
    passed: isOptimizationRejected("opt-test-reject", institutionId),
  });

  results.push({
    name: "optimization_prohibited_actions",
    passed: OPTIMIZATION_PROHIBITED_ACTIONS.length >= 8,
    detail: `${OPTIMIZATION_PROHIBITED_ACTIONS.length} rules`,
  });

  const memory = institutionalOptimizationService.getMemory(institutionId);
  results.push({ name: "institutional_memory", passed: Array.isArray(memory) });

  return results;
}

export function allW7TestsPassed(): boolean {
  return runIniW7OptimizationTests().every((t) => t.passed);
}
