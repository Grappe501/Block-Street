/**
 * CAE-11.7-W3 — Communication domain errors
 */
import type { CommunicationValidationError } from "./commands";

export type CommunicationErrorCode =
  | "COMMUNICATION_NOT_FOUND"
  | "COMMUNICATION_INSTITUTION_MISMATCH"
  | "COMMUNICATION_PERMISSION_DENIED"
  | "COMMUNICATION_TRANSITION_NOT_ALLOWED"
  | "COMMUNICATION_PARENT_CONSTRAINT"
  | "COMMUNICATION_CHILD_CONSTRAINT"
  | "COMMUNICATION_VERSION_CONFLICT"
  | "COMMUNICATION_ARCHIVED_READ_ONLY"
  | "COMMUNICATION_ORPHAN_PROHIBITED"
  | "COMMUNICATION_INITIATIVE_INACTIVE"
  | "COMMUNICATION_IDEMPOTENCY_CONFLICT"
  | "COMMUNICATION_DIRECT_MUTATION_FORBIDDEN"
  | "COMMUNICATION_SERVICE_IDENTITY_FORBIDDEN"
  | "COMMUNICATION_AI_IMPERSONATION_FORBIDDEN"
  | "COMMUNICATION_MODERATION_BLOCKED"
  | "COMMUNICATION_VISIBILITY_DENIED"
  | "COMMUNICATION_INVITATION_REQUIRED"
  | "COMMUNICATION_VALIDATION_FAILED";

export class CommunicationDomainError extends Error {
  readonly code: CommunicationErrorCode;
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
    code: CommunicationErrorCode;
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
    this.name = "CommunicationDomainError";
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

  toValidationError(): CommunicationValidationError {
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

export function isCommunicationDomainError(e: unknown): e is CommunicationDomainError {
  return e instanceof CommunicationDomainError;
}
