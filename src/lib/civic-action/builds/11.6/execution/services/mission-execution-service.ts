/**
 * CAE-11.6-W2 — Mission Execution Engine services
 */
import { caeId, nowIso } from "../../../../utils";
import { getActiveMission, getActiveVision, listGoals, listPrograms, listProjects, listStrategicObjectives } from "../../services/repository";
import { assertMissionTransition } from "../state-machines";
import { validateMissionTraceability, explainMissionPurpose } from "../traceability";
import type {
  MissionHealthState,
  MissionLifecycleState,
  MissionTaskRecord,
  OperationalMissionRecord,
} from "../data-model";
import {
  appendTransitionAudit,
  listChecklistItems,
  listMissionCommunications,
  listMissionDecisions,
  listMissionDependencies,
  listMissionEvidence,
  listMissionLessons,
  listMissionRisks,
  listOperationalMissions,
  listPhasesForMission,
  listTasksForMission,
  loadOperationalMission,
  saveChecklistItem,
  saveCommunication,
  saveDecision,
  saveEvidence,
  saveLesson,
  saveOperationalMission,
  saveTask,
} from "./repository";

const DEFAULT_INSTITUTION = "inst-block-street";

export class MissionExecutionError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function resolveStrategicTraceability(input: {
  institution_id: string;
  program_id?: string | null;
  project_id?: string | null;
  strategic_goal_id?: string | null;
  objective_id?: string | null;
  key_result_id?: string | null;
}) {
  const vision = getActiveVision(input.institution_id);
  const missionStatement = getActiveMission(input.institution_id);
  const goalId = input.strategic_goal_id ?? listGoals(input.institution_id)[0]?.canonical_id ?? null;
  const goal = listGoals(input.institution_id).find((g) => g.canonical_id === goalId);
  const objectiveId =
    input.objective_id ?? listStrategicObjectives(input.institution_id, goalId ?? undefined)[0]?.canonical_id ?? null;
  const programId = input.program_id ?? listPrograms(input.institution_id)[0]?.canonical_id ?? null;
  const projectId = input.project_id ?? listProjects(input.institution_id, programId ?? undefined)[0]?.canonical_id ?? null;
  return {
    vision_id: vision?.canonical_id ?? null,
    mission_statement_id: missionStatement?.canonical_id ?? null,
    pillar_id: goal?.pillar_id ?? null,
    strategic_goal_id: goalId,
    objective_id: objectiveId,
    key_result_id: input.key_result_id ?? null,
    program_id: programId,
    project_id: projectId,
  };
}

function transitionMission(
  missionId: string,
  to: MissionLifecycleState,
  actorId: string,
  reason: string,
  event: string
) {
  const mission = loadOperationalMission(missionId);
  if (!mission) throw new MissionExecutionError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
  assertMissionTransition(mission.status, to);
  const from = mission.status;
  const updated: OperationalMissionRecord = {
    ...mission,
    status: to,
    updated_at: nowIso(),
    version: mission.version + 1,
    health: missionHealthService.calculate(missionId),
    actual_completion: to === "completed" ? nowIso() : mission.actual_completion,
  };
  saveOperationalMission(updated);
  appendTransitionAudit({
    audit_id: caeId("aud"),
    mission_id: missionId,
    from_status: from,
    to_status: to,
    actor_id: actorId,
    reason,
    transitioned_at: nowIso(),
  });
  return { mission: updated, event };
}

export const missionService = {
  list(institutionId = DEFAULT_INSTITUTION) {
    return listOperationalMissions(institutionId);
  },
  get(missionId: string) {
    const mission = loadOperationalMission(missionId);
    if (!mission) throw new MissionExecutionError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
    return mission;
  },
  create(input: {
    institution_id: string;
    title: string;
    description: string;
    purpose: string;
    desired_outcome: string;
    classification: OperationalMissionRecord["classification"];
    mission_owner: string;
    executive_owner: string;
    created_by: string;
    program_id?: string | null;
    project_id?: string | null;
    strategic_goal_id?: string | null;
    objective_id?: string | null;
    key_result_id?: string | null;
    template_id?: string | null;
    priority?: OperationalMissionRecord["priority"];
  }) {
    const trace = resolveStrategicTraceability(input);
    if (!validateMissionTraceability(trace)) {
      throw new MissionExecutionError("TRACEABILITY_INCOMPLETE", "Mission must trace to program and strategic objective");
    }
    const now = nowIso();
    const mission: OperationalMissionRecord = {
      mission_id: caeId("opm"),
      institution_id: input.institution_id,
      ...trace,
      title: input.title,
      description: input.description,
      purpose: input.purpose,
      desired_outcome: input.desired_outcome,
      status: "draft",
      priority: input.priority ?? "high",
      classification: input.classification,
      visibility: "internal",
      created_by: input.created_by,
      mission_owner: input.mission_owner,
      executive_owner: input.executive_owner,
      start_date: null,
      target_completion: null,
      actual_completion: null,
      estimated_effort_hours: 0,
      actual_effort_hours: 0,
      confidence: 0.7,
      risk_level: "medium",
      success_definition: input.desired_outcome,
      failure_definition: "Mission objectives not met within timeline",
      budget_reference: null,
      calendar_reference: null,
      health: "watch",
      template_id: input.template_id ?? null,
      created_at: now,
      updated_at: now,
      version: 1,
    };
    saveOperationalMission(mission);
    return { mission, event: "mission.created" as const, traceability: explainMissionPurpose(trace) };
  },
  update(missionId: string, fields: Partial<Pick<OperationalMissionRecord, "title" | "description" | "purpose" | "desired_outcome" | "target_completion" | "priority">>) {
    const mission = loadOperationalMission(missionId);
    if (!mission) throw new MissionExecutionError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
    const updated = { ...mission, ...fields, updated_at: nowIso(), version: mission.version + 1 };
    saveOperationalMission(updated);
    return updated;
  },
};

export const missionLifecycleService = {
  approve: (missionId: string, actorId: string) => transitionMission(missionId, "approved", actorId, "Mission approved", "mission.approved"),
  schedule: (missionId: string, actorId: string, startDate: string) => {
    const m = loadOperationalMission(missionId);
    if (!m) throw new MissionExecutionError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
    saveOperationalMission({ ...m, start_date: startDate, updated_at: nowIso() });
    return transitionMission(missionId, "scheduled", actorId, "Mission scheduled", "mission.scheduled");
  },
  start: (missionId: string, actorId: string) => {
    const m = loadOperationalMission(missionId);
    if (!m) throw new MissionExecutionError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
    if (m.status === "approved" || m.status === "scheduled") {
      transitionMission(missionId, "ready", actorId, "Mission ready", "mission.ready");
    }
    return transitionMission(missionId, "in_progress", actorId, "Mission started", "mission.started");
  },
  pause: (missionId: string, actorId: string, reason: string) => transitionMission(missionId, "paused", actorId, reason, "mission.paused"),
  resume: (missionId: string, actorId: string) => transitionMission(missionId, "in_progress", actorId, "Mission resumed", "mission.started"),
  block: (missionId: string, actorId: string, reason: string) => transitionMission(missionId, "blocked", actorId, reason, "mission.blocked"),
  escalate: (missionId: string, actorId: string, reason: string) => transitionMission(missionId, "escalated", actorId, reason, "mission.escalated"),
  complete: (missionId: string, actorId: string) => {
    const checks = missionCompletionService.validate(missionId);
    if (!checks.ready) {
      throw new MissionExecutionError("COMPLETION_BLOCKED", checks.blockers.join("; "));
    }
    transitionMission(missionId, "review", actorId, "Entering review", "mission.review");
    return transitionMission(missionId, "completed", actorId, "Mission completed", "mission.completed");
  },
  archive: (missionId: string, actorId: string) => transitionMission(missionId, "archived", actorId, "Mission archived", "mission.archived"),
};

export const taskService = {
  create(input: {
    mission_id: string;
    title: string;
    description: string;
    owner: string;
    activity_id?: string | null;
    due_date?: string | null;
    priority?: MissionTaskRecord["priority"];
  }) {
    if (!loadOperationalMission(input.mission_id)) {
      throw new MissionExecutionError("MISSION_NOT_FOUND", "Tasks require a parent mission");
    }
    const now = nowIso();
    const task: MissionTaskRecord = {
      task_id: caeId("tsk"),
      mission_id: input.mission_id,
      activity_id: input.activity_id ?? null,
      title: input.title,
      description: input.description,
      owner: input.owner,
      status: "pending",
      estimated_time_minutes: 60,
      actual_time_minutes: 0,
      priority: input.priority ?? "medium",
      due_date: input.due_date ?? null,
      dependencies: [],
      completion_rules: "Mark complete when work verified",
      created_at: now,
      updated_at: now,
    };
    saveTask(task);
    return { task, event: "task.created" as const };
  },
  complete(taskId: string, actorId: string, actualMinutes?: number) {
    const all = listOperationalMissions().flatMap((m) => listTasksForMission(m.mission_id));
    const task = all.find((t) => t.task_id === taskId);
    if (!task) throw new MissionExecutionError("TASK_NOT_FOUND", `Task ${taskId} not found`);
    const updated: MissionTaskRecord = {
      ...task,
      status: "completed",
      actual_time_minutes: actualMinutes ?? task.actual_time_minutes,
      updated_at: nowIso(),
    };
    saveTask(updated);
    return { task: updated, event: "task.completed" as const, actor_id: actorId };
  },
  listForMission(missionId: string) {
    return listTasksForMission(missionId);
  },
};

export const checklistService = {
  list: listChecklistItems,
  complete(itemId: string, missionId: string, actorId: string) {
    const items = listChecklistItems(missionId);
    const item = items.find((i) => i.item_id === itemId);
    if (!item) throw new MissionExecutionError("CHECKLIST_NOT_FOUND", `Item ${itemId} not found`);
    const updated = { ...item, completed: true, completed_by: actorId, completed_at: nowIso() };
    saveChecklistItem(updated);
    return updated;
  },
};

export const missionEvidenceService = {
  record(input: {
    mission_id: string;
    evidence_type: Parameters<typeof saveEvidence>[0]["evidence_type"];
    title: string;
    uri_or_reference: string;
    recorded_by: string;
  }) {
    if (!loadOperationalMission(input.mission_id)) {
      throw new MissionExecutionError("MISSION_NOT_FOUND", "Evidence requires a parent mission");
    }
    const record = {
      evidence_id: caeId("evd"),
      mission_id: input.mission_id,
      evidence_type: input.evidence_type,
      title: input.title,
      uri_or_reference: input.uri_or_reference,
      recorded_by: input.recorded_by,
      recorded_at: nowIso(),
    };
    saveEvidence(record);
    return { evidence: record, event: "evidence.recorded" as const };
  },
  list: listMissionEvidence,
};

export const decisionLogService = {
  log(input: {
    mission_id: string;
    question: string;
    decision: string;
    reason: string;
    evidence: string;
    decided_by: string;
  }) {
    const record = {
      decision_id: caeId("dec"),
      mission_id: input.mission_id,
      question: input.question,
      decision: input.decision,
      reason: input.reason,
      evidence: input.evidence,
      decided_by: input.decided_by,
      decided_at: nowIso(),
    };
    saveDecision(record);
    return { decision: record, event: "decision.logged" as const };
  },
  list: listMissionDecisions,
};

export const lessonsLearnedService = {
  submit(input: {
    mission_id: string;
    successes: string[];
    failures: string[];
    unexpected_events: string[];
    recommendations: string[];
    future_improvements: string[];
    submitted_by: string;
  }) {
    const record = {
      lesson_id: caeId("lsn"),
      mission_id: input.mission_id,
      successes: input.successes,
      failures: input.failures,
      unexpected_events: input.unexpected_events,
      recommendations: input.recommendations,
      future_improvements: input.future_improvements,
      submitted_by: input.submitted_by,
      submitted_at: nowIso(),
      knowledge_synced: true,
    };
    saveLesson(record);
    return { lesson: record, event: "lesson.recorded" as const, knowledge_engine: "11.12-sync-queued" };
  },
  list: listMissionLessons,
};

export const missionCommunicationService = {
  list: listMissionCommunications,
  post(input: {
    mission_id: string;
    channel: Parameters<typeof saveCommunication>[0]["channel"];
    subject: string;
    body: string;
    author_id: string;
  }) {
    const record = {
      communication_id: caeId("com"),
      mission_id: input.mission_id,
      channel: input.channel,
      subject: input.subject,
      body: input.body,
      author_id: input.author_id,
      created_at: nowIso(),
    };
    saveCommunication(record);
    return record;
  },
};

export const missionHealthService = {
  calculate(missionId: string): MissionHealthState {
    const mission = loadOperationalMission(missionId);
    if (!mission) return "critical";
    const tasks = listTasksForMission(missionId);
    const risks = listMissionRisks(missionId).filter((r) => r.status === "open");
    const deps = listMissionDependencies(missionId);
    const completed = tasks.filter((t) => t.status === "completed").length;
    const progress = tasks.length ? completed / tasks.length : 0.5;
    if (mission.status === "blocked" || mission.status === "escalated") return "critical";
    if (risks.some((r) => r.impact === "critical" || r.probability === "high")) return "at_risk";
    if (progress < 0.3 && mission.status === "in_progress") return "at_risk";
    if (deps.length > 3 || mission.status === "paused") return "watch";
    return progress >= 0.6 ? "healthy" : "watch";
  },
  buildDashboard(missionId: string) {
    const mission = loadOperationalMission(missionId);
    if (!mission) throw new MissionExecutionError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
    const tasks = listTasksForMission(missionId);
    const health = missionHealthService.calculate(missionId);
    return {
      mission_id: missionId,
      overall_health: health,
      schedule: { start: mission.start_date, target: mission.target_completion, status: mission.status },
      progress: {
        tasks_total: tasks.length,
        tasks_completed: tasks.filter((t) => t.status === "completed").length,
      },
      risks: listMissionRisks(missionId),
      dependencies: listMissionDependencies(missionId),
      communications_count: listMissionCommunications(missionId).length,
      evidence_count: listMissionEvidence(missionId).length,
      lessons_count: listMissionLessons(missionId).length,
      traceability: explainMissionPurpose(mission),
    };
  },
};

export const missionCalendarService = {
  timeline(missionId: string) {
    const mission = loadOperationalMission(missionId);
    if (!mission) throw new MissionExecutionError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
    const tasks = listTasksForMission(missionId);
    const phases = listPhasesForMission(missionId);
    return {
      mission_id: missionId,
      milestones: [
        { type: "start", date: mission.start_date },
        { type: "target_completion", date: mission.target_completion },
      ].filter((m) => m.date),
      phases,
      tasks: tasks.map((t) => ({
        task_id: t.task_id,
        title: t.title,
        due_date: t.due_date,
        status: t.status,
      })),
      dependencies: listMissionDependencies(missionId),
    };
  },
};

export const missionIntelligenceService = {
  analyze(missionId: string) {
    const mission = loadOperationalMission(missionId);
    if (!mission) throw new MissionExecutionError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
    const tasks = listTasksForMission(missionId);
    const pending = tasks.filter((t) => t.status !== "completed");
    const risks = listMissionRisks(missionId);
    const blockers: string[] = [];
    if (mission.status === "blocked") blockers.push("Mission is blocked");
    if (pending.length > 5) blockers.push("High task backlog");
    if (risks.some((r) => r.status === "open" && r.impact === "critical")) blockers.push("Critical open risks");
    return {
      mission_id: missionId,
      advisory_only: true,
      schedule_risk: pending.filter((t) => t.due_date && t.due_date < nowIso()).length > 0 ? "elevated" : "normal",
      dependency_conflicts: listMissionDependencies(missionId).length,
      resource_shortages: [],
      duplicate_work_signals: [],
      recommended_priorities: pending.slice(0, 3).map((t) => t.title),
      completion_forecast: pending.length ? `${Math.ceil(pending.length * 1.5)} days estimated` : "On track",
      bottlenecks: blockers,
      may_not_autonomously_change_state: true,
    };
  },
};

export const missionCompletionService = {
  validate(missionId: string) {
    const tasks = listTasksForMission(missionId);
    const checklist = listChecklistItems(missionId);
    const lessons = listMissionLessons(missionId);
    const blockers: string[] = [];
    const requiredTasks = tasks.filter((t) => t.status !== "cancelled");
    if (requiredTasks.some((t) => t.status !== "completed")) blockers.push("Required tasks incomplete");
    if (checklist.some((c) => c.required && !c.completed)) blockers.push("Required checklist items incomplete");
    if (lessons.length === 0) blockers.push("Lessons learned not submitted");
    return { ready: blockers.length === 0, blockers };
  },
};

export const missionExecutionService = {
  missions: missionService,
  lifecycle: missionLifecycleService,
  tasks: taskService,
  checklists: checklistService,
  evidence: missionEvidenceService,
  decisions: decisionLogService,
  lessons: lessonsLearnedService,
  communications: missionCommunicationService,
  health: missionHealthService,
  calendar: missionCalendarService,
  intelligence: missionIntelligenceService,
  completion: missionCompletionService,
};
