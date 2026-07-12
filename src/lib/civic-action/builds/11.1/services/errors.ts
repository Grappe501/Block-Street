/**
 * CAE-11.1-W3 — Initiative domain errors
 */
import type { CanonicalInitiativeStatus } from "../data-model";

export type InitiativeErrorCode =
  | "INITIATIVE_NOT_FOUND"
  | "INITIATIVE_INSTITUTION_MISMATCH"
  | "INITIATIVE_PERMISSION_DENIED"
  | "INITIATIVE_OWNER_REQUIRED"
  | "INITIATIVE_OWNER_INELIGIBLE"
  | "INITIATIVE_CHARTER_INCOMPLETE"
  | "INITIATIVE_APPROVAL_MISSING"
  | "INITIATIVE_TRANSITION_NOT_ALLOWED"
  | "INITIATIVE_BLOCKING_DEPENDENCY"
  | "INITIATIVE_CIRCULAR_DEPENDENCY"
  | "INITIATIVE_VERSION_CONFLICT"
  | "INITIATIVE_SCOPE_CHANGE_REQUIRES_REVIEW"
  | "INITIATIVE_ARCHIVED_READ_ONLY"
  | "INITIATIVE_RESTORATION_REQUIRED"
  | "INITIATIVE_SAFETY_GATE_MISSING"
  | "INITIATIVE_PRIVACY_GATE_MISSING"
  | "INITIATIVE_IDEMPOTENCY_CONFLICT"
  | "INITIATIVE_DIRECT_MUTATION_FORBIDDEN"
  | "INITIATIVE_SERVICE_IDENTITY_FORBIDDEN";

export class InitiativeDomainError extends Error {
  readonly code: InitiativeErrorCode;
  readonly initiative_id?: string;
  readonly field?: string;
  readonly current_state?: CanonicalInitiativeStatus;
  readonly requested_state?: CanonicalInitiativeStatus;
  readonly requirement_ids: string[];
  readonly retryable: boolean;
  readonly details: Record<string, unknown>;
  readonly correlation_id?: string;

  constructor(opts: {
    code: InitiativeErrorCode;
    message: string;
    initiative_id?: string;
    field?: string;
    current_state?: CanonicalInitiativeStatus;
    requested_state?: CanonicalInitiativeStatus;
    requirement_ids?: string[];
    retryable?: boolean;
    details?: Record<string, unknown>;
    correlation_id?: string;
  }) {
    super(opts.message);
    this.name = "InitiativeDomainError";
    this.code = opts.code;
    this.initiative_id = opts.initiative_id;
    this.field = opts.field;
    this.current_state = opts.current_state;
    this.requested_state = opts.requested_state;
    this.requirement_ids = opts.requirement_ids ?? [];
    this.retryable = opts.retryable ?? false;
    this.details = opts.details ?? {};
    this.correlation_id = opts.correlation_id;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      initiative_id: this.initiative_id,
      field: this.field,
      current_state: this.current_state,
      requested_state: this.requested_state,
      requirement_ids: this.requirement_ids,
      retryable: this.retryable,
      details: this.details,
      correlation_id: this.correlation_id,
    };
  }
}

export function isInitiativeDomainError(e: unknown): e is InitiativeDomainError {
  return e instanceof InitiativeDomainError;
}
