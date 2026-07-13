/**
 * CAE-11.12-W5 — Domain-safe Knowledge API errors
 */
import { ApiError } from "@/lib/api/errors";
import { isKnowledgeDomainError } from "../services/errors";
import type { KnowledgeCommandResult } from "../services/commands";
import type { KnowledgeApiErrorBody } from "./contracts";

export function isDomainQueryError(error: unknown): boolean {
  return isKnowledgeDomainError(error);
}

export function knowledgeErrorToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isKnowledgeDomainError(error)) {
    const body: KnowledgeApiErrorBody = {
      code: error.code,
      message: error.message,
      requirement_ids: error.requirement_ids,
      current_state_optional: error.current_state,
      requested_state_optional: error.requested_state,
      retryable: error.retryable,
      human_blocked: error.human_message
        ? {
            title: error.human_message,
            explanation: error.message,
            items: error.blocking_requirement ? [error.blocking_requirement] : [],
            next_action: error.suggested_action,
          }
        : undefined,
    };
    return new ApiError(error.code, error.message, statusForCode(error.code));
  }

  const message = error instanceof Error ? error.message : "Unexpected Knowledge API error";
  return new ApiError("INTERNAL_ERROR", message, 500);
}

export function commandResultToApiError(result: KnowledgeCommandResult): ApiError | null {
  if (result.success) return null;
  const body: KnowledgeApiErrorBody = {
    code: result.validation_errors[0]?.code ?? "KNOWLEDGE_VALIDATION_FAILED",
    message: result.validation_errors[0]?.message ?? "Command validation failed",
    requirement_ids: ["CAE-11.12-W5-API-010"],
    field_errors: Object.fromEntries(
      result.validation_errors.filter((e) => e.field).map((e) => [e.field!, e.message])
    ),
    retryable: false,
    human_blocked: result.validation_errors[0]?.human_message
      ? {
          title: result.validation_errors[0].human_message,
          explanation:
            result.validation_errors[0].technical_reason ??
            result.validation_errors[0].message ??
            "Command validation failed",
          items: result.next_required_actions,
          next_action: result.validation_errors[0].suggested_action,
        }
      : undefined,
  };
  return new ApiError(body.code, body.message, 422, body.field_errors);
}

function statusForCode(code: string): number {
  switch (code) {
    case "KNOWLEDGE_NOT_FOUND":
      return 404;
    case "KNOWLEDGE_PERMISSION_DENIED":
    case "KNOWLEDGE_SERVICE_IDENTITY_FORBIDDEN":
    case "KNOWLEDGE_INSTITUTION_MISMATCH":
      return 403;
    case "KNOWLEDGE_ARCHIVED_READ_ONLY":
      return 423;
    case "KNOWLEDGE_VERSION_CONFLICT":
    case "KNOWLEDGE_IDEMPOTENCY_CONFLICT":
      return 409;
    default:
      return 422;
  }
}
