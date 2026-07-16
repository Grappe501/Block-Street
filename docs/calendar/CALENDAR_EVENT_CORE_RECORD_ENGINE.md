# Event Core Record Engine — CAL-P2 Wave 4B

## Purpose

Ownership, schedule, and venue checklist for canonical event records — replaces Wave 1A inline readiness evaluators.

## Location

| Layer | Path |
|-------|------|
| Types | `src/lib/calendar/core-record/types.ts` |
| Items | `src/lib/calendar/core-record/items.ts` |
| Integration | `src/lib/calendar/core-record/template-integration.ts` |
| Readiness | `src/lib/calendar/core-record/readiness-integration.ts` |

## Categories

- **ownership** — operational owner, contact path, Event Board oversight
- **schedule** — start/end, duration validity, timezone offset
- **venue** — physical location, virtual link, TBD resolution

## Readiness dimensions replaced

- `ownership` → `evaluateOwnershipReadiness`
- `date_time` → `evaluateDateTimeReadiness`
- `venue` → `evaluateVenueReadiness`

## Gate A honesty

Canonical fields remain seed-backed; checklist mutations are session-local soft-beta.

## Validation

`npm run calendar:core-record:validate` · `npm run test:calendar:wave4b`
