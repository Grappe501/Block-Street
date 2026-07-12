/**
 * CAE-11.2-W3 — Execution domain errors
 */
import type { ExecutionValidationError } from "./commands";

export type ExecutionErrorCode =
  | "EXECUTION_NOT_FOUND"
  | "EXECUTION_INSTITUTION_MISMATCH"
  | "EXECUTION_PERMISSION_DENIED"
  | "EXECUTION_OWNER_REQUIRED"
  | "EXECUTION_OWNER_INELIGIBLE"
  | "EXECUTION_TRANSITION_NOT_ALLOWED"
  | "EXECUTION_PARENT_CONSTRAINT"
  | "EXECUTION_CHILD_CONSTRAINT"
  | "EXECUTION_BLOCKING_DEPENDENCY"
  | "EXECUTION_VERSION_CONFLICT"
  | "EXECUTION_ARCHIVED_READ_ONLY"
  | "EXECUTION_ORPHAN_PROHIBITED"
  | "EXECUTION_INITIATIVE_INACTIVE"
  | "EXECUTION_IDEMPOTENCY_CONFLICT"
  | "EXECUTION_DIRECT_MUTATION_FORBIDDEN"
  | "EXECUTION_SERVICE_IDENTITY_FORBIDDEN"
  | "EXECUTION_VALIDATION_FAILED";

export class ExecutionDomainError extends Error {
  readonly code: ExecutionErrorCode;
  readonly entity_id?: string;
  readonly entity_type?: string;
  readonly field?: string;
  readonly current_state?: string;
  readonly requested_state?: string;
  readonly requirement_ids: string[];
  readonly retryable: boolean;
  readonly details: Record<string, unknown>;
  readonly human_message?: string;
  readonly suggested_action?: string;
  readonly blocking_requirement?: string;

  constructor(opts: {
    code: ExecutionErrorCode;
    message: string;
    entity_id?: string;
    entity_type?: string;
    field?: string;
    current_state?: string;
    requested_state?: string;
    requirement_ids?: string[];
    retryable?: boolean;
    details?: Record<string, unknown>;
    human_message?: string;
    suggested_action?: string;
    blocking_requirement?: string;
  }) {
    super(opts.message);
    this.name = "ExecutionDomainError";
    this.code = opts.code;
    this.entity_id = opts.entity_id;
    this.entity_type = opts.entity_type;
    this.field = opts.field;
    this.current_state = opts.current_state;
    this.requested_state = opts.requested_state;
    this.requirement_ids = opts.requirement_ids ?? [];
    this.retryable = opts.retryable ?? false;
    this.details = opts.details ?? {};
    this.human_message = opts.human_message;
    this.suggested_action = opts.suggested_action;
    this.blocking_requirement = opts.blocking_requirement;
  }

  toValidationError(): ExecutionValidationError {
    return {
      code: this.code,
      message: this.message,
      field: this.field,
      human_message: this.human_message ?? this.message,
      technical_reason: this.message,
      suggested_action: this.suggested_action,
      blocking_requirement: this.blocking_requirement,
      reference_id: this.entity_id,
    };
  }
}

export function isExecutionDomainError(e: unknown): e is ExecutionDomainError {
  return e instanceof ExecutionDomainError;
}
