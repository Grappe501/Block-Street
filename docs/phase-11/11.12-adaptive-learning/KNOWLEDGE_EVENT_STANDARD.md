# Knowledge Event Standard

**Protocol:** CAE-11.12-W2

Catalog: `data/phase-11/knowledge_event_catalog.json`

## Event namespaces

| Prefix | Examples |
|--------|----------|
| `knowledge.*` | artifact_created, claim_validated, version_created |
| `learning.*` | course_published, enrollment_created, completion_recorded |
| `competency.*` | defined, demonstrated, verified |
| `certification.*` | awarded, expired, revoked |
| `ai.*` | suggestion_generated, tutor_session_started, suggestion_rejected |

## Rules

- Events are append-only
- Every mutation emits versioned domain event (W3 enforcement)
- AI events never emit `certification.awarded`
