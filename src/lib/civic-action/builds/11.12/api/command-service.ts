/**
 * CAE-11.12-W5 — Knowledge command handlers (all writes via W3)
 */
import { caeId, nowIso } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeCommandEnvelope, KnowledgeCommandResult, KnowledgeCommandType } from "../services/commands";
import type { KnowledgeApiContext } from "./contracts";
import { HIGH_IMPACT_ACTIONS, IDEMPOTENT_COMMANDS, LIFECYCLE_ACTION_ROUTES } from "./contracts";
import { stripUntrustedIdentityFields } from "./context";
import { commandResultToApiError } from "./errors";

export function buildKnowledgeCommandEnvelope(
  apiCtx: KnowledgeApiContext,
  commandType: KnowledgeCommandType,
  body: Record<string, unknown>
): KnowledgeCommandEnvelope {
  const clean = stripUntrustedIdentityFields(body);
  return {
    command_id: (clean.command_id as string) ?? caeId("cmd"),
    command_type: commandType,
    actor_human_id: apiCtx.actor_human_id,
    service_identity_id_optional: apiCtx.service_identity_id_optional,
    institution_id: apiCtx.institution_id,
    active_membership_id: apiCtx.institution_membership_id,
    initiative_id_optional:
      (clean.initiative_id as string) ?? apiCtx.initiative_id_optional ?? null,
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

export function executeKnowledgeCommand(
  apiCtx: KnowledgeApiContext,
  commandType: KnowledgeCommandType,
  body: Record<string, unknown> = {}
) {
  const envelope = buildKnowledgeCommandEnvelope(apiCtx, commandType, body);
  const result = knowledgeApplicationService.executeCommand(envelope, apiCtx.effective_permissions);
  const apiError = commandResultToApiError(result);
  if (apiError) throw apiError;
  return { result, entity_id: result.entity_id };
}

export function executeLifecycleAction(
  apiCtx: KnowledgeApiContext,
  artifactId: string,
  actionSlug: string,
  body: Record<string, unknown> = {}
) {
  const commandType = LIFECYCLE_ACTION_ROUTES[actionSlug];
  if (!commandType) {
    const err: KnowledgeCommandResult = {
      success: false,
      entity_id: artifactId,
      entity_type: "KnowledgeArtifact",
      previous_status_optional: null,
      new_status_optional: null,
      version: null,
      events: [],
      warnings: [],
      next_required_actions: [],
      validation_errors: [{ code: "UNKNOWN_ACTION", message: `Unknown lifecycle action: ${actionSlug}` }],
      audit_id_optional: null,
    };
    throw commandResultToApiError(err)!;
  }

  if (HIGH_IMPACT_ACTIONS.has(actionSlug) && !apiCtx.idempotency_key_optional && !body.idempotency_key) {
    const err: KnowledgeCommandResult = {
      success: false,
      entity_id: artifactId,
      entity_type: "KnowledgeArtifact",
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
      audit_id_optional: null,
    };
    throw commandResultToApiError(err)!;
  }

  return executeKnowledgeCommand(apiCtx, commandType, {
    ...body,
    artifact_id: artifactId,
    payload: body.payload ?? body,
  });
}

export function createKnowledgeArtifact(apiCtx: KnowledgeApiContext, body: Record<string, unknown>) {
  return executeKnowledgeCommand(apiCtx, "CreateKnowledgeArtifact", body);
}

export function isIdempotentCommand(commandType: KnowledgeCommandType): boolean {
  return IDEMPOTENT_COMMANDS.has(commandType);
}
