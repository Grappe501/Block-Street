# CAE-11.6-W6 — Universal Calendar & Time Intelligence Protocol

**Protocol ID:** `CAE-11.6-W6`  
**System:** OPS-001

## Constitutional Principle

> Time belongs to the Institution, not to individual modules. There is one canonical Time Engine that every module uses.

## API Namespace

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/calendar` | Canonical institutional calendar |
| `GET/POST /api/v1/calendar/events` | List and create events |
| `GET /api/v1/calendar/agenda` | Personal agenda projection |
| `GET /api/v1/calendar/timeline` | Historical timeline |
| `GET /api/v1/calendar/conflicts` | Conflict detection |
| `GET /api/v1/calendar/availability` | Human availability |
| `POST /api/v1/calendar/reservations` | Resource reservations |
| `POST /api/v1/calendar/sync` | External calendar sync |
| `POST /api/v1/calendar/travel` | Travel calculation |

## Design

All views (mission, personal, resource, executive) are projections of one canonical calendar. External systems synchronize as projections; the platform calendar remains authoritative.

## Integration

Integrates with W1–W5: missions, workforce availability, organization meetings, resource reservations, and maintenance schedules.
