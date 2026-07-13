/**
 * CAE-11.12-W3 — Knowledge domain errors (ADP-001)
 */
import type { KnowledgeValidationError } from "./commands";

export type KnowledgeErrorCode =
  | "KNOWLEDGE_NOT_FOUND"
  | "KNOWLEDGE_INSTITUTION_MISMATCH"
  | "KNOWLEDGE_PERMISSION_DENIED"
  | "KNOWLEDGE_TRANSITION_NOT_ALLOWED"
  | "KNOWLEDGE_PARENT_CONSTRAINT"
  | "KNOWLEDGE_CHILD_CONSTRAINT"
  | "KNOWLEDGE_VERSION_CONFLICT"
  | "KNOWLEDGE_ARCHIVED_READ_ONLY"
  | "KNOWLEDGE_ORPHAN_PROHIBITED"
  | "KNOWLEDGE_PUBLICATION_BLOCKED"
  | "KNOWLEDGE_EVIDENCE_REQUIRED"
  | "KNOWLEDGE_APPROVAL_REQUIRED"
  | "KNOWLEDGE_IMMUTABLE_PUBLISHED"
  | "KNOWLEDGE_IDEMPOTENCY_CONFLICT"
  | "KNOWLEDGE_DIRECT_MUTATION_FORBIDDEN"
  | "KNOWLEDGE_SERVICE_IDENTITY_FORBIDDEN"
  | "KNOWLEDGE_AI_PUBLISH_FORBIDDEN"
  | "KNOWLEDGE_AI_CERTIFY_FORBIDDEN"
  | "AI_SUGGESTION_REQUIRES_HUMAN_REVIEW"
  | "CERTIFICATION_REQUIREMENTS_UNMET"
  | "COMPETENCY_NOT_AUTO_FROM_COMPLETION"
  | "TRANSLATION_STALE_SOURCE"
  | "KNOWLEDGE_VALIDATION_FAILED";

export class KnowledgeDomainError extends Error {
  readonly code: KnowledgeErrorCode;
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
    code: KnowledgeErrorCode;
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
    this.name = "KnowledgeDomainError";
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

  toValidationError(): KnowledgeValidationError {
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

export function isKnowledgeDomainError(e: unknown): e is KnowledgeDomainError {
  return e instanceof KnowledgeDomainError;
}
