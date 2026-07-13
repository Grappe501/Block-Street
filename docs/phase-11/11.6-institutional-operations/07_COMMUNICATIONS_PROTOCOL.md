# CAE-11.6-W7 — Communications & Institutional Conversation Protocol

**Protocol ID:** `CAE-11.6-W7`  
**System:** OPS-001

## Constitutional Principle

> Conversations are institutional assets. Messages are not disposable. Communication always serves Missions.

## API Namespace

| Endpoint | Purpose |
|----------|---------|
| `GET/POST /api/v1/conversations` | Institutional conversations |
| `GET /api/v1/conversations/{id}` | Conversation detail |
| `GET/POST /api/v1/messages` | Thread messages |
| `GET/POST /api/v1/announcements` | Announcements |
| `GET/POST /api/v1/meetings` | Meeting workspaces |
| `POST /api/v1/broadcasts` | Multi-channel broadcasts |
| `POST /api/v1/ai/summarize` | AI conversation summary |

Legacy 11.7 communications remain at `/api/v1/communications/*`.

## Integration

Integrates with W1–W6: missions, workforce, organization, resources, calendar, and knowledge.
