/**
 * CAE-11.2-W3 — Objective Execution Engine (OBJ-SVC-001)
 * All execution mutations must pass through this service.
 */
import { createHash } from "crypto";
import { caeId, nowIso } from "../../../utils";
import type {
  EvidenceRecord,
  MissionRecord,
  ObjectiveRecord,
  OutcomeRecord,
  TaskRecord,
} from "../data-model";
import type {
  AssignMissionPayload,
  AssignTaskPayload,
  AttachEvidencePayload,
  CreateMissionPayload,
  CreateObjectivePayload,
  CreateTaskPayload,
  ExecutionCommandEnvelope,
  ExecutionCommandResult,
  RecordOutcomePayload,
} from "./commands";
import { ExecutionDomainError } from "./errors";
import { publishExecutionEvent } from "./events";
import { validateOwnershipForActivation } from "./policy";
import {
  assertMissionTransition,
  assertObjectiveTransition,
  assertTaskTransition,
  runValidationPipeline,
} from "./validation-pipeline";
import { childExceedsParent } from "../state-machines";
import {
  appendExecutionHistory,
  createDefaultWorkstream,
  getExecutionIdempotencyResult,
  loadMission,
  loadObjective,
  loadTask,
  loadWorkstream,
  listMissionsForObjective,
  listTasksForMission,
  saveEvidence,
  saveMission,
  saveObjective,
  saveOutcome,
  saveTask,
  saveWorkstream,
  setExecutionIdempotencyResult,
} from "./repository";
import { createExecutionVersion, recordExecutionAudit } from "./version-audit";
import { buildTraceabilityChain, explainTaskExistence } from "../traceability";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function hashPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
}

function ok(
  entityId: string,
  entityType: string,
  prev: string | null,
  next: string | null,
  version: number,
  events: string[],
  auditId?: string
): ExecutionCommandResult {
  return {
    success: true,
    entity_id: entityId,
    entity_type: entityType,
    previous_status_optional: prev,
    new_status_optional: next,
    version,
    events,
    warnings: [],
    next_required_actions: [],
    validation_errors: [],
    audit_id_optional: auditId ?? null,
  };
}

function failResult(e: ExecutionDomainError): ExecutionCommandResult {
  return {
    success: false,
    entity_id: e.entity_id ?? null,
    entity_type: e.entity_type ?? null,
    previous_status_optional: e.current_state ?? null,
    new_status_optional: e.requested_state ?? null,
    version: null,
    events: [],
    warnings: [],
    next_required_actions: [],
    validation_errors: [e.toValidationError()],
  };
}

function bumpEntity<T extends { canonical_id: string; current_version: number; updated_at: string; last_modified_by: string }>(
  entity: T,
  actorId: string,
  reason: string,
  fields: string[],
  entityType: string
): T {
  const version = createExecutionVersion({
    entity_id: entity.canonical_id,
    entity_type: entityType,
    current_version: entity.current_version,
    changed_by: actorId,
    reason,
    affected_fields: fields,
    snapshot: { ...entity } as unknown as Record<string, unknown>,
  });
  entity.current_version = version.version_number;
  entity.updated_at = nowIso();
  entity.last_modified_by = actorId;
  return entity;
}

function writeHistory(
  entityId: string,
  entityType: string,
  eventType: string,
  institutionId: string,
  initiativeId: string,
  actorId: string,
  payload: Record<string, unknown>
) {
  appendExecutionHistory({
    event_id: caeId("exh"),
    entity_id: entityId,
    entity_type: entityType,
    event_type: eventType,
    institution_id: institutionId,
    initiative_id: initiativeId,
    actor_human_id: actorId,
    occurred_at: nowIso(),
    payload,
  });
}

export class ExecutionDomainService {
  execute(envelope: ExecutionCommandEnvelope, permissions: string[] = ["civic_action.manage"]): ExecutionCommandResult {
    if (envelope.idempotency_key) {
      const cached = getExecutionIdempotencyResult(envelope.idempotency_key);
      if (cached) return cached as ExecutionCommandResult;
    }

    let result: ExecutionCommandResult;
    try {
      result = this.dispatch(envelope, permissions);
    } catch (e) {
      if (e instanceof ExecutionDomainError) return failResult(e);
      throw e;
    }

    if (envelope.idempotency_key) {
      const okIdem = setExecutionIdempotencyResult(envelope.idempotency_key, result, hashPayload(envelope));
      if (!okIdem) {
        throw new ExecutionDomainError({
          code: "EXECUTION_IDEMPOTENCY_CONFLICT",
          message: "Idempotency key reused with different payload",
          requirement_ids: ["CAE-11.2-W3-CON-001"],
        });
      }
    }
    return result;
  }

  private dispatch(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    switch (envelope.command_type) {
      case "CreateObjective":
        return this.createObjective(envelope, permissions);
      case "ProposeObjective":
        return this.proposeObjective(envelope, permissions);
      case "ApproveObjective":
        return this.approveObjective(envelope, permissions);
      case "ActivateObjective":
        return this.activateObjective(envelope, permissions);
      case "ArchiveObjective":
        return this.archiveObjective(envelope, permissions);
      case "CreateMission":
        return this.createMission(envelope, permissions);
      case "AssignMission":
        return this.assignMission(envelope, permissions);
      case "StartMission":
        return this.startMission(envelope, permissions);
      case "CompleteMission":
        return this.completeMission(envelope, permissions);
      case "CreateTask":
        return this.createTask(envelope, permissions);
      case "AssignTask":
        return this.assignTask(envelope, permissions);
      case "CompleteTask":
        return this.completeTask(envelope, permissions);
      case "AttachEvidence":
        return this.attachEvidence(envelope, permissions);
      case "RecordOutcome":
        return this.recordOutcome(envelope, permissions);
      default:
        throw new ExecutionDomainError({
          code: "EXECUTION_DIRECT_MUTATION_FORBIDDEN",
          message: `Unsupported command: ${envelope.command_type}`,
        });
    }
  }

  private createObjective(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const payload = envelope.payload as unknown as CreateObjectivePayload;
    runValidationPipeline({ envelope, permissions }, { skipParent: false });

    const id = caeId("obj");
    const now = nowIso();
    const objective: ObjectiveRecord = {
      canonical_id: id,
      public_id: `OBJ-${id.slice(-6).toUpperCase()}`,
      display_name: payload.display_name,
      canonical_slug: slugify(payload.display_name),
      institution_id: envelope.institution_id,
      initiative_id: payload.initiative_id,
      parent_object_id: payload.initiative_id,
      parent_object_type: "Initiative",
      object_type: "Objective",
      visibility: "institution_internal",
      governance_classification: 3,
      executive_owner_human_id: payload.executive_owner_human_id,
      operational_owner_human_id: payload.operational_owner_human_id,
      current_responsible_human_id: payload.operational_owner_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "draft",
      tags: [],
      objective_type: payload.objective_type,
      purpose: payload.purpose,
      desired_future_state: payload.desired_future_state,
      current_state: payload.current_state,
      review_authority_human_id: payload.review_authority_human_id,
      target_start: null,
      target_finish: null,
      review_rhythm: (payload.review_rhythm as ObjectiveRecord["review_rhythm"]) ?? "monthly",
      priority: 1,
      strategic_alignment: null,
      success_definition: payload.success_definition,
      measurement_strategy: payload.measurement_strategy,
      evidence_requirements: payload.evidence_requirements,
      parent_initiative_status_at_creation: null,
    };

    runValidationPipeline({ envelope, permissions, objective });
    saveObjective(objective);
    const ws = createDefaultWorkstream(objective, envelope.actor_human_id);
    saveWorkstream(ws);

    const event = publishExecutionEvent({
      event_type: "execution.objective_created",
      entity_id: id,
      entity_type: "Objective",
      initiative_id: payload.initiative_id,
      institution_id: envelope.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: envelope.service_identity_id_optional ?? null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { display_name: payload.display_name },
    });

    const audit = recordExecutionAudit({
      who: envelope.actor_human_id,
      what: "CreateObjective",
      where: envelope.institution_id,
      previous_state: null,
      new_state: { lifecycle_state: "draft" },
      reason: envelope.reason_optional ?? null,
      authority: "execution.objective.create",
      request_source: envelope.request_source ?? "human",
    });

    writeHistory(id, "Objective", "objective_created", envelope.institution_id, payload.initiative_id, envelope.actor_human_id, {
      lifecycle_state: "draft",
    });

    return ok(id, "Objective", null, "draft", 1, [event.event_id], audit.audit_id);
  }

  private proposeObjective(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const objective = this.loadObjectiveOrThrow(envelope);
    runValidationPipeline({ envelope, permissions, objective });
    assertObjectiveTransition(objective.lifecycle_state, "proposed", objective.canonical_id);
    const prev = objective.lifecycle_state;
    objective.lifecycle_state = "proposed";
    bumpEntity(objective, envelope.actor_human_id, "Propose objective", ["lifecycle_state"], "Objective");
    saveObjective(objective);
    const event = publishExecutionEvent({
      event_type: "execution.objective_proposed",
      entity_id: objective.canonical_id,
      entity_type: "Objective",
      initiative_id: objective.initiative_id,
      institution_id: objective.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: objective.current_version,
      payload: { from: prev, to: "proposed" },
    });
    return ok(objective.canonical_id, "Objective", prev, "proposed", objective.current_version, [event.event_id]);
  }

  private approveObjective(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const objective = this.loadObjectiveOrThrow(envelope);
    runValidationPipeline({ envelope, permissions, objective });
    if (objective.lifecycle_state === "draft") {
      throw new ExecutionDomainError({
        code: "EXECUTION_TRANSITION_NOT_ALLOWED",
        message: "Draft cannot transition directly to Approved; must pass through Proposed",
        entity_id: objective.canonical_id,
        current_state: "draft",
        requested_state: "approved",
        requirement_ids: ["CAE-11.2-W3-LIF-004", "CAE-11.2-W3-POL-007"],
        suggested_action: "Execute ProposeObjective first",
      });
    }
    assertObjectiveTransition(objective.lifecycle_state, "approved", objective.canonical_id);
    const prev = objective.lifecycle_state;
    objective.lifecycle_state = "approved";
    bumpEntity(objective, envelope.actor_human_id, "Approve objective", ["lifecycle_state"], "Objective");
    saveObjective(objective);
    const event = publishExecutionEvent({
      event_type: "execution.objective_approved",
      entity_id: objective.canonical_id,
      entity_type: "Objective",
      initiative_id: objective.initiative_id,
      institution_id: objective.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: objective.current_version,
      payload: { from: prev, to: "approved" },
    });
    return ok(objective.canonical_id, "Objective", prev, "approved", objective.current_version, [event.event_id]);
  }

  private activateObjective(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const objective = this.loadObjectiveOrThrow(envelope);
    runValidationPipeline({ envelope, permissions, objective });
    validateOwnershipForActivation(
      objective.executive_owner_human_id,
      objective.operational_owner_human_id,
      objective.canonical_id
    );
    const prev = objective.lifecycle_state;
    if (prev === "approved") {
      assertObjectiveTransition(prev, "ready", objective.canonical_id);
      objective.lifecycle_state = "ready";
    }
    assertObjectiveTransition(objective.lifecycle_state, "active", objective.canonical_id);
    objective.lifecycle_state = "active";
    bumpEntity(objective, envelope.actor_human_id, "Activate objective", ["lifecycle_state"], "Objective");
    saveObjective(objective);
    const event = publishExecutionEvent({
      event_type: "execution.objective_activated",
      entity_id: objective.canonical_id,
      entity_type: "Objective",
      initiative_id: objective.initiative_id,
      institution_id: objective.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: objective.current_version,
      payload: { from: prev, to: "active" },
    });
    return ok(objective.canonical_id, "Objective", prev, "active", objective.current_version, [event.event_id]);
  }

  private archiveObjective(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const objective = this.loadObjectiveOrThrow(envelope);
    runValidationPipeline({ envelope, permissions, objective });
    const activeMissions = listMissionsForObjective(objective.canonical_id).filter(
      (m) => !["completed", "cancelled", "archived"].includes(m.lifecycle_state)
    );
    if (activeMissions.length > 0) {
      throw new ExecutionDomainError({
        code: "EXECUTION_CHILD_CONSTRAINT",
        message: "Cannot archive Objective with active Missions",
        entity_id: objective.canonical_id,
        requirement_ids: ["CAE-11.2-W3-CHI-001"],
        blocking_requirement: `${activeMissions.length} active mission(s)`,
      });
    }
    assertObjectiveTransition(objective.lifecycle_state, "archived", objective.canonical_id);
    const prev = objective.lifecycle_state;
    objective.lifecycle_state = "archived";
    bumpEntity(objective, envelope.actor_human_id, "Archive objective", ["lifecycle_state"], "Objective");
    saveObjective(objective);
    const event = publishExecutionEvent({
      event_type: "execution.objective_archived",
      entity_id: objective.canonical_id,
      entity_type: "Objective",
      initiative_id: objective.initiative_id,
      institution_id: objective.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: objective.current_version,
      payload: { from: prev, to: "archived" },
    });
    return ok(objective.canonical_id, "Objective", prev, "archived", objective.current_version, [event.event_id]);
  }

  private createMission(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const payload = envelope.payload as unknown as CreateMissionPayload;
    const objective = loadObjective(payload.objective_id);
    if (!objective) {
      throw new ExecutionDomainError({
        code: "EXECUTION_NOT_FOUND",
        message: "Objective not found",
        entity_id: payload.objective_id,
      });
    }
    runValidationPipeline({ envelope, permissions, objective });

    const ws = loadWorkstream(payload.workstream_id);
    if (!ws || ws.objective_id !== objective.canonical_id) {
      throw new ExecutionDomainError({
        code: "EXECUTION_VALIDATION_FAILED",
        message: "Workstream must belong to Objective",
        requirement_ids: ["CAE-11.2-W3-PAR-004"],
      });
    }

    const id = caeId("msn");
    const now = nowIso();
    const mission: MissionRecord = {
      canonical_id: id,
      public_id: `MSN-${id.slice(-6).toUpperCase()}`,
      display_name: payload.display_name,
      canonical_slug: slugify(payload.display_name),
      institution_id: objective.institution_id,
      initiative_id: objective.initiative_id,
      parent_object_id: payload.workstream_id,
      parent_object_type: "Workstream",
      object_type: "Mission",
      visibility: objective.visibility,
      governance_classification: objective.governance_classification,
      executive_owner_human_id: objective.executive_owner_human_id,
      operational_owner_human_id: payload.operational_lead_human_id,
      current_responsible_human_id: payload.operational_lead_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "planned",
      tags: [],
      workstream_id: payload.workstream_id,
      objective_id: objective.canonical_id,
      operational_lead_human_id: payload.operational_lead_human_id,
      summary: payload.summary,
      purpose: payload.purpose,
      start_date: null,
      finish_date: null,
      priority: 1,
      assigned_team_ids: [],
    };

    runValidationPipeline({ envelope, permissions, objective, mission });
    saveMission(mission);
    const event = publishExecutionEvent({
      event_type: "execution.mission_created",
      entity_id: id,
      entity_type: "Mission",
      initiative_id: objective.initiative_id,
      institution_id: objective.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { objective_id: objective.canonical_id },
    });
    return ok(id, "Mission", null, "planned", 1, [event.event_id]);
  }

  private assignMission(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const mission = this.loadMissionOrThrow(envelope);
    const objective = loadObjective(mission.objective_id)!;
    const payload = envelope.payload as unknown as AssignMissionPayload;
    runValidationPipeline({ envelope, permissions, objective, mission });
    mission.operational_lead_human_id = payload.operational_lead_human_id;
    mission.operational_owner_human_id = payload.operational_lead_human_id;
    mission.current_responsible_human_id = payload.operational_lead_human_id;
    if (payload.assigned_team_ids) mission.assigned_team_ids = payload.assigned_team_ids;
    bumpEntity(mission, envelope.actor_human_id, "Assign mission", ["operational_lead_human_id"], "Mission");
    saveMission(mission);
    const event = publishExecutionEvent({
      event_type: "execution.mission_assigned",
      entity_id: mission.canonical_id,
      entity_type: "Mission",
      initiative_id: mission.initiative_id,
      institution_id: mission.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: mission.current_version,
      payload: { lead: payload.operational_lead_human_id },
    });
    return ok(mission.canonical_id, "Mission", mission.lifecycle_state, mission.lifecycle_state, mission.current_version, [event.event_id]);
  }

  private startMission(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const mission = this.loadMissionOrThrow(envelope);
    const objective = loadObjective(mission.objective_id)!;
    runValidationPipeline({ envelope, permissions, objective, mission });
    if (childExceedsParent("active", objective.lifecycle_state)) {
      throw new ExecutionDomainError({
        code: "EXECUTION_PARENT_CONSTRAINT",
        message: `Mission cannot activate while Objective is ${objective.lifecycle_state}`,
        entity_id: mission.canonical_id,
        requirement_ids: ["CAE-11.2-W3-PAR-002"],
      });
    }
    const prev = mission.lifecycle_state;
    if (prev === "planned") {
      assertMissionTransition(prev, "ready", mission.canonical_id);
      mission.lifecycle_state = "ready";
    }
    assertMissionTransition(mission.lifecycle_state, "active", mission.canonical_id);
    mission.lifecycle_state = "active";
    bumpEntity(mission, envelope.actor_human_id, "Start mission", ["lifecycle_state"], "Mission");
    saveMission(mission);
    const event = publishExecutionEvent({
      event_type: "execution.mission_started",
      entity_id: mission.canonical_id,
      entity_type: "Mission",
      initiative_id: mission.initiative_id,
      institution_id: mission.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: mission.current_version,
      payload: { from: prev, to: "active" },
    });
    return ok(mission.canonical_id, "Mission", prev, "active", mission.current_version, [event.event_id]);
  }

  private completeMission(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const mission = this.loadMissionOrThrow(envelope);
    const objective = loadObjective(mission.objective_id)!;
    runValidationPipeline({ envelope, permissions, objective, mission });
    const prev = mission.lifecycle_state;
    assertMissionTransition(prev, "completed", mission.canonical_id);
    mission.lifecycle_state = "completed";
    bumpEntity(mission, envelope.actor_human_id, "Complete mission", ["lifecycle_state"], "Mission");
    saveMission(mission);
    const event = publishExecutionEvent({
      event_type: "execution.mission_completed",
      entity_id: mission.canonical_id,
      entity_type: "Mission",
      initiative_id: mission.initiative_id,
      institution_id: mission.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: mission.current_version,
      payload: { from: prev, to: "completed" },
    });
    return ok(mission.canonical_id, "Mission", prev, "completed", mission.current_version, [event.event_id]);
  }

  private createTask(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const payload = envelope.payload as unknown as CreateTaskPayload;
    const mission = loadMission(payload.mission_id);
    if (!mission) {
      throw new ExecutionDomainError({
        code: "EXECUTION_NOT_FOUND",
        message: "Mission not found — orphan tasks prohibited",
        requirement_ids: ["CAE-11.2-W3-POL-001"],
      });
    }
    const objective = loadObjective(mission.objective_id)!;
    const id = caeId("tsk");
    const now = nowIso();
    const task: TaskRecord = {
      canonical_id: id,
      public_id: `TSK-${id.slice(-6).toUpperCase()}`,
      display_name: payload.description.slice(0, 80),
      canonical_slug: slugify(payload.description),
      institution_id: mission.institution_id,
      initiative_id: mission.initiative_id,
      parent_object_id: mission.canonical_id,
      parent_object_type: "Mission",
      object_type: "Task",
      visibility: mission.visibility,
      governance_classification: mission.governance_classification,
      executive_owner_human_id: mission.executive_owner_human_id,
      operational_owner_human_id: mission.operational_owner_human_id,
      current_responsible_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "draft",
      tags: [],
      mission_id: mission.canonical_id,
      description: payload.description,
      priority: payload.priority ?? 2,
      estimated_effort_hours: null,
      actual_effort_hours: null,
      assigned_team_ids: [],
      completion_timestamp: null,
    };
    runValidationPipeline({ envelope, permissions, objective, mission, task });
    saveTask(task);
    const event = publishExecutionEvent({
      event_type: "execution.task_created",
      entity_id: id,
      entity_type: "Task",
      initiative_id: mission.initiative_id,
      institution_id: mission.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { mission_id: mission.canonical_id },
    });
    return ok(id, "Task", null, "draft", 1, [event.event_id]);
  }

  private assignTask(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const task = this.loadTaskOrThrow(envelope);
    const mission = loadMission(task.mission_id)!;
    const objective = loadObjective(mission.objective_id)!;
    const payload = envelope.payload as unknown as AssignTaskPayload;
    runValidationPipeline({ envelope, permissions, objective, mission, task });
    const prev = task.lifecycle_state;
    if (prev === "draft") {
      assertTaskTransition(prev, "assigned", task.canonical_id);
      task.lifecycle_state = "assigned";
    }
    task.current_responsible_human_id = payload.owner_human_id;
    task.operational_owner_human_id = payload.owner_human_id;
    if (payload.assigned_team_ids) task.assigned_team_ids = payload.assigned_team_ids;
    bumpEntity(task, envelope.actor_human_id, "Assign task", ["current_responsible_human_id", "lifecycle_state"], "Task");
    saveTask(task);
    const event = publishExecutionEvent({
      event_type: "execution.task_assigned",
      entity_id: task.canonical_id,
      entity_type: "Task",
      initiative_id: task.initiative_id,
      institution_id: task.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: task.current_version,
      payload: { owner: payload.owner_human_id },
    });
    return ok(task.canonical_id, "Task", prev, task.lifecycle_state, task.current_version, [event.event_id]);
  }

  private completeTask(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const task = this.loadTaskOrThrow(envelope);
    const mission = loadMission(task.mission_id)!;
    const objective = loadObjective(mission.objective_id)!;
    runValidationPipeline({ envelope, permissions, objective, mission, task });
    const prev = task.lifecycle_state;
    if (prev === "assigned" || prev === "draft") {
      assertTaskTransition(prev, "active", task.canonical_id);
      task.lifecycle_state = "active";
    }
    assertTaskTransition(task.lifecycle_state, "completed", task.canonical_id);
    task.lifecycle_state = "completed";
    task.completion_timestamp = nowIso();
    bumpEntity(task, envelope.actor_human_id, "Complete task", ["lifecycle_state", "completion_timestamp"], "Task");
    saveTask(task);
    const event = publishExecutionEvent({
      event_type: "execution.task_completed",
      entity_id: task.canonical_id,
      entity_type: "Task",
      initiative_id: task.initiative_id,
      institution_id: task.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: task.current_version,
      payload: { from: prev, to: "completed" },
    });
    return ok(task.canonical_id, "Task", prev, "completed", task.current_version, [event.event_id]);
  }

  private attachEvidence(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const payload = envelope.payload as unknown as AttachEvidencePayload;
    runValidationPipeline({ envelope, permissions });
    const id = caeId("evd");
    const now = nowIso();
    const evidence: EvidenceRecord = {
      canonical_id: id,
      public_id: `EVD-${id.slice(-6).toUpperCase()}`,
      display_name: payload.description.slice(0, 80),
      canonical_slug: slugify(payload.description),
      institution_id: envelope.institution_id,
      initiative_id: envelope.initiative_id,
      parent_object_id: payload.linked_entity_id,
      parent_object_type: payload.linked_entity_type,
      object_type: "Evidence",
      visibility: "institution_internal",
      governance_classification: 2,
      executive_owner_human_id: envelope.actor_human_id,
      operational_owner_human_id: envelope.actor_human_id,
      current_responsible_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "active",
      tags: [],
      evidence_type: payload.evidence_type,
      description: payload.description,
      linked_entity_id: payload.linked_entity_id,
      linked_entity_type: payload.linked_entity_type,
      uri_optional: payload.uri_optional ?? null,
      captured_at: now,
      captured_by: envelope.actor_human_id,
    };
    saveEvidence(evidence);
    const event = publishExecutionEvent({
      event_type: "execution.evidence_attached",
      entity_id: id,
      entity_type: "Evidence",
      initiative_id: envelope.initiative_id,
      institution_id: envelope.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { linked_entity_id: payload.linked_entity_id },
    });
    return ok(id, "Evidence", null, "active", 1, [event.event_id]);
  }

  private recordOutcome(envelope: ExecutionCommandEnvelope, permissions: string[]): ExecutionCommandResult {
    const payload = envelope.payload as unknown as RecordOutcomePayload;
    const objective = loadObjective(payload.objective_id);
    if (!objective) {
      throw new ExecutionDomainError({ code: "EXECUTION_NOT_FOUND", message: "Objective not found" });
    }
    runValidationPipeline({ envelope, permissions, objective });
    const id = caeId("out");
    const now = nowIso();
    const outcome: OutcomeRecord = {
      canonical_id: id,
      public_id: `OUT-${id.slice(-6).toUpperCase()}`,
      display_name: `Outcome for ${objective.display_name}`,
      canonical_slug: `outcome-${objective.canonical_slug}`,
      institution_id: objective.institution_id,
      initiative_id: objective.initiative_id,
      parent_object_id: objective.canonical_id,
      parent_object_type: "Objective",
      object_type: "Outcome",
      visibility: objective.visibility,
      governance_classification: objective.governance_classification,
      executive_owner_human_id: objective.executive_owner_human_id,
      operational_owner_human_id: objective.operational_owner_human_id,
      current_responsible_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "active",
      tags: [],
      objective_id: objective.canonical_id,
      observed_result: payload.observed_result,
      expected_result: payload.expected_result,
      variance: payload.variance,
      confidence: payload.confidence,
      reviewer_human_id: envelope.actor_human_id,
      review_date: now.slice(0, 10),
      outcome_category: payload.outcome_category,
    };
    saveOutcome(outcome);
    const event = publishExecutionEvent({
      event_type: "execution.outcome_recorded",
      entity_id: id,
      entity_type: "Outcome",
      initiative_id: objective.initiative_id,
      institution_id: objective.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { objective_id: objective.canonical_id, category: payload.outcome_category },
    });
    return ok(id, "Outcome", null, "active", 1, [event.event_id]);
  }

  private loadObjectiveOrThrow(envelope: ExecutionCommandEnvelope): ObjectiveRecord {
    const id = envelope.entity_id_optional;
    if (!id) throw new ExecutionDomainError({ code: "EXECUTION_NOT_FOUND", message: "entity_id required" });
    const objective = loadObjective(id);
    if (!objective) throw new ExecutionDomainError({ code: "EXECUTION_NOT_FOUND", message: "Objective not found", entity_id: id });
    if (envelope.expected_version_optional != null && objective.current_version !== envelope.expected_version_optional) {
      throw new ExecutionDomainError({
        code: "EXECUTION_VERSION_CONFLICT",
        message: "Version conflict",
        entity_id: id,
        retryable: true,
        requirement_ids: ["CAE-11.2-W3-CON-002"],
      });
    }
    return objective;
  }

  private loadMissionOrThrow(envelope: ExecutionCommandEnvelope): MissionRecord {
    const id = envelope.entity_id_optional;
    if (!id) throw new ExecutionDomainError({ code: "EXECUTION_NOT_FOUND", message: "entity_id required" });
    const mission = loadMission(id);
    if (!mission) throw new ExecutionDomainError({ code: "EXECUTION_NOT_FOUND", message: "Mission not found", entity_id: id });
    return mission;
  }

  private loadTaskOrThrow(envelope: ExecutionCommandEnvelope): TaskRecord {
    const id = envelope.entity_id_optional;
    if (!id) throw new ExecutionDomainError({ code: "EXECUTION_NOT_FOUND", message: "entity_id required" });
    const task = loadTask(id);
    if (!task) throw new ExecutionDomainError({ code: "EXECUTION_NOT_FOUND", message: "Task not found", entity_id: id });
    return task;
  }
}

export const executionDomainService = new ExecutionDomainService();

export function assertExecutionMutationViaService(): never {
  throw new ExecutionDomainError({
    code: "EXECUTION_DIRECT_MUTATION_FORBIDDEN",
    message: "Direct execution mutation is forbidden; use ExecutionDomainService",
    requirement_ids: ["CAE-11.2-W3-SVC-002"],
  });
}

/** ExecutionTraceabilityService */
export const ExecutionTraceabilityService = {
  buildChain: buildTraceabilityChain,
  explainTask: explainTaskExistence,
};
