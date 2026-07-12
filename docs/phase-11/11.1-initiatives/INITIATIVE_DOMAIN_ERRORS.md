# Initiative Domain Errors

**Build:** 11.1 · **Wave:** W3

`InitiativeDomainError` in `services/errors.ts`.

## Canonical Codes

`INITIATIVE_NOT_FOUND`, `INITIATIVE_INSTITUTION_MISMATCH`, `INITIATIVE_PERMISSION_DENIED`, `INITIATIVE_OWNER_REQUIRED`, `INITIATIVE_OWNER_INELIGIBLE`, `INITIATIVE_CHARTER_INCOMPLETE`, `INITIATIVE_APPROVAL_MISSING`, `INITIATIVE_TRANSITION_NOT_ALLOWED`, `INITIATIVE_BLOCKING_DEPENDENCY`, `INITIATIVE_CIRCULAR_DEPENDENCY`, `INITIATIVE_VERSION_CONFLICT`, `INITIATIVE_SCOPE_CHANGE_REQUIRES_REVIEW`, `INITIATIVE_ARCHIVED_READ_ONLY`, `INITIATIVE_IDEMPOTENCY_CONFLICT`, and related codes.

## Structure

Each error includes `code`, `message`, optional `initiative_id`, `current_state`, `requested_state`, `requirement_ids`, `retryable`, `details`, `correlation_id`.

## API Surface

`InitiativeDomainService.execute()` catches domain errors and returns structured `validation_errors` in `InitiativeCommandResult`.
