/**
 * CAE-11.7-W8 — Prediction tests
 */
import { predictionRuntime } from "./services/prediction-service";
import { seedPredictionIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getPredictionConstitution, LIX_PREDICTION_PRINCIPLE, REQUIRED_PREDICTION_SERVICES } from "./constitution";
import { checkLixW8Invariants } from "./invariants";
import { explainPredictionAction } from "./traceability";
import { PREDICTION_EVENT_CATALOG } from "./events/catalog";

export type LixW8TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW8CertificationTests(): LixW8TestResult[] {
  seedPredictionIfEmpty();
  const results: LixW8TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getPredictionConstitution();
  results.push({ name: "prediction_principle", passed: constitution.governing_principle === LIX_PREDICTION_PRINCIPLE });

  results.push({
    name: "required_prediction_services",
    passed: REQUIRED_PREDICTION_SERVICES.length === 12,
    detail: `${REQUIRED_PREDICTION_SERVICES.length} services`,
  });

  results.push({ name: "w8_invariants", passed: checkLixW8Invariants().every((i) => i.passed) });

  results.push({
    name: "prediction_event_catalog",
    passed: PREDICTION_EVENT_CATALOG.length >= 7,
    detail: `${PREDICTION_EVENT_CATALOG.length} events`,
  });

  const dashboard = predictionRuntime.prediction.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "prediction_dashboard",
    passed: dashboard.certainty_claimed === false && dashboard.autonomous_decisions === false,
    detail: dashboard.greeting,
  });

  const forecast = predictionRuntime.forecasts.run({
    human_id: humanId,
    institution_id: institutionId,
    subject: "Volunteer recruitment",
    summary: "Expected 15% growth over 90 days with current outreach.",
    time_horizon: "90d",
  });
  results.push({
    name: "forecast_engine",
    passed: forecast.certainty_claimed === false && forecast.forecast.advisory_only === true,
    detail: forecast.forecast.forecast_id,
  });

  const scenario = predictionRuntime.scenarios.create({
    human_id: humanId,
    institution_id: institutionId,
    scenario_type: "worst_case",
    title: "Launch delay scenario",
    description: "County match delayed 60 days.",
  });
  results.push({
    name: "scenario_modeling",
    passed: scenario.reproducible && scenario.scenario.reproducible === true,
    detail: scenario.scenario.scenario_id,
  });

  const trend = predictionRuntime.trends.evaluate(institutionId, "fundraising");
  results.push({ name: "trend_analysis", passed: !!trend.trend.metric, detail: trend.trend.direction });

  const simulation = predictionRuntime.simulations.run({
    human_id: humanId,
    institution_id: institutionId,
    query: "What happens if we increase volunteers by 20%?",
    variables: { volunteers: 20 },
  });
  results.push({
    name: "strategic_simulation",
    passed: simulation.autonomous_decision === false && simulation.advisory_only === true,
    detail: simulation.simulation.simulation_id,
  });

  let riskBlocked = false;
  try {
    predictionRuntime.risks.forecast({
      human_id: humanId,
      institution_id: institutionId,
      category: "financial",
      title: "Unsubstantiated risk",
      summary: "No evidence",
      evidence: [],
    });
  } catch {
    riskBlocked = true;
  }
  results.push({ name: "risk_requires_evidence", passed: riskBlocked, detail: "evidence required" });

  const risk = predictionRuntime.risks.forecast({
    human_id: humanId,
    institution_id: institutionId,
    category: "legislative",
    title: "HB-214 funding impact",
    summary: "Substitute bill may reduce program funding.",
    evidence: ["Legislative research brief", "Fiscal note analysis"],
  });
  results.push({
    name: "risk_forecasting",
    passed: risk.certainty_claimed === false,
    detail: risk.risk.risk_id,
  });

  const opportunity = predictionRuntime.opportunities.forecast({
    human_id: humanId,
    institution_id: institutionId,
    title: "CDBG planning grant window",
    domain: "funding",
    description: "Grant window opening next quarter.",
    evidence: ["Research network grant monitoring"],
  });
  results.push({
    name: "opportunity_forecasting",
    passed: opportunity.recommendation_only === true,
    detail: opportunity.opportunity.opportunity_id,
  });

  const resource = predictionRuntime.resources.model({
    institution_id: institutionId,
    resource_type: "budget",
    current_capacity: 100000,
    projected_need: 125000,
    time_horizon: "1y",
  });
  results.push({ name: "resource_modeling", passed: resource.connects_to_operations === true, detail: resource.model.model_id });

  const mission = predictionRuntime.missions.model({
    institution_id: institutionId,
    mission_id: "msn-block-street-001",
    success_probability: 0.7,
  });
  results.push({
    name: "mission_outcome_modeling",
    passed: mission.advisory_only === true && mission.mutates_mission === false,
    detail: `${mission.outcome.success_probability}`,
  });

  const impact = predictionRuntime.impacts.analyze({
    human_id: humanId,
    institution_id: institutionId,
    decision_subject: "Expand to 3 additional counties",
  });
  results.push({
    name: "decision_impact_analysis",
    passed: impact.mutates_canonical === false && impact.impact.community.length > 0,
    detail: impact.impact.impact_id,
  });

  const planning = predictionRuntime.planning.create({
    human_id: humanId,
    institution_id: institutionId,
    horizon: "5y",
    vision: "Statewide civic education network",
  });
  results.push({
    name: "long_term_planning",
    passed: planning.measurable_vision === true,
    detail: planning.plan.horizon,
  });

  const assumption = predictionRuntime.assumptions.update({
    human_id: humanId,
    institution_id: institutionId,
    forecast_id: forecast.forecast.forecast_id,
    label: "volunteer_growth_rate",
    value: "20%",
    sensitivity: "high",
  });
  results.push({
    name: "assumption_framework",
    passed: assumption.rerun_available && assumption.mutates_canonical === false,
    detail: `v${assumption.assumption.version}`,
  });

  results.push({
    name: "forecast_has_alternatives",
    passed: forecast.forecast.alternatives.length > 0 && forecast.forecast.limitations.length > 0,
    detail: `${forecast.forecast.alternatives.length} alternatives`,
  });

  const ethics = predictionRuntime.prediction.ethics.check("claim_certainty");
  results.push({ name: "prediction_ethics", passed: ethics.allowed === false, detail: "certainty blocked" });

  const trace = explainPredictionAction({
    human_id: humanId,
    action_type: "forecast",
    forecast_id: forecast.forecast.forecast_id,
    confidence: 0.72,
  });
  results.push({
    name: "prediction_traceability",
    passed: trace.includes("Decisions remain Human"),
    detail: "explainable",
  });

  return results;
}

export function allLixW8TestsPassed(): boolean {
  return runLixW8CertificationTests().every((t) => t.passed);
}
