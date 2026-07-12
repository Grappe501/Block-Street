/**
 * CAE-11.2-W4 — Execution command API (writes via W3 engine)
 */
import { caeId, nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import type { ExecutionCommandEnvelope, ExecutionCommandResult, ExecutionCommandType } from "../services/commands";
import { humanizeExecutionCommandFailure } from "../ux/human-messages";
import { DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT } from "../ux/experience-context";

export function buildExecutionCommandEnvelope(
  commandType: ExecutionCommandType,
  initiativeId: string,
  body: Record<string, unknown>
): ExecutionCommandEnvelope {
  return {
    command_id: (body.command_id as string) ?? caeId("cmd"),
    command_type: commandType,
    actor_human_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.actor_human_id,
    institution_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.institution_id,
    active_membership_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id: initiativeId,
    entity_id_optional: (body.entity_id as string) ?? (body.entity_id_optional as string) ?? null,
    expected_version_optional: (body.expected_version as number) ?? null,
    requested_at: nowIso(),
    request_id: caeId("req"),
    correlation_id: caeId("cor"),
    idempotency_key: (body.idempotency_key as string) ?? null,
    reason_optional: (body.reason as string) ?? null,
    request_source: "human",
    payload: (body.payload as Record<string, unknown>) ?? body,
  };
}

export function executeObjectiveCommand(
  commandType: ExecutionCommandType,
  initiativeId: string,
  body: Record<string, unknown> = {}
) {
  const envelope = buildExecutionCommandEnvelope(commandType, initiativeId, body);
  const result = objectiveApplicationService.executeCommand(
    envelope,
    DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.permissions
  );
  const human_blocked = humanizeExecutionCommandFailure(result);
  if (!result.success) {
    return { result, human_blocked, entity_id: result.entity_id };
  }
  return { result, human_blocked: null, entity_id: result.entity_id };
}

export function commandResultToHttpError(result: ExecutionCommandResult) {
  if (result.success) return null;
  return {
    status: 422,
    body: {
      success: false,
      validation_errors: result.validation_errors,
      human_blocked: humanizeExecutionCommandFailure(result),
    },
  };
}
