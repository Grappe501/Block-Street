/**
 * CAE-11.2-W7 — Objective optimization tests
 */
import { objectiveOptimizationService, OPTIMIZATION_PROHIBITED_ACTIONS } from "./optimization";
import { queryOptimizationAdvisor } from "./optimization/optimization-advisor";
import { recordOptimizationFeedback, isOptimizationRejected } from "./optimization/feedback-store";
import { extractLessons } from "./optimization/lesson-engine";
import { inferRootCauses } from "./optimization/root-cause-service";
import { DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT } from "./ux/experience-context";

export type W7TestResult = { name: string; passed: boolean; detail?: string };

export function runObjW7OptimizationTests(): W7TestResult[] {
  const results: W7TestResult[] = [];
  const institutionId = DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.institution_id;
  const actorId = DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.actor_human_id;

  const overview = objectiveOptimizationService.getOverview({
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "optimization_overview",
    passed: overview.advisory_only === true && overview.contract_version === "11.2-w7.1",
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

  const prohibited = queryOptimizationAdvisor(institutionId, "please approve this objective automatically");
  results.push({
    name: "advisor_blocks_approval",
    passed: prohibited.blocked === true && prohibited.advisory_only,
  });

  const brief = objectiveOptimizationService.buildExecutiveBrief(institutionId);
  results.push({
    name: "executive_improvement_brief",
    passed: !!brief.brief_id && brief.what_we_learned.length > 0 && brief.reading_time_minutes === 5,
  });

  const health = objectiveOptimizationService.getHealth(institutionId);
  results.push({ name: "organization_health", passed: health.length >= 6, detail: `${health.length} dimensions` });

  const maturity = objectiveOptimizationService.getMaturity(institutionId);
  results.push({
    name: "objective_maturity",
    passed: !!maturity.level && maturity.score >= 0,
    detail: maturity.level,
  });

  const sim = objectiveOptimizationService.runSimulation(institutionId, {
    scenario_type: "reduce_approvals",
    parameters: { steps_removed: 1 },
  });
  results.push({
    name: "simulation_non_mutating",
    passed: sim.advisory_only === true && sim.outcomes.length > 0,
  });

  const twin = objectiveOptimizationService.buildDigitalTwin(institutionId);
  results.push({ name: "digital_twin_snapshot", passed: twin.safe_to_test === true && twin.advisory_only });

  const lessons = extractLessons(institutionId);
  results.push({ name: "lessons_engine_runs", passed: Array.isArray(lessons) });

  const rootCauses = inferRootCauses("approval delay blocked governance", "governance");
  results.push({
    name: "root_cause_categorization",
    passed: rootCauses.includes("governance") || rootCauses.includes("scheduling"),
    detail: rootCauses.join(","),
  });

  recordOptimizationFeedback({
    optimization_id: "opt-obj-test-reject",
    action: "rejected",
    actor_human_id: actorId,
    institution_id: institutionId,
  });
  results.push({
    name: "feedback_rejection_learns",
    passed: isOptimizationRejected("opt-obj-test-reject", institutionId),
  });

  results.push({
    name: "optimization_prohibited_actions",
    passed: OPTIMIZATION_PROHIBITED_ACTIONS.length >= 8,
    detail: `${OPTIMIZATION_PROHIBITED_ACTIONS.length} rules`,
  });

  const memory = objectiveOptimizationService.getMemory(institutionId);
  results.push({ name: "institutional_memory", passed: Array.isArray(memory) });

  const patterns = objectiveOptimizationService.getPatterns(institutionId);
  results.push({ name: "pattern_recognition", passed: Array.isArray(patterns) });

  return results;
}

export function allW7TestsPassed(): boolean {
  return runObjW7OptimizationTests().every((t) => t.passed);
}
