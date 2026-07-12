/**
 * CAE-11.2-W3 — Execution validation pipeline
 */
import { loadInitiativeAggregate } from "../../11.1/services/repository";
import type { ExecutionCommandEnvelope } from "./commands";
import { ExecutionDomainError } from "./errors";
import { resolveExecutionAuthority, assertExecutionAuthority } from "./policy";
import { validateObjectiveRecord, validateTaskRecord } from "../data-validation";
import {
  isObjectiveTransitionAllowed,
  isMissionTransitionAllowed,
  isTaskTransitionAllowed,
  childExceedsParent,
} from "../state-machines";
import type { MissionRecord, ObjectiveRecord, TaskRecord } from "../data-model";
import { evaluateBlockingDependencies } from "./dependency-engine";

export interface PipelineContext {
  envelope: ExecutionCommandEnvelope;
  permissions: string[];
  objective?: ObjectiveRecord | null;
  mission?: MissionRecord | null;
  task?: TaskRecord | null;
}

export function runValidationPipeline(ctx: PipelineContext, stages: {
  skipPermission?: boolean;
  skipParent?: boolean;
  skipLifecycle?: boolean;
  skipDependency?: boolean;
  skipOwnership?: boolean;
} = {}) {
  const { envelope, permissions } = ctx;

  if (!stages.skipPermission) {
    const auth = resolveExecutionAuthority(
      envelope.command_type,
      envelope.actor_human_id,
      envelope.institution_id,
      ctx.objective?.institution_id ?? ctx.mission?.institution_id ?? ctx.task?.institution_id ?? null,
      ctx.objective?.executive_owner_human_id,
      ctx.objective?.operational_owner_human_id,
      permissions
    );
    assertExecutionAuthority(auth);
  }

  if (!stages.skipParent && envelope.initiative_id) {
    const ini = loadInitiativeAggregate(envelope.initiative_id);
    if (!ini) {
      throw new ExecutionDomainError({
        code: "EXECUTION_VALIDATION_FAILED",
        message: "Parent Initiative not found",
        requirement_ids: ["CAE-11.2-W3-VAL-004"],
      });
    }
    if (ini.initiative.institution_id !== envelope.institution_id) {
      throw new ExecutionDomainError({
        code: "EXECUTION_INSTITUTION_MISMATCH",
        message: "Initiative institution mismatch",
        requirement_ids: ["CAE-11.2-W3-VAL-003"],
      });
    }
    if (ctx.objective && envelope.command_type === "ActivateObjective" && ini.initiative.status !== "active") {
      throw new ExecutionDomainError({
        code: "EXECUTION_INITIATIVE_INACTIVE",
        message: "Objective cannot activate until parent Initiative is Active",
        entity_id: ctx.objective.canonical_id,
        requirement_ids: ["CAE-11.2-W3-PAR-001"],
        blocking_requirement: "Activate parent Initiative first",
      });
    }
  }

  if (ctx.objective) {
    const issues = validateObjectiveRecord(ctx.objective);
    if (issues.length > 0) {
      throw new ExecutionDomainError({
        code: "EXECUTION_VALIDATION_FAILED",
        message: issues[0].message,
        entity_id: ctx.objective.canonical_id,
        field: issues[0].field,
        requirement_ids: ["CAE-11.2-W3-VAL-001"],
      });
    }
  }

  if (ctx.mission && ctx.objective && !stages.skipParent) {
    if (childExceedsParent(ctx.mission.lifecycle_state, ctx.objective.lifecycle_state)) {
      throw new ExecutionDomainError({
        code: "EXECUTION_PARENT_CONSTRAINT",
        message: `Mission state ${ctx.mission.lifecycle_state} exceeds Objective state ${ctx.objective.lifecycle_state}`,
        entity_id: ctx.mission.canonical_id,
        requirement_ids: ["CAE-11.2-W3-PAR-002"],
      });
    }
    if (ctx.objective.lifecycle_state === "archived") {
      throw new ExecutionDomainError({
        code: "EXECUTION_PARENT_CONSTRAINT",
        message: "Cannot mutate Mission under archived Objective",
        entity_id: ctx.mission.canonical_id,
        requirement_ids: ["CAE-11.2-W3-PAR-003"],
      });
    }
  }

  if (ctx.task && ctx.mission && !stages.skipParent) {
    const issues = validateTaskRecord(ctx.task, ctx.mission);
    if (issues.length > 0) {
      throw new ExecutionDomainError({
        code: "EXECUTION_ORPHAN_PROHIBITED",
        message: issues[0].message,
        entity_id: ctx.task.canonical_id,
        requirement_ids: ["CAE-11.2-W3-POL-001"],
      });
    }
  }

  if (!stages.skipDependency && ctx.mission) {
    const blocked = evaluateBlockingDependencies(ctx.mission.canonical_id, "Mission");
    if (blocked.blocked) {
      throw new ExecutionDomainError({
        code: "EXECUTION_BLOCKING_DEPENDENCY",
        message: blocked.reason ?? "Blocking dependency prevents action",
        entity_id: ctx.mission.canonical_id,
        requirement_ids: ["CAE-11.2-W3-DEP-001"],
        blocking_requirement: blocked.blocking_entity_id ?? undefined,
      });
    }
  }
}

export function assertObjectiveTransition(from: string, to: string, entityId: string) {
  if (!isObjectiveTransitionAllowed(from as never, to as never)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_TRANSITION_NOT_ALLOWED",
      message: `Illegal Objective transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "Objective",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.2-W3-LIF-001"],
      suggested_action: "Follow lawful intermediate states (e.g. Draft → Proposed → Approved)",
    });
  }
}

export function assertMissionTransition(from: string, to: string, entityId: string) {
  if (!isMissionTransitionAllowed(from as never, to as never)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_TRANSITION_NOT_ALLOWED",
      message: `Illegal Mission transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "Mission",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.2-W3-LIF-002"],
    });
  }
}

export function assertTaskTransition(from: string, to: string, entityId: string) {
  if (!isTaskTransitionAllowed(from as never, to as never)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_TRANSITION_NOT_ALLOWED",
      message: `Illegal Task transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "Task",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.2-W3-LIF-003"],
    });
  }
}

/** ExecutionValidationService */
export const ExecutionValidationService = {
  runPipeline: runValidationPipeline,
  assertObjectiveTransition,
  assertMissionTransition,
  assertTaskTransition,
};
