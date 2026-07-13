# Build 11.12 — Wave 5: APIs, Events, and Integrations

**Protocol ID:** CAE-11.12-W5 (blob label CAE-11.5-W5)  
**Subsystem:** KNW-API-001  
**Status:** Implemented

## Mission

Expose the Knowledge Domain Engine through stable, versioned, institution-aware interfaces. All writes invoke Wave 3 `KnowledgeDomainService` commands; no generic lifecycle CRUD.

## Canonical API Prefixes

```text
/api/v1/knowledge
/api/v1/learning
/api/v1/competencies
/api/v1/certifications
/api/v1/knowledge-ai
/api/public/v1/credentials
```

## Architecture

```text
Client → withApiGateway → withKnowledgeApi → query/command service
→ W3 KnowledgeDomainService → outbox → integrations (search, notifications, calendar, mission, webhooks)
```

## Implemented Surfaces

### Knowledge
- `GET|POST /api/v1/knowledge`
- `GET /api/v1/knowledge/{id}`
- `POST /api/v1/knowledge/{id}/actions/{action}`
- `POST /api/v1/knowledge/commands`
- `GET /api/v1/knowledge/search`
- `POST /api/v1/knowledge/events/outbox`
- `GET|POST /api/v1/knowledge/webhooks`

### Learning
- `GET /api/v1/learning/courses`
- `GET /api/v1/learning/workspace`
- `POST /api/v1/learning/commands`

### Competency & Certification
- `GET /api/v1/competencies/my-profile`
- `GET /api/v1/certifications/eligibility`
- `POST /api/v1/certifications/commands`
- `GET /api/public/v1/credentials/verify/{code}`

### AI Tutor (read-only)
- `POST /api/v1/knowledge-ai/tutor/turns`

## Code Layout

```text
src/lib/civic-action/builds/11.12/api/
src/lib/civic-action/builds/11.12/events/
src/lib/civic-action/builds/11.12/integrations/
data/phase-11/knowledge_event_catalog.json
data/phase-11/knowledge_api_registry.json
```

## Validation

```bash
npm run phase11:11.12:w5:all
```
