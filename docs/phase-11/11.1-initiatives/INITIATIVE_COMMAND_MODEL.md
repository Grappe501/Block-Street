# Initiative Command Model

**Build:** 11.1 · **Wave:** W3 · **Subsystem:** INI-SVC-001

## Command Envelope

Every mutation carries: `command_id`, `command_type`, `actor_human_id`, `institution_id`, `active_membership_id`, optional `initiative_id`, optional `expected_version`, `request_id`, `correlation_id`, optional `idempotency_key`, optional `reason`, and `payload`.

TypeScript: `InitiativeCommandEnvelope` in `services/commands.ts`.

## Command Result

`InitiativeCommandResult` returns `success`, `initiative_id`, status transition, `version`, `events`, `warnings`, `next_required_actions`, and `validation_errors`.

## Implemented Commands

| Command | Handler |
|---------|---------|
| `CreateInitiativeDraftCommand` | `createDraft` |
| `UpdateInitiativeDraftCommand` | `updateDraft` |
| `SubmitInitiativeForReviewCommand` | `submitForReview` |
| `ApproveInitiativeCommand` | `approve` |
| `ReturnInitiativeForRevisionCommand` | `returnForRevision` |
| `StartPreparationCommand` | `transition → preparation` |
| `ActivateInitiativeCommand` | `activate` |
| `PauseInitiativeCommand` | `transition → paused` |
| `ResumeInitiativeCommand` | `transition → active` |
| `MarkInitiativeAtRiskCommand` | `transition → at_risk` |
| `ClearInitiativeRiskCommand` | `transition → active` |
| `RequestScopeChangeCommand` | `requestScopeChange` |
| `ApproveScopeChangeCommand` | `approveScopeChange` |
| `TransferOperationalOwnershipCommand` | `transferOwner` |
| `AddInitiativeDependencyCommand` | `addDependency` |
| `RemoveInitiativeDependencyCommand` | `removeDependency` |
| `RequestInitiativeCancellationCommand` | `requestCancellation` |
| `ApproveInitiativeCancellationCommand` | `approveCancellation` |
| `BeginInitiativeCloseoutCommand` | `beginCloseout` |
| `CompleteInitiativeCommand` | `complete` |
| `ArchiveInitiativeCommand` | `archive` |
| `CreateSuccessorInitiativeCommand` | `createSuccessor` |
| `RestoreInitiativeCommand` | `restore` |

## Idempotency

High-impact commands accept `idempotency_key`. Repeated identical requests return the cached result; payload mismatch returns `INITIATIVE_IDEMPOTENCY_CONFLICT`.

## Concurrency

`expected_version_optional` triggers `INITIATIVE_VERSION_CONFLICT` when the persisted version differs.
