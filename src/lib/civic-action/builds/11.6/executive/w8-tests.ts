/**
 * CAE-11.6-W8 — Executive tests
 */
import { executiveService } from "./services/executive-service";
import { seedExecutiveIfEmpty } from "./services/seed";
import { getExecutiveConstitution, OPS_EXECUTIVE_PRINCIPLE, REQUIRED_EXECUTIVE_SERVICES } from "./constitution";
import { checkOpsW8Invariants } from "./invariants";
import { explainExecutiveInsight } from "./traceability";
import { EXECUTIVE_EVENT_CATALOG } from "./events/catalog";

export type OpsW8TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW8ExecutiveTests(): OpsW8TestResult[] {
  seedExecutiveIfEmpty();
  const results: OpsW8TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getExecutiveConstitution();
  results.push({ name: "executive_principle", passed: constitution.governing_principle === OPS_EXECUTIVE_PRINCIPLE });

  results.push({
    name: "required_executive_services",
    passed: REQUIRED_EXECUTIVE_SERVICES.length === 16,
    detail: `${REQUIRED_EXECUTIVE_SERVICES.length} services`,
  });

  results.push({ name: "w8_invariants", passed: checkOpsW8Invariants().every((i) => i.passed) });

  const dashboard = executiveService.dashboard.build(institutionId);
  results.push({
    name: "executive_dashboard",
    passed: dashboard.evidence_linked === true && !!dashboard.institution_health,
    detail: `${dashboard.pending_decisions.length} pending decisions`,
  });

  const briefing = executiveService.briefing.generate({
    institution_id: institutionId,
    executive_human_id: "usr-001",
    briefing_type: "morning",
  });
  results.push({
    name: "executive_briefing",
    passed: !!briefing.briefing.ai_summary && briefing.event === "executive.briefing.generated",
    detail: briefing.briefing.briefing_type,
  });

  const alerts = executiveService.alerts.list(institutionId, false);
  results.push({
    name: "executive_alerts",
    passed: alerts.length >= 1 && alerts[0].recommended_actions.length >= 1,
    detail: alerts[0]?.title?.slice(0, 40),
  });

  const decisions = executiveService.decisions.list(institutionId, "awaiting_approval");
  results.push({
    name: "decision_queue",
    passed: decisions.length >= 1,
    detail: decisions[0]?.question?.slice(0, 40),
  });

  const health = executiveService.health.compute(institutionId);
  results.push({
    name: "operational_health",
    passed: !!health.explanation && health.institutional_readiness >= 0,
    detail: health.explanation.slice(0, 50),
  });

  const missionIntel = executiveService.missions.analyze(institutionId);
  results.push({
    name: "mission_intelligence",
    passed: missionIntel.total_missions >= 1,
    detail: `${missionIntel.total_missions} missions`,
  });

  const warRoom = executiveService.warRoom.open({
    institution_id: institutionId,
    title: "Training Kickoff War Room",
    purpose: "campaign",
    mission_ids: ["opm-volunteer-training-001"],
    participant_human_ids: ["usr-001"],
    opened_by: "usr-001",
  });
  results.push({
    name: "war_room",
    passed: warRoom.war_room.status === "active" && !!warRoom.aggregated,
    detail: warRoom.war_room.title,
  });

  const scenario = executiveService.scenarios.create({
    institution_id: institutionId,
    title: "Budget reduced 20%",
    hypothesis: "What if training budget is cut by 20%?",
    created_by: "usr-001",
  });
  const analyzed = executiveService.scenarios.analyze(scenario.scenario.scenario_id, institutionId);
  results.push({
    name: "scenario_planning",
    passed: analyzed.scenario.live_data_altered === false,
    detail: analyzed.scenario.status,
  });

  const timeline = executiveService.timeline.build(institutionId);
  results.push({
    name: "executive_timeline",
    passed: timeline.institutional_memory === true && timeline.entries.length >= 1,
    detail: `${timeline.entries.length} entries`,
  });

  const trace = explainExecutiveInsight({
    institution_id: institutionId,
    insight_type: "budget_alert",
    evidence_refs: ["inv-flyers-001"],
  });
  results.push({
    name: "executive_traceability",
    passed: trace.includes("Evidence") && trace.includes("Institution"),
  });

  const ai = executiveService.ai.analyze(institutionId);
  results.push({
    name: "ai_executive_advisory",
    passed: ai.advisory_only === true && ai.may_not_exercise_authority === true,
  });

  results.push({
    name: "executive_event_catalog",
    passed: EXECUTIVE_EVENT_CATALOG.length >= 9,
    detail: `${EXECUTIVE_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW8TestsPassed(): boolean {
  return runOpsW8ExecutiveTests().every((t) => t.passed);
}
