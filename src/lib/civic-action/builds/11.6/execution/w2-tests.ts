/**
 * CAE-11.6-W2 — Mission execution tests
 */
import { missionExecutionService } from "./services/mission-execution-service";
import { seedOperationalMissionsIfEmpty } from "./services/seed";
import { getMissionExecutionConstitution, OPS_EXECUTION_PRINCIPLE, REQUIRED_EXECUTION_SERVICES } from "./constitution";
import { checkOpsW2Invariants } from "./invariants";
import { validateMissionTraceability, explainMissionPurpose } from "./traceability";
import { MISSION_EVENT_CATALOG } from "./events/catalog";

export type OpsW2TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW2MissionTests(): OpsW2TestResult[] {
  seedOperationalMissionsIfEmpty();
  const results: OpsW2TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getMissionExecutionConstitution();
  results.push({
    name: "execution_principle",
    passed: constitution.governing_principle === OPS_EXECUTION_PRINCIPLE,
  });

  results.push({
    name: "required_execution_services",
    passed: REQUIRED_EXECUTION_SERVICES.length === 17,
    detail: `${REQUIRED_EXECUTION_SERVICES.length} services`,
  });

  results.push({
    name: "w2_invariants",
    passed: checkOpsW2Invariants().every((i) => i.passed),
  });

  const missions = missionExecutionService.missions.list(institutionId);
  results.push({
    name: "seeded_operational_mission",
    passed: missions.length >= 1,
    detail: `${missions.length} missions`,
  });

  const mission = missions[0];
  if (mission) {
    results.push({
      name: "mission_traceability",
      passed: validateMissionTraceability(mission) && explainMissionPurpose(mission).includes("supports"),
      detail: explainMissionPurpose(mission).slice(0, 60),
    });

    const health = missionExecutionService.health.buildDashboard(mission.mission_id);
    results.push({
      name: "mission_health_dashboard",
      passed: !!health.overall_health && health.progress.tasks_total >= 1,
      detail: health.overall_health,
    });

    const timeline = missionExecutionService.calendar.timeline(mission.mission_id);
    results.push({
      name: "mission_timeline",
      passed: timeline.tasks.length >= 1,
      detail: `${timeline.tasks.length} tasks`,
    });

    const intelligence = missionExecutionService.intelligence.analyze(mission.mission_id);
    results.push({
      name: "mission_intelligence_advisory",
      passed: intelligence.advisory_only === true && intelligence.may_not_autonomously_change_state === true,
    });

    const created = missionExecutionService.missions.create({
      institution_id: institutionId,
      title: "Test Mission",
      description: "W2 certification mission",
      purpose: "Validate mission creation",
      desired_outcome: "Mission created with traceability",
      classification: "operational",
      mission_owner: "usr-001",
      executive_owner: "usr-001",
      created_by: "usr-001",
      program_id: mission.program_id,
      project_id: mission.project_id,
      strategic_goal_id: mission.strategic_goal_id,
      objective_id: mission.objective_id,
      key_result_id: mission.key_result_id,
    });
    results.push({
      name: "create_mission_command",
      passed: created.event === "mission.created" && !!created.mission.mission_id,
    });

    const task = missionExecutionService.tasks.create({
      mission_id: created.mission.mission_id,
      title: "Certification task",
      description: "Task under mission",
      owner: "usr-001",
    });
    results.push({
      name: "create_task_requires_mission",
      passed: task.event === "task.created" && task.task.mission_id === created.mission.mission_id,
    });
  } else {
    results.push({ name: "mission_traceability", passed: false, detail: "no mission" });
    results.push({ name: "mission_health_dashboard", passed: false });
    results.push({ name: "mission_timeline", passed: false });
    results.push({ name: "mission_intelligence_advisory", passed: false });
    results.push({ name: "create_mission_command", passed: false });
    results.push({ name: "create_task_requires_mission", passed: false });
  }

  results.push({
    name: "mission_event_catalog",
    passed: MISSION_EVENT_CATALOG.length >= 12,
    detail: `${MISSION_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW2TestsPassed(): boolean {
  return runOpsW2MissionTests().every((t) => t.passed);
}
