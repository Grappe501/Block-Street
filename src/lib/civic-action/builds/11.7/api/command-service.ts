/**
 * CAE-11.7-W5 — Communication command handlers (all writes via W3)
 */
import { caeId, nowIso } from "../../../utils";
import { communicationApplicationService } from "../application-service";
import type {
  CommunicationCommandEnvelope,
  CommunicationCommandResult,
  CommunicationCommandType,
} from "../services/commands";
import { humanizeCommunicationCommandFailure } from "../ux/human-messages";
import type { CommunicationApiContext } from "./contracts";
import { HIGH_IMPACT_ACTIONS, IDEMPOTENT_COMMANDS, LIFECYCLE_ACTION_ROUTES } from "./contracts";
import { stripUntrustedIdentityFields } from "./context";
import { commandResultToApiError } from "./errors";

export function buildCommunicationCommandEnvelope(
  apiCtx: CommunicationApiContext,
  commandType: CommunicationCommandType,
  initiativeId: string,
  body: Record<string, unknown>
): CommunicationCommandEnvelope {
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

export function executeCommunicationCommand(
  apiCtx: CommunicationApiContext,
  commandType: CommunicationCommandType,
  initiativeId: string,
  body: Record<string, unknown> = {}
) {
  const envelope = buildCommunicationCommandEnvelope(apiCtx, commandType, initiativeId, body);
  const result = communicationApplicationService.executeCommand(envelope, apiCtx.effective_permissions);
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
  apiCtx: CommunicationApiContext,
  initiativeId: string,
  entityId: string,
  actionSlug: string,
  body: Record<string, unknown> = {}
) {
  const commandType = LIFECYCLE_ACTION_ROUTES[actionSlug];
  if (!commandType) {
    const err: CommunicationCommandResult = {
      success: false,
      entity_id: entityId,
      entity_type: "conversation",
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
    const err: CommunicationCommandResult = {
      success: false,
      entity_id: entityId,
      entity_type: "conversation",
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

  const payload: Record<string, unknown> = { ...(body.payload as object) };
  if (actionSlug === "archive") {
    payload.conversation_id = entityId;
    payload.target_status = "archived";
  } else if (actionSlug === "restore") {
    payload.conversation_id = entityId;
    payload.target_status = "open";
  } else if (actionSlug === "resolve-thread") {
    payload.thread_id = entityId;
  }

  return executeCommunicationCommand(apiCtx, commandType, initiativeId, {
    ...body,
    entity_id: entityId,
    payload,
  });
}

export function createConversation(apiCtx: CommunicationApiContext, body: Record<string, unknown>) {
  const clean = stripUntrustedIdentityFields(body);
  const initiativeId = (clean.initiative_id as string) ?? apiCtx.initiative_id_optional ?? "";
  if (!initiativeId) {
    const err: CommunicationCommandResult = {
      success: false,
      entity_id: null,
      entity_type: "conversation",
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
    purpose: clean.purpose ?? "",
    context_type: clean.context_type ?? "initiative",
    related_object_id: clean.related_object_id ?? initiativeId,
    related_object_type: clean.related_object_type ?? "initiative",
    display_name: clean.display_name ?? clean.name ?? "New Conversation",
    participant_human_ids: (clean.participant_human_ids as string[]) ?? [apiCtx.actor_human_id],
    mission_id_optional: clean.mission_id_optional ?? null,
    objective_id_optional: clean.objective_id_optional ?? null,
    visibility: clean.visibility ?? "initiative_participants",
  };
  return executeCommunicationCommand(apiCtx, "CreateConversation", initiativeId, { payload });
}

export function postMessage(apiCtx: CommunicationApiContext, initiativeId: string, body: Record<string, unknown>) {
  const clean = stripUntrustedIdentityFields(body);
  return executeCommunicationCommand(apiCtx, "PostMessage", initiativeId, { payload: clean });
}

export function createMeeting(apiCtx: CommunicationApiContext, body: Record<string, unknown>) {
  const clean = stripUntrustedIdentityFields(body);
  const initiativeId = (clean.initiative_id as string) ?? apiCtx.initiative_id_optional ?? "";
  if (!initiativeId) {
    const err: CommunicationCommandResult = {
      success: false,
      entity_id: null,
      entity_type: "meeting",
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
  return executeCommunicationCommand(apiCtx, "CreateMeeting", initiativeId, { payload: clean });
}

export function recordDecision(apiCtx: CommunicationApiContext, initiativeId: string, body: Record<string, unknown>) {
  const clean = stripUntrustedIdentityFields(body);
  return executeCommunicationCommand(apiCtx, "RecordDecision", initiativeId, { payload: clean });
}

export function createDocument(apiCtx: CommunicationApiContext, body: Record<string, unknown>) {
  const clean = stripUntrustedIdentityFields(body);
  const initiativeId = (clean.initiative_id as string) ?? apiCtx.initiative_id_optional ?? "";
  if (!initiativeId) {
    const err: CommunicationCommandResult = {
      success: false,
      entity_id: null,
      entity_type: "document",
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
  return executeCommunicationCommand(apiCtx, "CreateDocument", initiativeId, { payload: clean });
}

export function requiresIdempotencyKey(commandType: CommunicationCommandType): boolean {
  return IDEMPOTENT_COMMANDS.has(commandType);
}

export function dryRunCommandFailure(commandType: CommunicationCommandType) {
  return humanizeCommunicationCommandFailure({
    success: false,
    entity_id: null,
    entity_type: "conversation",
    previous_status_optional: null,
    new_status_optional: null,
    version: null,
    events: [],
    warnings: [],
    next_required_actions: [],
    validation_errors: [{ code: "DRY_RUN", message: `Validation only for ${commandType}` }],
  });
}

/** Read-only AI summary assembly — no domain mutation */
export function summarizeConversationReadOnly(conversationId: string, apiCtx: CommunicationApiContext) {
  const bundle = communicationApplicationService.getConversationBundle(conversationId);
  if (!bundle || bundle.conversation.institution_id !== apiCtx.institution_id) {
    return null;
  }
  const recentMessages = bundle.messages.slice(-5).map((m) => ({
    message_id: m.canonical_id,
    author: m.author_human_id,
    excerpt: m.body.slice(0, 200),
  }));
  return {
    conversation_id: conversationId,
    display_name: bundle.conversation.display_name,
    thread_count: bundle.threads.length,
    message_count: bundle.messages.length,
    decision_count: bundle.decisions.length,
    recent_messages: recentMessages,
    summary_text:
      bundle.aiSummaries[0]?.summary_text ??
      `Conversation "${bundle.conversation.display_name}" has ${bundle.messages.length} messages across ${bundle.threads.length} threads.`,
    read_only: true,
    mutation_allowed: false,
  };
}
