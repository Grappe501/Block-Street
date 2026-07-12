/**
 * CAE-11.2-W5 — Domain-safe Objective API errors
 */
import { ApiError } from "@/lib/api/errors";
import { isExecutionDomainError } from "../services/errors";
import { humanizeExecutionCommandFailure, humanizeExecutionError } from "../ux/human-messages";
import type { ExecutionCommandResult } from "../services/commands";
import type { ObjectiveApiErrorBody } from "./contracts";

export function isDomainQueryError(error: unknown): boolean {
  return isExecutionDomainError(error);
}

export function objectiveErrorToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isExecutionDomainError(error)) {
    const human = humanizeExecutionError(error);
    const body: ObjectiveApiErrorBody = {
      code: error.code,
      message: error.message,
      requirement_ids: error.requirement_ids,
      current_state_optional: error.current_state as ObjectiveApiErrorBody["current_state_optional"],
      requested_state_optional: error.requested_state as ObjectiveApiErrorBody["requested_state_optional"],
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

  const message = error instanceof Error ? error.message : "Unexpected Objective API error";
  return new ApiError("INTERNAL_ERROR", message, 500);
}

export function commandResultToApiError(result: ExecutionCommandResult): ApiError | null {
  if (result.success) return null;
  const human = humanizeExecutionCommandFailure(result);
  const body: ObjectiveApiErrorBody = {
    code: result.validation_errors[0]?.code ?? "EXECUTION_VALIDATION_FAILED",
    message: result.validation_errors[0]?.message ?? "Command validation failed",
    requirement_ids: ["CAE-11.2-W5-API-010"],
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
    case "EXECUTION_NOT_FOUND":
      return 404;
    case "EXECUTION_PERMISSION_DENIED":
    case "EXECUTION_SERVICE_IDENTITY_FORBIDDEN":
    case "EXECUTION_INSTITUTION_MISMATCH":
      return 403;
    case "EXECUTION_ARCHIVED_READ_ONLY":
      return 423;
    case "EXECUTION_VERSION_CONFLICT":
    case "EXECUTION_IDEMPOTENCY_CONFLICT":
      return 409;
    default:
      return 422;
  }
}
