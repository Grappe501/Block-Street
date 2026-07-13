# CAE-11.6-W9 — Workflow Automation & Orchestration Protocol

**Protocol ID:** `CAE-11.6-W9`  
**System:** OPS-001

## Constitutional Principle

> Automation may execute policy, but it may never replace accountable Human judgment.

## API Namespace

| Endpoint | Purpose |
|----------|---------|
| `GET/POST /api/v1/workflows` | List and create workflows |
| `GET /api/v1/workflows/{id}` | Workflow detail |
| `GET /api/v1/workflows/running` | Running executions |
| `POST /api/v1/workflows/{id}/publish` | Publish workflow |
| `POST /api/v1/workflows/{id}/execute` | Execute workflow |
| `POST /api/v1/workflows/{id}/pause` | Pause workflow |
| `POST /api/v1/workflows/{id}/resume` | Resume workflow |
| `POST /api/v1/workflows/{id}/rollback` | Rollback execution |

## Integration

Integrates with W1–W8: every subsystem may publish events into the Automation Engine and consume workflow outputs.
