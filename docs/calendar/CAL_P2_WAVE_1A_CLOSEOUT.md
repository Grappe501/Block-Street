# CAL-P2 Wave 1A Closeout — Event Operations Dashboard and Readiness Model

**Verdict:** `TESTED` (not CERTIFIED)

## Commit evidence (important)

| Commit | Role |
|--------|------|
| `23cebf1` | **CAL-P2 Wave 1A content commit** — Event Operations implementation |
| `05a6555` | Deploy stamp for Wave 1A content |
| `23778e9` | Repository cleanup only (civic-action store, RBAC audit refresh, college static-params script) — **not Wave 1A** |
| `0112a38` | Current deploy stamp (points at cleanup commit as productionCommit) |

Wave 1A implementation remains on `main` because `23778e9` is a descendant of `23cebf1`, not a replacement.

## Summary

| Field | Value |
|-------|-------|
| Wave 1A content commit | `23cebf1` |
| Wave 1A deploy stamp | `05a6555` |
| Baseline before Wave 1A | `7f96f04` |
| CAL-P1.2 content commit | `7b21870` |
| Gate A | OPEN |
| Persistence mode | `session_soft_beta` |
| RBAC mode | `audit_only` |
| Events evaluated | 8 |
| Readiness dimensions | 12 |
| Attention rules | 17 |
| Final Wave 1A state | TESTED |

## Wave 1A changed files (`23cebf1`)

```
data/calendar/cal-p2-wave1a-status.json
docs/calendar/CAL_P2_WAVE_1A_CLOSEOUT.md
package.json
scripts/phase11/test-calendar-event-operations.mjs
src/app/(site)/county/[slug]/page.tsx
src/app/admin/college-command/page.tsx
src/app/calendar/event/[eventId]/page.tsx
src/app/college/[collegeSlug]/page.tsx
src/app/command/campaign/page.tsx
src/app/command/campus/page.tsx
src/app/command/events/at-risk/page.tsx
src/app/command/events/attention/page.tsx
src/app/command/events/page.tsx
src/app/command/events/readiness/page.tsx
src/app/command/events/reports-due/page.tsx
src/app/command/events/today/page.tsx
src/app/command/events/unowned/page.tsx
src/app/command/events/upcoming/page.tsx
src/app/command/managers/page.tsx
src/app/command/page.tsx
src/components/calendar/CalendarNav.tsx
src/components/calendar/operations/EventOperationsChrome.tsx
src/components/calendar/operations/EventOperationsMatrix.tsx
src/components/calendar/operations/EventOperationsPanel.tsx
src/components/calendar/operations/EventOperationsRow.tsx
src/components/calendar/operations/EventOperationsSummaryCards.tsx
src/components/calendar/operations/EventOperationsWidget.tsx
src/components/calendar/operations/OperationsBadges.tsx
src/lib/calendar/index.ts
src/lib/calendar/operations/attention.ts
src/lib/calendar/operations/index.ts
src/lib/calendar/operations/readiness.ts
src/lib/calendar/operations/summary.ts
src/lib/calendar/operations/types.ts
tests/calendar/attention.test.ts
tests/calendar/event-operations.test.ts
tests/calendar/readiness.test.ts
```

## Delivered

1. **Event Operations Command** at `/command/events`
2. **Filtered routes:** today, upcoming, attention, readiness, at-risk, unowned, reports-due
3. **Operations library:** `src/lib/calendar/operations/`
4. **Dashboard UI:** summary cards, attention queue, readiness matrix (mobile card fallback)
5. **Event detail panel** on `/calendar/event/:eventId`
6. **Scoped widgets** on command, managers, campaign, campus, college-command, college, county surfaces

## Next wave

**CAL-P2 Wave 1B** — Event Template Library, recurring-series contract, voter-registration template, campus networking-event template.
