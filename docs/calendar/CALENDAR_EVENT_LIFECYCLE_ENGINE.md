# Event Lifecycle Engine — CAL-P2 Wave 4A

## Purpose

Operational status transitions, calendar approval workflow checklist, and audited status history for canonical events.

## Location

| Layer | Path |
|-------|------|
| Types | `src/lib/calendar/lifecycle/types.ts` |
| Transitions | `src/lib/calendar/lifecycle/transitions.ts` |
| History | `src/lib/calendar/lifecycle/history.ts` |
| Items | `src/lib/calendar/lifecycle/items.ts` |
| Integration | `src/lib/calendar/lifecycle/template-integration.ts` |
| Readiness | `src/lib/calendar/lifecycle/readiness-integration.ts` |

## Categories

- **approval** — submit, scope review, calendar decision, revision resolution
- **operational** — schedule lock, confirmation, post-event completion
- **publication** — public visibility readiness

## Status history

Seeds from `event.history` and `event.approval_history`, then appends session-local entries. Separate from readiness dimension engines.

## Gate A honesty

While Gate A is open, lifecycle transitions remain **session-local soft-beta** — not durable production scheduling authority.

## Validation

`npm run calendar:lifecycle:validate` · `npm run test:calendar:wave4a`
