# Communication Security Standard

**Requirements:** CAE-11.7-W5-API-003, API-009, API-017

## Authentication

Mutations require authenticated actor via API gateway. Anonymous access limited to read paths with default experience context in development.

## Authorization

Every mutation reauthorizes against `COMMUNICATION_PERMISSIONS` on the server regardless of prior UI permission hints.

## Untrusted Fields

Clients may not set: `actor_human_id`, `institution_id`, `lifecycle_state`, `owner_human_id`, `author_human_id`, `created_by`, `last_modified_by`.

## Service Identity

AI summary generation requires explicit `service_identity_id`; AI cannot impersonate humans (`COMMUNICATION_AI_IMPERSONATION_FORBIDDEN`).

## Webhook Security

Signed payloads with timestamp validation prevent replay attacks.
