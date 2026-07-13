/**
 * CAE-11.6-W10 — Intelligence tests
 */
import { institutionalIntelligenceService } from "./services/intelligence-service";
import { seedIntelligenceIfEmpty } from "./services/seed";
import { getIntelligenceConstitution, OPS_INTELLIGENCE_PRINCIPLE, REQUIRED_INTELLIGENCE_SERVICES } from "./constitution";
import { checkOpsW10Invariants } from "./invariants";
import { explainIntelligenceInsight } from "./traceability";
import { INTELLIGENCE_EVENT_CATALOG } from "./events/catalog";

export type OpsW10TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW10IntelligenceTests(): OpsW10TestResult[] {
  seedIntelligenceIfEmpty();
  const results: OpsW10TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getIntelligenceConstitution();
  results.push({ name: "intelligence_principle", passed: constitution.governing_principle === OPS_INTELLIGENCE_PRINCIPLE });

  results.push({
    name: "required_intelligence_services",
    passed: REQUIRED_INTELLIGENCE_SERVICES.length === 15,
    detail: `${REQUIRED_INTELLIGENCE_SERVICES.length} services`,
  });

  results.push({ name: "w10_invariants", passed: checkOpsW10Invariants().every((i) => i.passed) });

  const insights = institutionalIntelligenceService.insights.list(institutionId);
  results.push({
    name: "institutional_insights",
    passed: insights.length >= 1 && insights[0].advisory_only === true,
    detail: insights[0]?.title?.slice(0, 40),
  });

  const forecast = institutionalIntelligenceService.forecasts.generate({
    institution_id: institutionId,
    forecast_type: "budget_burn",
  });
  results.push({
    name: "forecast_engine",
    passed: forecast.forecast.confidence_interval_low < forecast.forecast.confidence_interval_high,
    detail: forecast.event,
  });

  const patterns = institutionalIntelligenceService.patterns.detect(institutionId);
  results.push({
    name: "pattern_recognition",
    passed: Array.isArray(patterns.patterns),
    detail: `${patterns.patterns.length} patterns`,
  });

  const opportunity = institutionalIntelligenceService.opportunities.detect(institutionId);
  results.push({
    name: "opportunity_detection",
    passed: !!opportunity.opportunity.supporting_evidence.length,
    detail: opportunity.event,
  });

  const risks = institutionalIntelligenceService.risks.predict(institutionId);
  results.push({
    name: "risk_prediction",
    passed: risks.risks.length >= 1 && risks.risks[0].confidence > 0,
    detail: risks.risks[0]?.title?.slice(0, 40),
  });

  const scenario = institutionalIntelligenceService.scenarios.create({
    institution_id: institutionId,
    title: "Volunteer growth slows",
    hypothesis: "What if volunteer registration drops 30%?",
    created_by: "usr-001",
  });
  const analyzed = institutionalIntelligenceService.scenarios.analyze(scenario.scenario.scenario_id, institutionId);
  results.push({
    name: "scenario_engine",
    passed: analyzed.scenario.live_data_altered === false,
    detail: analyzed.event,
  });

  const simulation = institutionalIntelligenceService.simulations.run({
    institution_id: institutionId,
    simulation_type: "volunteer_staffing",
    inputs: { volunteers: "50" },
    created_by: "usr-001",
  });
  results.push({
    name: "simulation_engine",
    passed: simulation.simulation.isolated === true && simulation.simulation.approved === false,
    detail: simulation.event,
  });

  const recommendations = institutionalIntelligenceService.recommendations.recommend(institutionId);
  results.push({
    name: "recommendation_engine",
    passed: recommendations.recommendations[0]?.advisory_only === true,
    detail: recommendations.event,
  });

  const health = institutionalIntelligenceService.health.compute(institutionId);
  results.push({
    name: "institutional_health_index",
    passed: health.operational_planning_only === true && health.composite_score >= 0,
    detail: `composite ${health.composite_score.toFixed(2)}`,
  });

  const trends = institutionalIntelligenceService.trends.analyze(institutionId, "monthly");
  results.push({
    name: "trend_analysis",
    passed: trends.historical_context_preserved === true,
    detail: trends.window,
  });

  const ai = institutionalIntelligenceService.ai.answer(institutionId, "What are our biggest risks next month?");
  results.push({
    name: "ai_insight_engine",
    passed: ai.advisory_only === true && ai.evidence_refs.length >= 1,
  });

  const workspace = institutionalIntelligenceService.insights.executiveWorkspace(institutionId);
  results.push({
    name: "executive_forecast_workspace",
    passed: workspace.advisory_only === true && !!workspace.likely_next,
  });

  const trace = explainIntelligenceInsight({
    institution_id: institutionId,
    insight_id: insights[0]?.insight_id ?? "ins-training-readiness",
    evidence_refs: insights[0]?.supporting_evidence ?? [],
  });
  results.push({
    name: "intelligence_traceability",
    passed: trace.includes("Evidence") && trace.includes("Institution"),
  });

  results.push({
    name: "intelligence_event_catalog",
    passed: INTELLIGENCE_EVENT_CATALOG.length >= 10,
    detail: `${INTELLIGENCE_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW10TestsPassed(): boolean {
  return runOpsW10IntelligenceTests().every((t) => t.passed);
}
