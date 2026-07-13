# Knowledge Command Standard

**Protocol:** CAE-11.12-W3

## Envelope

Every command uses `KnowledgeCommandEnvelope` with: `command_id`, `command_type`, `actor_human_id`, `institution_id`, `active_membership_id`, `request_id`, `correlation_id`, optional `idempotency_key`, `expected_version_optional`, and typed `payload`.

## Catalog

42 commands registered in `data/phase-11/knowledge_command_catalog.json` and `commands.ts` (`ALL_KNOWLEDGE_COMMAND_TYPES`).

## Permissions

Each command maps to a `knowledge.*` permission in `KNOWLEDGE_PERMISSIONS`. Default gate: `civic_action.manage`.

## Idempotency

When `idempotency_key` is set, identical payload returns cached `KnowledgeCommandResult`. Mismatched payload raises `KNOWLEDGE_IDEMPOTENCY_CONFLICT`.

## AI commands

`CreateAIKnowledgeSuggestion` requires Human actor with `request_source: ai_suggestion` and `service_identity_id` in payload. AI identities cannot dispatch mutations directly.
