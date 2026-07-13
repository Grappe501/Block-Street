# CAE-11.6-W8 — Executive Command Center Protocol

**Protocol ID:** `CAE-11.6-W8`  
**System:** OPS-001

## Constitutional Principle

> Leadership should spend time making decisions—not collecting information.

## API Namespace

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/executive/dashboard` | Unified executive command center |
| `GET /api/v1/executive/briefing` | List executive briefings |
| `POST /api/v1/executive/briefing/generate` | Generate morning/evening/on-demand briefing |
| `GET /api/v1/executive/alerts` | Priority executive alerts |
| `GET /api/v1/executive/decisions` | Decision queue |
| `POST /api/v1/executive/approve` | Approve pending decision |
| `GET /api/v1/executive/health` | Institution operational health |
| `GET/POST /api/v1/executive/scenarios` | Scenario planning |
| `POST /api/v1/executive/warroom` | Open executive war room |

## Integration

Aggregates W1–W7: strategy, missions, workforce, organization, resources, calendar, and communications into one evidence-driven executive workspace.
