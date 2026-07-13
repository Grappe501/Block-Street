# Communication AI Interface

**Requirement:** CAE-11.7-W5-API-018

## Read-Only Contract

AI endpoints must not expose mutation capabilities.

## Implemented Endpoint

`POST /api/v1/communications/ai/summarize`

Returns:
- `read_only: true`
- `mutation_allowed: false`
- Conversation summary assembled from existing messages and AI summaries

## Prohibited

- Auto-posting messages
- Impersonating human authors
- Direct lifecycle transitions from AI routes

## Governed AI Writes

`GenerateAISummary` remains a W3 command invoked only through typed command API with explicit `service_identity_id`.
