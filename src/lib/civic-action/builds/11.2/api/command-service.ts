/**
 * CAE-11.2-W5 — Execution command handlers (all writes via W3)
 */
import { caeId, nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import type { ExecutionCommandEnvelope, ExecutionCommandResult, ExecutionCommandType } from "../services/commands";
import { humanizeExecutionCommandFailure } from "../ux/human-messages";
import type { ObjectiveApiContext } from "./contracts";
import { HIGH_IMPACT_ACTIONS, IDEMPOTENT_COMMANDS, LIFECYCLE_ACTION_ROUTES } from "./contracts";
import { stripUntrustedIdentityFields } from "./context";
import { commandResultToApiError } from "./errors";

export function buildExecutionCommandEnvelope(
  apiCtx: ObjectiveApiContext,
  commandType: ExecutionCommandType,
  initiativeId: string,
  body: Record<string, unknown>
): ExecutionCommandEnvelope {
  const clean = stripUntrustedIdentityFields(body);
  return {
    command_id: (clean.command_id as string) ?? caeId("cmd"),
    command_type: commandType,
    actor_human_id: apiCtx.actor_human_id,
    service_identity_id_optional: apiCtx.service_identity_id_optional,
    institution_id: apiCtx.institution_id,
    active_membership_id: apiCtx.institution_membership_id,
    initiative_id: initiativeId,
    entity_id_optional: (clean.entity_id as string) ?? (clean.entity_id_optional as string) ?? null,
    expected_version_optional: (clean.expected_version as number) ?? (clean.expected_version_optional as number) ?? null,
    requested_at: nowIso(),
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    idempotency_key: apiCtx.idempotency_key_optional ?? (clean.idempotency_key as string) ?? null,
    reason_optional: (clean.reason as string) ?? (clean.reason_optional as string) ?? null,
    request_source: "api",
    payload: (clean.payload as Record<string, unknown>) ?? clean,
  };
}

export function executeObjectiveCommand(
  apiCtx: ObjectiveApiContext,
  commandType: ExecutionCommandType,
  initiativeId: string,
  body: Record<string, unknown> = {}
) {
  const envelope = buildExecutionCommandEnvelope(apiCtx, commandType, initiativeId, body);
  const result = objectiveApplicationService.executeCommand(envelope, apiCtx.effective_permissions);
  const apiError = commandResultToApiError(result);
  if (apiError) throw apiError;

  return {
    result,
    human_blocked: null,
    entity_id: result.entity_id,
    initiative_id: initiativeId,
  };
}

export function executeLifecycleAction(
  apiCtx: ObjectiveApiContext,
  initiativeId: string,
  objectiveId: string,
  actionSlug: string,
  body: Record<string, unknown> = {}
) {
  const commandType = LIFECYCLE_ACTION_ROUTES[actionSlug];
  if (!commandType) {
    const err: ExecutionCommandResult = {
      success: false,
      entity_id: objectiveId,
      entity_type: "objective",
      previous_status_optional: null,
      new_status_optional: null,
      version: null,
      events: [],
      warnings: [],
      next_required_actions: [],
      validation_errors: [{ code: "UNKNOWN_ACTION", message: `Unknown lifecycle action: ${actionSlug}` }],
    };
    throw commandResultToApiError(err)!;
  }

  if (HIGH_IMPACT_ACTIONS.has(actionSlug) && !apiCtx.idempotency_key_optional && !body.idempotency_key) {
    const err: ExecutionCommandResult = {
      success: false,
      entity_id: objectiveId,
      entity_type: "objective",
      previous_status_optional: null,
      new_status_optional: null,
      version: null,
      events: [],
      warnings: [],
      next_required_actions: [],
      validation_errors: [
        {
          code: "IDEMPOTENCY_KEY_REQUIRED",
          message: "High-impact actions require an Idempotency-Key header or idempotency_key in the body.",
          field: "idempotency_key",
        },
      ],
    };
    throw commandResultToApiError(err)!;
  }

  return executeObjectiveCommand(apiCtx, commandType, initiativeId, {
    ...body,
    entity_id: objectiveId,
    payload: { target_status: actionSlug === "archive" ? "archived" : undefined, ...(body.payload as object) },
  });
}

export function createObjective(apiCtx: ObjectiveApiContext, body: Record<string, unknown>) {
  const clean = stripUntrustedIdentityFields(body);
  const initiativeId = (clean.initiative_id as string) ?? apiCtx.initiative_id_optional ?? "";
  if (!initiativeId) {
    const err: ExecutionCommandResult = {
      success: false,
      entity_id: null,
      entity_type: "objective",
      previous_status_optional: null,
      new_status_optional: null,
      version: null,
      events: [],
      warnings: [],
      next_required_actions: [],
      validation_errors: [{ code: "INITIATIVE_REQUIRED", message: "initiative_id is required", field: "initiative_id" }],
    };
    throw commandResultToApiError(err)!;
  }
  const payload = {
    initiative_id: initiativeId,
    display_name: clean.display_name ?? clean.name,
    objective_type: clean.objective_type ?? "operational",
    purpose: clean.purpose ?? "",
    desired_future_state: clean.desired_future_state ?? "",
    current_state: clean.current_state ?? "Not started",
    executive_owner_human_id: clean.executive_owner_human_id ?? apiCtx.actor_human_id,
    operational_owner_human_id: clean.operational_owner_human_id ?? apiCtx.actor_human_id,
    review_authority_human_id: clean.review_authority_human_id ?? apiCtx.actor_human_id,
    success_definition: clean.success_definition ?? "",
    measurement_strategy: clean.measurement_strategy ?? "",
    evidence_requirements: clean.evidence_requirements ?? "Documented proof of progress",
  };
  return executeObjectiveCommand(apiCtx, "CreateObjective", initiativeId, { payload });
}

export function requiresIdempotencyKey(commandType: ExecutionCommandType): boolean {
  return IDEMPOTENT_COMMANDS.has(commandType);
}

export function dryRunCommandFailure(commandType: ExecutionCommandType) {
  return humanizeExecutionCommandFailure({
    success: false,
    entity_id: null,
    entity_type: "objective",
    previous_status_optional: null,
    new_status_optional: null,
    version: null,
    events: [],
    warnings: [],
    next_required_actions: [],
    validation_errors: [{ code: "DRY_RUN", message: `Validation only for ${commandType}` }],
  });
}
