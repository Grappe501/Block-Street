/**
 * CAE-11.6-W1 — Strategy tests
 */
import { operationsApplicationService } from "./application-service";
import { getOperationsConstitution, OPS_GOVERNING_PRINCIPLE, REQUIRED_DOMAIN_SERVICES } from "./constitution";
import { checkOpsW1Invariants } from "./invariants";
import { explainWhyWeAreDoingThis, validateTraceabilityComplete } from "./traceability";
import { STRATEGY_EVENT_CATALOG } from "./events/catalog";
import { seedStrategicPlanningIfEmpty } from "./services/seed";

export type OpsW1TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW1StrategyTests(): OpsW1TestResult[] {
  seedStrategicPlanningIfEmpty();
  const results: OpsW1TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getOperationsConstitution();
  results.push({
    name: "governing_principle",
    passed: constitution.governing_principle === OPS_GOVERNING_PRINCIPLE,
  });

  results.push({
    name: "required_services",
    passed: REQUIRED_DOMAIN_SERVICES.length === 15,
    detail: `${REQUIRED_DOMAIN_SERVICES.length} services`,
  });

  results.push({
    name: "invariants",
    passed: checkOpsW1Invariants().every((i) => i.passed),
  });

  const dashboard = operationsApplicationService.getDashboard(institutionId);
  results.push({
    name: "strategy_dashboard",
    passed: !!dashboard.mission && dashboard.goal_count >= 1,
    detail: `goals=${dashboard.goal_count}`,
  });

  const vision = operationsApplicationService.getVision(institutionId);
  const mission = operationsApplicationService.getMissionStatement(institutionId);
  results.push({
    name: "vision_and_mission",
    passed: !!vision && !!mission,
  });

  const trace = explainWhyWeAreDoingThis({
    vision_id: vision?.canonical_id ?? null,
    mission_id: mission?.canonical_id ?? null,
    pillar_id: "str-pillar-edu",
    goal_id: "str-goal-001",
    objective_id: "str-obj-001",
    key_result_id: "str-kr-001",
  });
  results.push({
    name: "strategy_traceability",
    passed: trace.includes("supports") && validateTraceabilityComplete({
      vision_id: vision?.canonical_id ?? null,
      mission_id: mission?.canonical_id ?? null,
      pillar_id: "str-pillar-edu",
      goal_id: "str-goal-001",
      objective_id: "str-obj-001",
      key_result_id: null,
    }),
    detail: trace.slice(0, 80),
  });

  const ai = operationsApplicationService.explainWork({
    vision_id: vision?.canonical_id ?? null,
    mission_id: mission?.canonical_id ?? null,
    pillar_id: null,
    goal_id: "str-goal-001",
    objective_id: "str-obj-001",
    key_result_id: null,
  });
  results.push({
    name: "ai_advisory_only",
    passed: ai.advisory_only === true && constitution.ai_may_not.some((s) => s.toLowerCase().includes("autonomously")),
  });

  results.push({
    name: "event_catalog",
    passed: STRATEGY_EVENT_CATALOG.length >= 10,
    detail: `${STRATEGY_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW1TestsPassed(): boolean {
  return runOpsW1StrategyTests().every((t) => t.passed);
}
