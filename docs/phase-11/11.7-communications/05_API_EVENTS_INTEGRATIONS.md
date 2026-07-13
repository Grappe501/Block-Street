# Build 11.7 — Wave 5: APIs, Events, and Integrations

**Protocol ID:** CAE-11.7-W5  
**Subsystem:** COM-API-001  
**Status:** Implemented (v0.9.2-com-w5)

## Mission

Expose the Communications Domain Engine through stable, versioned, institution-aware interfaces. All writes invoke Wave 3 commands; no generic lifecycle CRUD.

## Canonical API Prefix

```text
/api/v1/communications
```

Legacy W4 path `/api/v1/civic-action/communications/commands` remains as a compatibility shim.

## Architecture

```text
Client → withApiGateway → withCommunicationApi → query/command service
→ W3 CommunicationsDomainService → outbox → integrations (search, notifications, calendar, analytics, webhooks, mission, knowledge)
```

## Implemented Surfaces

### Queries
- `GET /api/v1/communications` — conversation collection (institution-filtered, cursor pagination)
- `GET /api/v1/communications/{id}` — conversation detail
- `GET /api/v1/communications/messages`
- `GET /api/v1/communications/meetings`
- `GET /api/v1/communications/decisions`
- `GET /api/v1/communications/documents`
- `GET /api/v1/communications/search` — semantic search projection

### Commands
- `POST /api/v1/communications` — create Conversation
- `POST /api/v1/communications/commands` — typed W3 commands
- `POST /api/v1/communications/{id}/actions/{action}?initiative_id=` — lifecycle actions
- `POST /api/v1/communications/messages|meetings|decisions|documents`

### AI (read-only)
- `POST /api/v1/communications/ai/summarize` — read-only summary; no mutations

### Interoperability
- `GET|POST /api/v1/communications/webhooks` — institution-scoped subscriptions
- `GET /api/v1/communications/events/outbox` — admin pending outbox

## Code Layout

```text
src/lib/civic-action/builds/11.7/api/          — context, queries, commands, errors
src/lib/civic-action/builds/11.7/events/       — catalog, outbox, replay, receipts
src/lib/civic-action/builds/11.7/integrations/ — search, notifications, calendar, analytics, webhooks, mission, knowledge
data/phase-11/communication_event_catalog.json — versioned event registry
```

## Certification

Run `npm run phase11:11.7:w5:all` to validate documentation, requirements, and constitution tests.
