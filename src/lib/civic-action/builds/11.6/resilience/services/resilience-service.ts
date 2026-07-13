/**
 * CAE-11.6-W11 — Resilience services (aggregates W1–W10)
 */
import { caeId, nowIso } from "../../../../utils";
import { executiveService } from "../../executive/services/executive-service";
import { workflowOrchestrationService } from "../../workflows/services/workflow-service";
import { institutionalIntelligenceService } from "../../intelligence/services/intelligence-service";
import { missionExecutionService } from "../../execution/services/mission-execution-service";
import { communicationsService } from "../../communications/services/communications-service";
import { resourceService } from "../../resources/services/resource-service";
import { calendarEngineService } from "../../calendar/services/calendar-service";
import { organizationService } from "../../organization/services/organization-service";
import type { ContinuityPlanRecord, CriticalFunction, IncidentLevel, RecoveryPhase } from "../data-model";
import {
  getIncident,
  getReadinessIndex,
  listBackupVerifications,
  listContinuityPlans,
  listExercises,
  listIncidents,
  listLessons,
  listMutualAid,
  listRecovery,
  saveBackupVerification,
  saveContinuityPlan,
  saveEoc,
  saveExercise,
  saveIncident,
  saveLesson,
  saveMutualAid,
  saveReadinessIndex,
  saveRecovery,
} from "./repository";

export class ResilienceError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const continuityPlanningService = {
  list: listContinuityPlans,
  create(input: {
    institution_id: string;
    critical_function: CriticalFunction;
    owner: string;
    risk_level?: ContinuityPlanRecord["risk_level"];
    recovery_time_target?: string;
    alternate_resources?: string[];
    alternate_personnel?: string[];
    dependencies?: string[];
  }) {
    const record: ContinuityPlanRecord = {
      continuity_plan_id: caeId("cpl"),
      institution_id: input.institution_id,
      critical_function: input.critical_function,
      owner: input.owner,
      risk_level: input.risk_level ?? "medium",
      activation_threshold: "Loss of primary capability for critical function",
      recovery_objective: "Restore essential operations within recovery time target",
      recovery_time_target: input.recovery_time_target ?? "4 hours",
      alternate_resources: input.alternate_resources ?? [],
      alternate_personnel: input.alternate_personnel ?? [],
      communications_plan: "Multi-channel emergency communications per institutional policy",
      dependencies: input.dependencies ?? [],
      status: "active",
      version: 1,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    saveContinuityPlan(record);
    return { plan: record, event: "continuity.plan.created" as const };
  },
};

export const dependencyMappingService = {
  map(institutionId: string, criticalFunction: CriticalFunction) {
    const plans = listContinuityPlans(institutionId).filter((p) => p.critical_function === criticalFunction);
    const plan = plans[0];
    return {
      institution_id: institutionId,
      critical_function: criticalFunction,
      people: plan?.alternate_personnel ?? [],
      technology: ["ops_systems", "ops_identity"],
      facilities: resourceService.facilities.list(institutionId).map((f) => f.name),
      missions: missionExecutionService.missions.list(institutionId).map((m) => m.mission_id),
      dependencies: plan?.dependencies ?? [],
    };
  },
};

export const incidentManagementService = {
  list: listIncidents,
  get: getIncident,
  activate(input: {
    institution_id: string;
    title: string;
    description: string;
    incident_level: IncidentLevel;
    incident_commander: string;
    affected_functions?: CriticalFunction[];
  }) {
    const record = {
      incident_id: caeId("inc"),
      institution_id: input.institution_id,
      title: input.title,
      description: input.description,
      incident_level: input.incident_level,
      risk_classifications: ["operational" as const],
      status: "active" as const,
      incident_commander: input.incident_commander,
      activated_at: nowIso(),
      closed_at: null,
      affected_functions: input.affected_functions ?? ["mission_execution"],
      timeline_entries: [`Incident activated at ${nowIso()}`],
    };
    saveIncident(record);
    return { incident: record, event: "incident.activated" as const };
  },
  escalate(incidentId: string) {
    const incident = getIncident(incidentId);
    if (!incident) throw new ResilienceError("INCIDENT_NOT_FOUND", "Incident not found");
    const newLevel = Math.min(incident.incident_level + 1, 5) as IncidentLevel;
    const updated = {
      ...incident,
      incident_level: newLevel,
      timeline_entries: [...incident.timeline_entries, `Escalated to level ${newLevel} at ${nowIso()}`],
    };
    saveIncident(updated);
    return { incident: updated, event: "incident.escalated" as const };
  },
  close(incidentId: string, closedBy: string) {
    const incident = getIncident(incidentId);
    if (!incident) throw new ResilienceError("INCIDENT_NOT_FOUND", "Incident not found");
    const updated = {
      ...incident,
      status: "closed" as const,
      closed_at: nowIso(),
      timeline_entries: [...incident.timeline_entries, `Closed by ${closedBy} at ${nowIso()}`],
    };
    saveIncident(updated);
    return { incident: updated, event: "incident.closed" as const };
  },
};

export const emergencyOperationsService = {
  open(input: { institution_id: string; incident_id: string; title: string; opened_by: string }) {
    const incident = getIncident(input.incident_id);
    if (!incident) throw new ResilienceError("INCIDENT_NOT_FOUND", "Incident not found");
    const record = {
      eoc_id: caeId("eoc"),
      institution_id: input.institution_id,
      incident_id: input.incident_id,
      title: input.title,
      status: "active" as const,
      opened_by: input.opened_by,
      opened_at: nowIso(),
      closed_at: null,
    };
    saveEoc(record);
    return {
      eoc: record,
      aggregated: {
        missions: missionExecutionService.missions.list(input.institution_id),
        executive: executiveService.dashboard.build(input.institution_id),
        communications: communicationsService.announcements.list(input.institution_id),
        resources: resourceService.executiveDashboard.build(input.institution_id),
        calendar: calendarEngineService.timeline.agenda(input.institution_id),
        incident_timeline: incident.timeline_entries,
      },
      event: "emergency.center.opened" as const,
    };
  },
  situationAwareness(institutionId: string, incidentId?: string) {
    const incident = incidentId ? getIncident(incidentId) : listIncidents(institutionId, "active")[0];
    return {
      institution_id: institutionId,
      incident: incident ?? null,
      mission_status: missionExecutionService.missions.list(institutionId).length,
      outstanding_risks: executiveService.alerts.list(institutionId, false).length,
      executive_actions: executiveService.decisions.list(institutionId, "awaiting_approval").length,
      real_time: true,
    };
  },
};

export const recoveryService = {
  list: listRecovery,
  activate(input: { institution_id: string; incident_id: string; phase: RecoveryPhase }) {
    const record = {
      recovery_id: caeId("rcv"),
      institution_id: input.institution_id,
      incident_id: input.incident_id,
      phase: input.phase,
      status: "in_progress" as const,
      started_at: nowIso(),
      completed_at: null,
      actions_taken: [`Recovery phase ${input.phase} initiated`],
    };
    saveRecovery(record);
    const incident = getIncident(input.incident_id);
    if (incident) saveIncident({ ...incident, status: "recovering" });
    return { recovery: record, event: "recovery.started" as const };
  },
  complete(recoveryId: string, institutionId: string) {
    const recoveries = listRecovery(institutionId);
    const recovery = recoveries.find((r) => r.recovery_id === recoveryId);
    if (!recovery) throw new ResilienceError("RECOVERY_NOT_FOUND", "Recovery not found");
    const updated = { ...recovery, status: "completed" as const, completed_at: nowIso() };
    saveRecovery(updated);
    return { recovery: updated, event: "recovery.completed" as const };
  },
};

export const leadershipContinuityService = {
  delegate(input: { institution_id: string; from_human_id: string; to_human_id: string; scope: string; delegated_by: string }) {
    return {
      institution_id: input.institution_id,
      temporary_delegation: true,
      from: input.from_human_id,
      to: input.to_human_id,
      scope: input.scope,
      governance_explicit: true,
      emergency_authority: false,
      delegated_at: nowIso(),
    };
  },
  successionReadiness(institutionId: string) {
    const org = organizationService.health.compute(institutionId);
    return {
      institution_id: institutionId,
      succession_readiness: org.succession_readiness,
      leadership_vacancies: org.vacancies,
      alternate_personnel_documented: listContinuityPlans(institutionId).some((p) => p.alternate_personnel.length > 0),
    };
  },
};

export const technologyRecoveryService = {
  plan(institutionId: string) {
    return {
      institution_id: institutionId,
      system_recovery: "documented",
      backup_verification: listBackupVerifications(institutionId).length > 0,
      cloud_failover: "configured",
      offline_mode: true,
      data_recovery: "versioned_snapshots",
      no_undocumented_procedures: true,
    };
  },
};

export const offlineOperationsService = {
  capabilities() {
    return {
      offline_mission_execution: true,
      offline_forms: true,
      offline_checklists: true,
      offline_contacts: true,
      offline_calendar: true,
      sync_on_reconnect: true,
    };
  },
};

export const backupVerificationService = {
  list: listBackupVerifications,
  verify(institutionId: string, verifiedBy: string, backupType = "institutional_store") {
    const record = {
      verification_id: caeId("bkv"),
      institution_id: institutionId,
      backup_type: backupType,
      verified: true,
      integrity_ok: true,
      verified_at: nowIso(),
      verified_by: verifiedBy,
    };
    saveBackupVerification(record);
    return { verification: record, event: "backup.verified" as const };
  },
};

export const mutualAidService = {
  list: listMutualAid,
  request(input: {
    institution_id: string;
    incident_id: string;
    aid_type: Parameters<typeof saveMutualAid>[0]["aid_type"];
    description: string;
    requested_by: string;
  }) {
    const record = {
      aid_id: caeId("aid"),
      institution_id: input.institution_id,
      incident_id: input.incident_id,
      aid_type: input.aid_type,
      description: input.description,
      status: "requested" as const,
      requested_by: input.requested_by,
      created_at: nowIso(),
    };
    saveMutualAid(record);
    return { aid: record, event: "mutual.aid.requested" as const };
  },
};

export const readinessAssessmentService = {
  assess(institutionId: string) {
    const plans = listContinuityPlans(institutionId);
    const exercises = listExercises(institutionId);
    const backups = listBackupVerifications(institutionId);
    const execHealth = executiveService.health.compute(institutionId);
    const intelHealth = institutionalIntelligenceService.health.compute(institutionId);
    const record = {
      readiness_id: caeId("rdy"),
      institution_id: institutionId,
      leadership: leadershipContinuityService.successionReadiness(institutionId).succession_readiness,
      technology: backups.length > 0 ? 0.85 : 0.6,
      resources: execHealth.budget_health,
      facilities: 0.8,
      communications: execHealth.communication_health,
      training: 0.75,
      knowledge: intelHealth.knowledge_health,
      recovery_plans: plans.length > 0 ? 0.9 : 0.5,
      testing: exercises.filter((e) => e.status === "completed").length > 0 ? 0.85 : 0.5,
      operational_capacity: execHealth.institutional_readiness,
      composite_readiness: 0,
      planning_only: true as const,
      computed_at: nowIso(),
    };
    record.composite_readiness =
      (record.leadership + record.technology + record.resources + record.recovery_plans + record.testing) / 5;
    saveReadinessIndex(record);
    return record;
  },
  get: getReadinessIndex,
  dashboard(institutionId: string) {
    const readiness = readinessAssessmentService.assess(institutionId);
    const activeIncidents = listIncidents(institutionId, "active");
    return {
      institution_id: institutionId,
      critical_functions: listContinuityPlans(institutionId).length,
      current_incidents: activeIncidents.length,
      readiness,
      technology_health: readiness.technology,
      testing_compliance: readiness.testing,
      ai_situation_summary: institutionalIntelligenceService.ai.answer(institutionId, "What is our readiness status?").answer,
      advisory_only: true,
    };
  },
};

export const resilienceTestingService = {
  list: listExercises,
  run(input: {
    institution_id: string;
    exercise_type: Parameters<typeof saveExercise>[0]["exercise_type"];
    title: string;
    findings?: string[];
  }) {
    const record = {
      exercise_id: caeId("exe"),
      institution_id: input.institution_id,
      exercise_type: input.exercise_type,
      title: input.title,
      findings: input.findings ?? ["Exercise completed successfully"],
      status: "completed" as const,
      conducted_at: nowIso(),
    };
    saveExercise(record);
    return { exercise: record, event: "exercise.completed" as const };
  },
};

export const lessonsLearnedService = {
  list: listLessons,
  record(input: {
    institution_id: string;
    incident_id?: string;
    exercise_id?: string;
    timeline: string;
    successes: string[];
    failures: string[];
    recommendations: string[];
    policy_updates?: string[];
  }) {
    const record = {
      lesson_id: caeId("lsn"),
      institution_id: input.institution_id,
      incident_id: input.incident_id ?? null,
      exercise_id: input.exercise_id ?? null,
      timeline: input.timeline,
      successes: input.successes,
      failures: input.failures,
      recommendations: input.recommendations,
      policy_updates: input.policy_updates ?? [],
      recorded_at: nowIso(),
    };
    saveLesson(record);
    return { lesson: record, event: "lesson.learned.recorded" as const };
  },
};

export const aiCrisisAdvisorService = {
  brief(institutionId: string, incidentId?: string) {
    const awareness = emergencyOperationsService.situationAwareness(institutionId, incidentId);
    return {
      institution_id: institutionId,
      advisory_only: true,
      may_not_command: true,
      situation_summary: awareness.incident?.description ?? "No active incident",
      missing_information: ["Weather impact assessment", "Full personnel availability"],
      suggested_procedures: ["Review continuity plans", "Open EOC if level 3+"],
      similar_incidents: listLessons(institutionId).length,
      action_tracking: awareness.executive_actions,
    };
  },
  crisisDecisionPackage(institutionId: string, incidentId: string) {
    const incident = getIncident(incidentId);
    if (!incident) throw new ResilienceError("INCIDENT_NOT_FOUND", "Incident not found");
    return {
      situation_summary: incident.description,
      known_facts: incident.timeline_entries,
      unknowns: ["Full scope of impact"],
      available_options: ["Escalate", "Activate recovery", "Request mutual aid"],
      risks: institutionalIntelligenceService.risks.predict(institutionId).risks,
      human_approval_required: true,
      ai_summary: `Incident level ${incident.incident_level}: ${incident.title}`,
      advisory_only: true,
    };
  },
};

export const resilienceService = {
  continuity: continuityPlanningService,
  dependencies: dependencyMappingService,
  incidents: incidentManagementService,
  eoc: emergencyOperationsService,
  recovery: recoveryService,
  leadership: leadershipContinuityService,
  technology: technologyRecoveryService,
  offline: offlineOperationsService,
  backups: backupVerificationService,
  mutualAid: mutualAidService,
  readiness: readinessAssessmentService,
  exercises: resilienceTestingService,
  lessons: lessonsLearnedService,
  ai: aiCrisisAdvisorService,
};
