/**
 * CAE-11.1-W5 — Domain-safe API errors
 */
import { ApiError } from "@/lib/api/errors";
import { isInitiativeDomainError } from "../services/errors";
import { humanizeDomainError, humanizeCommandFailure } from "../ux/human-messages";
import type { InitiativeCommandResult } from "../services/commands";
import type { InitiativeApiErrorBody } from "./contracts";

export function initiativeErrorToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isInitiativeDomainError(error)) {
    const human = humanizeDomainError(error);
    const body: InitiativeApiErrorBody = {
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
    const status = statusForCode(error.code);
    return new ApiError(error.code, error.message, status, body.field_errors);
  }

  const message = error instanceof Error ? error.message : "Unexpected Initiative API error";
  return new ApiError("INTERNAL_ERROR", message, 500);
}

export function commandResultToApiError(result: InitiativeCommandResult): ApiError | null {
  if (result.success) return null;
  const human = humanizeCommandFailure(result);
  const body: InitiativeApiErrorBody = {
    code: result.validation_errors[0]?.code ?? "INITIATIVE_VALIDATION_FAILED",
    message: result.validation_errors[0]?.message ?? "Command validation failed",
    requirement_ids: ["CAE-11.1-W5-API-010"],
    field_errors: Object.fromEntries(
      result.validation_errors.filter((e) => e.field).map((e) => [e.field!, e.message])
    ),
    current_state_optional: result.previous_status_optional ?? undefined,
    requested_state_optional: result.new_status_optional ?? undefined,
    retryable: false,
    human_blocked: human
      ? { title: human.title, explanation: human.explanation, items: human.items, next_action: human.next_action }
      : undefined,
  };
  return new ApiError(body.code, body.message, 422, body.field_errors);
}

function statusForCode(code: string): number {
  switch (code) {
    case "INITIATIVE_NOT_FOUND":
      return 404;
    case "INITIATIVE_PERMISSION_DENIED":
    case "INITIATIVE_SERVICE_IDENTITY_FORBIDDEN":
      return 403;
    case "INITIATIVE_INSTITUTION_MISMATCH":
      return 403;
    case "INITIATIVE_ARCHIVED_READ_ONLY":
      return 423;
    case "INITIATIVE_VERSION_CONFLICT":
    case "INITIATIVE_IDEMPOTENCY_CONFLICT":
      return 409;
    case "INITIATIVE_CHARTER_INCOMPLETE":
    case "INITIATIVE_BLOCKING_DEPENDENCY":
    case "INITIATIVE_TRANSITION_NOT_ALLOWED":
    case "INITIATIVE_OWNER_INELIGIBLE":
    case "INITIATIVE_OWNER_REQUIRED":
      return 422;
    default:
      return 422;
  }
}
