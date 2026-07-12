/**
 * CAE-11.1-W5 — Initiative command handlers (all writes via W3)
 */
import { caeId, nowIso } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import type { InitiativeCommandEnvelope, InitiativeCommandResult, InitiativeCommandType } from "../services/commands";
import { humanizeCommandFailure } from "../ux/human-messages";
import type { InitiativeApiContext } from "./contracts";
import { HIGH_IMPACT_ACTIONS, LIFECYCLE_ACTION_ROUTES } from "./contracts";
import { stripUntrustedIdentityFields } from "./context";
import { commandResultToApiError } from "./errors";

export function buildCommandEnvelope(
  apiCtx: InitiativeApiContext,
  commandType: InitiativeCommandType,
  initiativeId: string | null,
  body: Record<string, unknown>
): InitiativeCommandEnvelope {
  const clean = stripUntrustedIdentityFields(body);
  return {
    command_id: (clean.command_id as string) ?? caeId("cmd"),
    command_type: commandType,
    actor_human_id: apiCtx.actor_human_id,
    service_identity_id_optional: apiCtx.service_identity_id_optional,
    institution_id: apiCtx.institution_id,
    active_membership_id: apiCtx.institution_membership_id,
    initiative_id_optional: initiativeId,
    expected_version_optional: (clean.expected_version as number) ?? (clean.expected_version_optional as number) ?? null,
    requested_at: nowIso(),
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    idempotency_key: apiCtx.idempotency_key_optional ?? (clean.idempotency_key as string) ?? null,
    reason_optional: (clean.reason as string) ?? (clean.reason_optional as string) ?? null,
    payload: (clean.changes as Record<string, unknown>) ?? (clean.payload as Record<string, unknown>) ?? clean,
  };
}

export function executeInitiativeCommand(
  apiCtx: InitiativeApiContext,
  commandType: InitiativeCommandType,
  initiativeId: string | null,
  body: Record<string, unknown> = {}
) {
  const envelope = buildCommandEnvelope(apiCtx, commandType, initiativeId, body);
  const result = initiativeApplicationService.executeCommand(envelope, apiCtx.effective_permissions);
  const apiError = commandResultToApiError(result);
  if (apiError) throw apiError;

  return {
    result,
    human_blocked: null,
    initiative_id: result.initiative_id ?? initiativeId,
  };
}

export function executeLifecycleAction(
  apiCtx: InitiativeApiContext,
  initiativeId: string,
  actionSlug: string,
  body: Record<string, unknown> = {}
) {
  const commandType = LIFECYCLE_ACTION_ROUTES[actionSlug];
  if (!commandType) {
    const err: InitiativeCommandResult = {
      success: false,
      initiative_id: initiativeId,
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
    const err: InitiativeCommandResult = {
      success: false,
      initiative_id: initiativeId,
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

  return executeInitiativeCommand(apiCtx, commandType, initiativeId, body);
}

export function createInitiativeDraft(apiCtx: InitiativeApiContext, body: Record<string, unknown>) {
  const clean = stripUntrustedIdentityFields(body);
  const payload = {
    governing_institution_id: apiCtx.institution_id,
    initiative_name: clean.name ?? clean.initiative_name,
    initiative_type: clean.initiative_type,
    visibility: clean.visibility ?? "institution",
    problem_statement: clean.initial_problem_or_opportunity ?? clean.problem_statement ?? "",
    portfolio_category: clean.portfolio_category_optional ?? clean.portfolio_category ?? null,
    proposed_operational_owner_human_id:
      clean.proposed_operational_owner_human_id_optional ?? clean.proposed_operational_owner_human_id ?? null,
  };
  return executeInitiativeCommand(apiCtx, "CreateInitiativeDraftCommand", null, { payload });
}

export function updateInitiativeDraft(apiCtx: InitiativeApiContext, initiativeId: string, body: Record<string, unknown>) {
  return executeInitiativeCommand(apiCtx, "UpdateInitiativeDraftCommand", initiativeId, body);
}

export function dryRunCommandFailure(commandType: InitiativeCommandType) {
  return humanizeCommandFailure({
    success: false,
    initiative_id: null,
    previous_status_optional: null,
    new_status_optional: null,
    version: null,
    events: [],
    warnings: [],
    next_required_actions: [],
    validation_errors: [{ code: "DRY_RUN", message: `Validation only for ${commandType}` }],
  });
}
