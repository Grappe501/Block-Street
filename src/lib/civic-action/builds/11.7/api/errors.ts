/**
 * CAE-11.7-W5 — Domain-safe Communication API errors
 */
import { ApiError } from "@/lib/api/errors";
import { isCommunicationDomainError } from "../services/errors";
import { humanizeCommunicationCommandFailure, humanizeCommunicationError } from "../ux/human-messages";
import type { CommunicationCommandResult } from "../services/commands";
import type { CommunicationApiErrorBody } from "./contracts";

export function isDomainQueryError(error: unknown): boolean {
  return isCommunicationDomainError(error);
}

export function communicationErrorToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isCommunicationDomainError(error)) {
    const human = humanizeCommunicationError(error);
    const body: CommunicationApiErrorBody = {
      code: error.code,
      message: error.message,
      requirement_ids: error.requirement_ids,
      current_state_optional: error.current_state,
      requested_state_optional: error.requested_state,
      retryable: error.retryable,
      human_blocked: {
        title: human.title,
        explanation: human.explanation,
        items: human.items,
        next_action: human.next_action,
      },
    };
    return new ApiError(error.code, error.message, statusForCode(error.code));
  }

  const message = error instanceof Error ? error.message : "Unexpected Communication API error";
  return new ApiError("INTERNAL_ERROR", message, 500);
}

export function commandResultToApiError(result: CommunicationCommandResult): ApiError | null {
  if (result.success) return null;
  const human = humanizeCommunicationCommandFailure(result);
  const body: CommunicationApiErrorBody = {
    code: result.validation_errors[0]?.code ?? "COMMUNICATION_VALIDATION_FAILED",
    message: result.validation_errors[0]?.message ?? "Command validation failed",
    requirement_ids: ["CAE-11.7-W5-API-010"],
    field_errors: Object.fromEntries(
      result.validation_errors.filter((e) => e.field).map((e) => [e.field!, e.message])
    ),
    retryable: false,
    human_blocked: human
      ? { title: human.title, explanation: human.explanation, items: human.items, next_action: human.next_action }
      : undefined,
  };
  return new ApiError(body.code, body.message, 422, body.field_errors);
}

function statusForCode(code: string): number {
  switch (code) {
    case "COMMUNICATION_NOT_FOUND":
      return 404;
    case "COMMUNICATION_PERMISSION_DENIED":
    case "COMMUNICATION_SERVICE_IDENTITY_FORBIDDEN":
    case "COMMUNICATION_INSTITUTION_MISMATCH":
    case "COMMUNICATION_VISIBILITY_DENIED":
      return 403;
    case "COMMUNICATION_ARCHIVED_READ_ONLY":
      return 423;
    case "COMMUNICATION_VERSION_CONFLICT":
    case "COMMUNICATION_IDEMPOTENCY_CONFLICT":
      return 409;
    default:
      return 422;
  }
}
