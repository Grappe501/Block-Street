# Objective Event Catalog

**Version:** 11.2-w5.1 · **Source:** `data/phase-11/objective_event_catalog.json`

| Event | Consumers |
|-------|-----------|
| execution.objective_created | search, analytics, audit |
| execution.objective_proposed | notifications, calendar, audit |
| execution.objective_approved | notifications, audit |
| execution.objective_activated | search, notifications, calendar, analytics |
| execution.objective_archived | search, audit |
| execution.mission_created | search, notifications |
| execution.mission_assigned | notifications |
| execution.mission_started | notifications, calendar |
| execution.mission_completed | notifications, analytics, webhooks |
| execution.task_created | search |
| execution.task_assigned | notifications |
| execution.task_completed | notifications, analytics |
| execution.evidence_attached | audit |
| execution.outcome_recorded | analytics, audit |

All W3 producer event types must appear in the catalog (gate G04).
