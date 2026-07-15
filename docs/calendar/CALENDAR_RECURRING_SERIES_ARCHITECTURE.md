# Recurring Series Architecture — CAL-P2 Wave 1B

## Purpose

Recurring series let organizers create one series identity with **separate canonical event occurrences**. Each occurrence has its own `event_id`, staffing placeholders, approvals, attendance, and reports.

## Location

| Layer | Path |
|-------|------|
| Types | `src/lib/calendar/recurrence/types.ts` |
| Rules | `src/lib/calendar/recurrence/rules.ts` |
| Generator | `src/lib/calendar/recurrence/generate.ts` |
| Exceptions | `src/lib/calendar/recurrence/exceptions.ts` |
| Series store | `src/lib/calendar/series/store.ts` |
| Series create | `src/lib/calendar/series/create.ts` |

## Identity model

```
series_id          — shared series identity
event_id           — unique per occurrence
occurrence_key     — deterministic date/time key
series_sequence_number
generated_from_series
series_rule_version
```

## Supported patterns

- Every day / every N days
- Every week / every N weeks on selected weekdays
- Monthly on a date
- Monthly on first/second/third/fourth/last weekday
- End after N occurrences or on a date
- Preview capped at 12 occurrences or 90 days

## Exceptions

Types: `cancel`, `reschedule`, `override`. Every exception is auditable with reason and actor.

## Edit scopes (soft-beta)

- **This occurrence** — exception only
- **This and following** — `splitSeriesAtOccurrence` forks future series
- **Entire series** — defaults update; completed occurrences are not rewritten

## Routes

- `/calendar/series` — list
- `/calendar/series/:seriesId` — detail
- `/calendar/series/:seriesId/instances` — occurrence table / mobile cards
- `/calendar/series/:seriesId/exceptions` — exception log
- `/command/events/series` — command view

## Gate A honesty

While Gate A is open, series and generated occurrences are **session-local soft-beta** records — not durable production scheduling.

## Validation

```bash
npm run calendar:recurrence:validate
npm run test:calendar:recurrence
npm run test:calendar:series
npm run test:calendar:series-exceptions
```
