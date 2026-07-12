# Build 11.2 — Wave 5: APIs, Events, and Integrations

**Protocol ID:** CAE-11.2-W5  
**Subsystem:** OBJ-API-001  
**Status:** Implemented (v0.8.5-obj-w5)

## Mission

Expose the Objective Execution Engine through stable, versioned, institution-aware interfaces. All writes invoke Wave 3 commands; no generic lifecycle CRUD.

## Canonical API Prefix

```text
/api/v1/objectives
```

Legacy W4 path `/api/v1/civic-action/objectives/commands` remains as a compatibility shim.

## Architecture

```text
Client → withApiGateway → withObjectiveApi → query/command service
→ W3 ExecutionDomainService → outbox → integrations (search, notifications, calendar, analytics, webhooks)
```

## Implemented Surfaces

### Queries
- `GET /api/v1/objectives` — collection (institution-filtered, cursor pagination)
- `GET /api/v1/objectives/portfolio?initiative_id=`
- `GET /api/v1/objectives/{id}`
- `GET /api/v1/objectives/{id}/dashboard?initiative_id=`
- `GET /api/v1/objectives/{id}/progress?initiative_id=`
- `GET /api/v1/objectives/{id}/permissions?initiative_id=`
- `GET /api/v1/objectives/{id}/workstreams?initiative_id=`
- `GET /api/v1/objectives/{id}/missions?initiative_id=`
- `GET /api/v1/objectives/{id}/today?initiative_id=`
- `GET /api/v1/search/objectives`
- `GET /api/v1/analytics/objectives`
- `GET /api/v1/timeline/objectives`

### Commands
- `POST /api/v1/objectives` — create Objective
- `POST /api/v1/objectives/commands` — typed W3 commands
- `POST /api/v1/objectives/{id}/actions/{action}?initiative_id=` — lifecycle actions

### AI (read-only)
- `POST /api/v1/ai/objectives/query` — summarize/explain projections; no mutations

### Interoperability
- `GET|POST /api/v1/objectives/webhooks` — institution-scoped subscriptions

## Code Layout

```text
src/lib/civic-action/builds/11.2/api/          — context, queries, commands, errors
src/lib/civic-action/builds/11.2/events/       — catalog, outbox, replay, receipts
src/lib/civic-action/builds/11.2/integrations/ — search, notifications, calendar, analytics, webhooks
data/phase-11/objective_event_catalog.json     — versioned event registry
```

## Validation

```bash
npm run phase11:11.2:w5:all
```
