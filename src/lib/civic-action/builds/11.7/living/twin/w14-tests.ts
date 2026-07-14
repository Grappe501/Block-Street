/**
 * CAE-11.7-W14 — Digital Twin tests
 */
import { twinRuntime } from "./services/twin-service";
import { seedTwinIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import {
  getTwinConstitution,
  LIX_TWIN_PRINCIPLE,
  REQUIRED_TWIN_SERVICES,
  SIMULATION_TYPES,
} from "./constitution";
import { checkLixW14Invariants } from "./invariants";
import { explainTwinAction } from "./traceability";
import { TWIN_EVENT_CATALOG } from "./events/catalog";

export type LixW14TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW14CertificationTests(): LixW14TestResult[] {
  seedTwinIfEmpty();
  const results: LixW14TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getTwinConstitution();
  results.push({ name: "twin_principle", passed: constitution.governing_principle === LIX_TWIN_PRINCIPLE });
  results.push({
    name: "simulation_types",
    passed: SIMULATION_TYPES.length === 10,
    detail: `${SIMULATION_TYPES.length} types`,
  });
  results.push({
    name: "required_twin_services",
    passed: REQUIRED_TWIN_SERVICES.length === 13,
    detail: `${REQUIRED_TWIN_SERVICES.length} services`,
  });
  results.push({ name: "w14_invariants", passed: checkLixW14Invariants().every((i) => i.passed) });
  results.push({
    name: "twin_event_catalog",
    passed: TWIN_EVENT_CATALOG.length >= 8,
    detail: `${TWIN_EVENT_CATALOG.length} events`,
  });

  const dashboard = twinRuntime.twin.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "twin_dashboard",
    passed: dashboard.is_canonical === false && dashboard.affects_production === false,
    detail: dashboard.central_question,
  });

  const twin = twinRuntime.digitalTwin.create({
    institution_id: institutionId,
    owner: humanId,
    name: "Immersion Scenario Twin",
  });
  results.push({
    name: "digital_twin",
    passed: twin.is_canonical === false && twin.reality_authoritative === true,
    detail: twin.twin.twin_id,
  });

  const model = twinRuntime.model.model({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
  });
  results.push({
    name: "institution_model",
    passed: model.simulated_representation === true && model.model.departments.length > 0,
    detail: model.model.model_id,
  });

  const sync = twinRuntime.sync.synchronize({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
  });
  results.push({
    name: "organizational_sync",
    passed: sync.silently_modifies_production === false && sync.production_untouched === true,
    detail: sync.sync.sync_id,
  });

  const simulation = twinRuntime.simulation.run({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
    simulation_type: "strategic",
    hypothesis: "Funding cut of 20% impacts outreach first",
  });
  results.push({
    name: "simulation_engine",
    passed: simulation.isolated === true && simulation.affects_production === false && simulation.guaranteed_outcome === false,
    detail: simulation.simulation.simulation_id,
  });

  const scenarioA = twinRuntime.scenarios.create({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
    title: "Volunteer growth doubles",
    category: "growth",
  });
  const scenarioB = twinRuntime.scenarios.create({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
    title: "Leadership transition",
    category: "what_if",
  });
  results.push({
    name: "scenario_laboratory",
    passed: scenarioA.isolated === true,
    detail: scenarioA.scenario.scenario_id,
  });

  const compared = twinRuntime.scenarios.compare({
    institution_id: institutionId,
    scenario_ids: [scenarioA.scenario.scenario_id, scenarioB.scenario.scenario_id],
    human_id: humanId,
  });
  results.push({
    name: "scenario_compare",
    passed: compared.production_change === false && compared.recommendation_only === true,
    detail: `compared ${compared.compared}`,
  });

  const stress = twinRuntime.stress.run({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
    stress_type: "staff_shortage",
  });
  results.push({
    name: "stress_testing",
    passed: stress.breaking_points_identified === true && stress.production_untouched === true,
    detail: stress.stress_test.stress_id,
  });

  const resource = twinRuntime.resources.simulate({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    resource_type: "personnel",
    projected_demand: 120,
    available_capacity: 80,
  });
  results.push({
    name: "resource_simulation",
    passed: resource.resource.shortage_risk === true && resource.evidence_based === true,
    detail: resource.resource.resource_id,
  });

  const policy = twinRuntime.policy.evaluate({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
    policy_name: "Two-approver volunteer policy",
  });
  results.push({
    name: "policy_sandbox",
    passed: policy.production_adopted === false && policy.impacts_measurable === true,
    detail: policy.policy.policy_id,
  });

  const aiSandbox = twinRuntime.aiSandbox.test({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
    agent_name: "Outreach Advisor v2",
    experiment_type: "recommendation",
  });
  results.push({
    name: "ai_sandbox",
    passed: aiSandbox.reaches_production === false && aiSandbox.requires_certification === true,
    detail: aiSandbox.sandbox.sandbox_id,
  });

  const training = twinRuntime.training.train({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
    training_type: "emergency",
  });
  results.push({
    name: "training_simulator",
    passed: training.operational_risk === false,
    detail: training.training.training_id,
  });

  const accuracy = twinRuntime.accuracy.measure({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    predicted_outcome: "Outreach delayed 2 weeks",
    actual_outcome: "Outreach delayed 10 days",
  });
  results.push({
    name: "twin_accuracy",
    passed: accuracy.assumes_guaranteed === false && accuracy.accuracy.accuracy_score > 0,
    detail: `${accuracy.accuracy.accuracy_score}`,
  });

  const experiment = twinRuntime.experiments.create({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    owner: humanId,
    purpose: "Test funding reduction impact",
    hypothesis: "A 15% cut reduces event throughput first",
  });
  results.push({
    name: "experiment_registry",
    passed: experiment.versioned === true && experiment.event === "experiment.created",
    detail: experiment.experiment.experiment_id,
  });

  const completed = twinRuntime.experiments.complete(
    experiment.experiment.experiment_id,
    institutionId,
    "Event throughput drops 12%",
    ["Pre-position contingency volunteers"]
  );
  results.push({
    name: "experiment_completed",
    passed: completed.experiment.status === "completed",
    detail: "lessons recorded",
  });

  const observatory = twinRuntime.observatory.measure({
    institution_id: institutionId,
    twin_id: twin.twin.twin_id,
  });
  results.push({
    name: "enterprise_observatory",
    passed: observatory.leadership_visible === true,
    detail: `${observatory.observatory.twin_accuracy}`,
  });

  const security = twinRuntime.twin.security.check("modify_production_data");
  results.push({ name: "twin_security", passed: security.allowed === false, detail: "production blocked" });

  const reset = twinRuntime.digitalTwin.resetSandbox({
    twin_id: twin.twin.twin_id,
    institution_id: institutionId,
    human_id: humanId,
  });
  results.push({
    name: "sandbox_reset",
    passed: reset.production_untouched === true,
    detail: "sandbox reset",
  });

  const trace = explainTwinAction({
    human_id: humanId,
    action_type: "simulation_run",
    twin_id: twin.twin.twin_id,
    simulation_id: simulation.simulation.simulation_id,
  });
  results.push({ name: "twin_traceability", passed: trace.includes("never alters production"), detail: "explainable" });

  results.push({ name: "no_canonical_mutation", passed: dashboard.mutates_canonical === false, detail: "governed only" });

  return results;
}

export function allLixW14TestsPassed(): boolean {
  return runLixW14CertificationTests().every((t) => t.passed);
}
