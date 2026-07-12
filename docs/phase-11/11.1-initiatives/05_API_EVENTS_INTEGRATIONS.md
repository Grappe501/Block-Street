# Build 11.1 — Wave 5: APIs, Events, and Integrations

**Wave ID:** CAE-11.1-W5  
**Subsystem:** INI-API-001  
**Status:** Implemented (v0.7.3-ini-w5)

## Mission

Expose the governed Initiative domain through stable, versioned, institution-aware interfaces. All writes invoke Wave 3 commands; no generic lifecycle CRUD.

## Canonical API Prefix

```text
/api/v1/initiatives
```

Legacy W4 paths under `/api/v1/civic-action/initiatives` remain as compatibility shims where noted.

## Architecture

```text
Interface Request → Authentication → Institution Context → Authorization
→ Typed Command/Query → W3 Domain Service → Persistence → Outbox Event
→ Read Models & Integrations
```

## Implemented Surfaces

### Queries
- `GET /api/v1/initiatives` — collection (institution-filtered, cursor pagination)
- `GET /api/v1/initiatives/portfolio`
- `GET /api/v1/initiatives/{id}`
- `GET /api/v1/initiatives/{id}/permissions`
- `GET /api/v1/initiatives/{id}/readiness`
- `GET /api/v1/initiatives/{id}/charter`
- `GET /api/v1/initiatives/{id}/history`
- `GET /api/v1/initiatives/{id}/health`
- `GET /api/v1/initiatives/{id}/dependencies`
- `GET /api/v1/search/initiatives`

### Commands
- `POST /api/v1/initiatives` — create draft
- `PATCH /api/v1/initiatives/{id}/draft`
- `POST /api/v1/initiatives/commands` — typed W3 commands
- `POST /api/v1/initiatives/{id}/actions/{action}` — explicit lifecycle actions

### Interoperability
- `POST /api/v1/initiatives/import` — preview (no fabricated authority)
- `POST /api/v1/initiatives/export` — purpose-bound manifest
- `GET|POST /api/v1/initiatives/webhooks` — institution-scoped subscriptions

## Code Layout

```text
src/lib/civic-action/builds/11.1/api/          — context, queries, commands, errors
src/lib/civic-action/builds/11.1/events/       — catalog, outbox, replay, receipts
src/lib/civic-action/builds/11.1/integrations/ — search, notifications, calendar, analytics, webhooks
data/phase-11/initiative_event_catalog.json    — versioned event registry
```

## Validation

```bash
npm run phase11:11.1:w5
npm run phase11:11.1:w5:all
```

## Deferred to Later Waves

- Full OpenAPI generation
- Production Postgres outbox (currently canonical store slices)
- Step-up authentication enforcement at gateway
- Live notification delivery (queue stub only)
- CMS public page binding UI
- Charter draft PATCH subresource endpoints
- Ownership proposal REST subresources (use W3 commands for now)

## Related Docs

- [INITIATIVE_API_CONSTITUTION.md](./INITIATIVE_API_CONSTITUTION.md)
- [INITIATIVE_EVENT_CATALOG.md](./INITIATIVE_EVENT_CATALOG.md)
- [WAVE_5_CERTIFICATION.md](./WAVE_5_CERTIFICATION.md)
- [WAVE_6_INTELLIGENCE_HANDOFF.md](./WAVE_6_INTELLIGENCE_HANDOFF.md)
