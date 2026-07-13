/**
 * CAE-11.6-W11 — Resilience tests
 */
import { resilienceService } from "./services/resilience-service";
import { seedResilienceIfEmpty } from "./services/seed";
import { getResilienceConstitution, OPS_RESILIENCE_PRINCIPLE, REQUIRED_RESILIENCE_SERVICES } from "./constitution";
import { checkOpsW11Invariants } from "./invariants";
import { explainResilienceAction } from "./traceability";
import { RESILIENCE_EVENT_CATALOG } from "./events/catalog";

export type OpsW11TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW11ResilienceTests(): OpsW11TestResult[] {
  seedResilienceIfEmpty();
  const results: OpsW11TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getResilienceConstitution();
  results.push({ name: "resilience_principle", passed: constitution.governing_principle === OPS_RESILIENCE_PRINCIPLE });

  results.push({
    name: "required_resilience_services",
    passed: REQUIRED_RESILIENCE_SERVICES.length === 14,
    detail: `${REQUIRED_RESILIENCE_SERVICES.length} services`,
  });

  results.push({ name: "w11_invariants", passed: checkOpsW11Invariants().every((i) => i.passed) });

  const plans = resilienceService.continuity.list(institutionId);
  results.push({
    name: "continuity_plans",
    passed: plans.length >= 2,
    detail: `${plans.length} plans`,
  });

  const created = resilienceService.continuity.create({
    institution_id: institutionId,
    critical_function: "technology",
    owner: "usr-001",
    alternate_personnel: ["backup-tech"],
  });
  results.push({
    name: "create_continuity_plan",
    passed: created.event === "continuity.plan.created",
    detail: created.plan.critical_function,
  });

  const deps = resilienceService.dependencies.map(institutionId, "mission_execution");
  results.push({
    name: "dependency_mapping",
    passed: deps.dependencies.length >= 1,
    detail: `${deps.missions.length} mission deps`,
  });

  const incident = resilienceService.incidents.activate({
    institution_id: institutionId,
    title: "Training facility power outage",
    description: "Simulated power outage at training center",
    incident_level: 3,
    incident_commander: "usr-001",
  });
  results.push({
    name: "activate_incident",
    passed: incident.incident.status === "active" && incident.event === "incident.activated",
    detail: incident.incident.title,
  });

  const eoc = resilienceService.eoc.open({
    institution_id: institutionId,
    incident_id: incident.incident.incident_id,
    title: "Training Outage EOC",
    opened_by: "usr-001",
  });
  results.push({
    name: "emergency_operations_center",
    passed: eoc.eoc.status === "active" && !!eoc.aggregated,
    detail: eoc.event,
  });

  const recovery = resilienceService.recovery.activate({
    institution_id: institutionId,
    incident_id: incident.incident.incident_id,
    phase: "immediate_stabilization",
  });
  results.push({
    name: "recovery_activation",
    passed: recovery.recovery.status === "in_progress",
    detail: recovery.event,
  });

  const aid = resilienceService.mutualAid.request({
    institution_id: institutionId,
    incident_id: incident.incident.incident_id,
    aid_type: "personnel",
    description: "Request backup volunteers from federation partner",
    requested_by: "usr-001",
  });
  results.push({
    name: "mutual_aid",
    passed: aid.aid.status === "requested",
    detail: aid.event,
  });

  const exercise = resilienceService.exercises.run({
    institution_id: institutionId,
    exercise_type: "tabletop",
    title: "Power outage tabletop exercise",
  });
  results.push({
    name: "resilience_exercise",
    passed: exercise.exercise.status === "completed",
    detail: exercise.event,
  });

  const backup = resilienceService.backups.verify(institutionId, "usr-001");
  results.push({
    name: "backup_verification",
    passed: backup.verification.integrity_ok === true,
    detail: backup.event,
  });

  const readiness = resilienceService.readiness.assess(institutionId);
  results.push({
    name: "readiness_assessment",
    passed: readiness.planning_only === true && readiness.composite_readiness >= 0,
    detail: `readiness ${readiness.composite_readiness.toFixed(2)}`,
  });

  const lesson = resilienceService.lessons.record({
    institution_id: institutionId,
    incident_id: incident.incident.incident_id,
    timeline: "Power restored within 3 hours",
    successes: ["Alternate facility activated quickly"],
    failures: ["Initial notification delay"],
    recommendations: ["Update contact tree", "Schedule quarterly drill"],
  });
  results.push({
    name: "lessons_learned",
    passed: lesson.event === "lesson.learned.recorded",
    detail: lesson.lesson.lesson_id,
  });

  const ai = resilienceService.ai.brief(institutionId, incident.incident.incident_id);
  results.push({
    name: "ai_crisis_advisor",
    passed: ai.advisory_only === true && ai.may_not_command === true,
  });

  const offline = resilienceService.offline.capabilities();
  results.push({
    name: "offline_operations",
    passed: offline.sync_on_reconnect === true,
  });

  const trace = explainResilienceAction({
    institution_id: institutionId,
    action_type: "incident_activation",
    incident_id: incident.incident.incident_id,
    evidence_refs: ["cpl-mission-execution"],
  });
  results.push({
    name: "resilience_traceability",
    passed: trace.includes("Evidence") && trace.includes("Institution"),
  });

  results.push({
    name: "resilience_event_catalog",
    passed: RESILIENCE_EVENT_CATALOG.length >= 10,
    detail: `${RESILIENCE_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW11TestsPassed(): boolean {
  return runOpsW11ResilienceTests().every((t) => t.passed);
}
