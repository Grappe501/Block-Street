/**
 * CAE-11.6-W13 — Improvement tests
 */
import { improvementService } from "./services/improvement-service";
import { seedImprovementIfEmpty } from "./services/seed";
import { getImprovementConstitution, OPS_IMPROVEMENT_PRINCIPLE, REQUIRED_IMPROVEMENT_SERVICES } from "./constitution";
import { checkOpsW13Invariants } from "./invariants";
import { explainImprovementAction } from "./traceability";
import { IMPROVEMENT_EVENT_CATALOG } from "./events/catalog";

export type OpsW13TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW13ImprovementTests(): OpsW13TestResult[] {
  seedImprovementIfEmpty();
  const results: OpsW13TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getImprovementConstitution();
  results.push({ name: "improvement_principle", passed: constitution.governing_principle === OPS_IMPROVEMENT_PRINCIPLE });

  results.push({
    name: "required_improvement_services",
    passed: REQUIRED_IMPROVEMENT_SERVICES.length === 15,
    detail: `${REQUIRED_IMPROVEMENT_SERVICES.length} services`,
  });

  results.push({ name: "w13_invariants", passed: checkOpsW13Invariants().every((i) => i.passed) });

  const measurements = improvementService.measurements.list(institutionId);
  results.push({
    name: "measurement_registry",
    passed: measurements.length >= 1,
    detail: `${measurements.length} measurements`,
  });

  const created = improvementService.measurements.create({
    institution_id: institutionId,
    subject: "Volunteer Training Effectiveness",
    objective: "Improve training completion outcomes",
    metric: "training_completion_rate",
    baseline: 0.6,
    target: 0.9,
    owner: "usr-001",
    measurement_type: "training",
  });
  results.push({
    name: "create_measurement",
    passed: created.event === "measurement.created",
    detail: created.measurement.metric,
  });

  const outcome = improvementService.outcomes.record({
    institution_id: institutionId,
    outcome_type: "mission_success",
    subject: "Election Day Operations",
    description: "All polling locations staffed and operational",
    measured_value: 95,
    evidence_refs: ["mission-ed-001"],
  });
  results.push({
    name: "record_outcome",
    passed: outcome.event === "outcome.recorded",
    detail: outcome.outcome.outcome_type,
  });

  const kpis = improvementService.kpis.list(institutionId);
  const reviewed = improvementService.kpis.review(kpis[0]?.kpi_id ?? "kpi-block-street-001", 0.82);
  results.push({
    name: "review_kpi",
    passed: reviewed.kpi.historical_trend.length >= 3,
    detail: `on_target: ${reviewed.on_target}`,
  });

  const benchmark = improvementService.benchmarks.run({
    institution_id: institutionId,
    comparison_type: "historical",
    subject: "Mission success rate",
    baseline_value: 0.7,
    comparison_value: 0.82,
    context: "Year-over-year improvement in mission outcomes",
  });
  results.push({
    name: "run_benchmark",
    passed: benchmark.event === "benchmark.completed",
    detail: `delta: ${benchmark.delta}`,
  });

  const rca = improvementService.rootCause.conduct({
    institution_id: institutionId,
    issue: "Training completion rate below target",
    symptoms: ["Low attendance", "Delayed follow-up"],
    conducted_by: "usr-001",
    method: "five_whys",
  });
  results.push({
    name: "root_cause_analysis",
    passed: rca.analysis.root_causes.length >= 1,
    detail: rca.analysis.method,
  });

  const practice = improvementService.bestPractices.register({
    institution_id: institutionId,
    category: "training",
    title: "Peer Mentor Training Model",
    description: "Pair new volunteers with experienced mentors for first three shifts",
    registered_by: "usr-001",
  });
  results.push({
    name: "register_best_practice",
    passed: practice.event === "best.practice.registered",
    detail: practice.practice.title,
  });

  const experiment = improvementService.experiments.launch({
    institution_id: institutionId,
    title: "Mobile Training Pilot",
    hypothesis: "Mobile-first training increases completion rates by 20%",
    method: "A/B test with 50 volunteers per group",
  });
  results.push({
    name: "launch_experiment",
    passed: experiment.event === "experiment.started",
    detail: experiment.experiment.title,
  });

  const innovation = improvementService.innovations.record({
    institution_id: institutionId,
    title: "Automated Mission Health Dashboard",
    idea: "Real-time mission health scoring for executive visibility",
    status: "pilot",
  });
  results.push({
    name: "record_innovation",
    passed: innovation.event === "innovation.recorded",
    detail: innovation.innovation.title,
  });

  const maturity = improvementService.maturity.assess({
    institution_id: institutionId,
    assessed_by: "usr-001",
    domain_scores: { learning: 4, analytics: 3, resilience: 4 },
  });
  results.push({
    name: "assess_maturity",
    passed: maturity.event === "maturity.assessed",
    detail: `overall: ${maturity.assessment.overall_maturity.toFixed(1)}`,
  });

  const excellence = improvementService.excellence.evaluate(institutionId);
  results.push({
    name: "operational_excellence",
    passed: excellence.improvement_over_time && excellence.quality > 0,
    detail: `quality: ${excellence.quality}`,
  });

  const impact = improvementService.communityImpact.measure({
    institution_id: institutionId,
    citizens_served: 750,
    communities_reached: 15,
    volunteer_hours: 1500,
  });
  results.push({
    name: "community_impact",
    passed: impact.measures_institutional_impact && impact.impact.citizens_served > 0,
    detail: `${impact.impact.citizens_served} citizens`,
  });

  const quality = improvementService.quality.review({
    institution_id: institutionId,
    review_type: "mission",
    subject: "Q4 Outreach Missions",
    findings: ["Strong community engagement", "Room for follow-up improvement"],
    reviewed_by: "usr-001",
  });
  results.push({
    name: "quality_assurance",
    passed: quality.evidence_searchable,
    detail: quality.review.review_type,
  });

  const recommendation = improvementService.continuousImprovement.recommend({
    institution_id: institutionId,
    observation: "Training completion below target for 2 consecutive quarters",
    recommendation: "Implement peer mentor model and mobile training pilot",
  });
  const backlog = improvementService.backlog.add({
    institution_id: institutionId,
    title: "Expand peer mentor training program",
    category: "program",
    priority: "high",
    source: recommendation.cycle.cycle_id,
  });
  const approved = improvementService.backlog.approve(backlog.item.backlog_id, "usr-001");
  results.push({
    name: "improvement_backlog",
    passed: approved.event === "institution.improved",
    detail: approved.item.title,
  });

  const ai = improvementService.ai.analyze(institutionId);
  results.push({
    name: "ai_improvement_advisor",
    passed: ai.advisory_only && ai.explains_reasoning,
    detail: ai.process_improvements[0],
  });

  const dashboard = improvementService.executiveDashboard(institutionId);
  results.push({
    name: "executive_dashboard",
    passed: dashboard.advisory_only && dashboard.measures_outcomes_not_activity,
    detail: `${dashboard.mission_success} mission outcomes`,
  });

  const trace = explainImprovementAction({
    institution_id: institutionId,
    action_type: "record_outcome",
    outcome_id: outcome.outcome.outcome_id,
    evidence_refs: ["mission-ed-001", "impact-report-q4"],
  });
  results.push({
    name: "improvement_traceability",
    passed: trace.includes(institutionId) && trace.includes("Outcome"),
  });

  results.push({
    name: "improvement_event_catalog",
    passed: IMPROVEMENT_EVENT_CATALOG.length === 10,
    detail: `${IMPROVEMENT_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW13TestsPassed(): boolean {
  return runOpsW13ImprovementTests().every((t) => t.passed);
}
