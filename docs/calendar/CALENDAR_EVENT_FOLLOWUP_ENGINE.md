# Calendar Event Follow-up Engine

Soft-beta runtime for post-event metrics, outcome capture, and follow-up actions.

## Categories

| Category | Purpose | Blocks readiness |
|----------|---------|------------------|
| metric | Template `reportFields` (counts, text, boolean) | required fields |
| action | Follow-up actions (outcome summary, team debrief) | required actions |

## Template seed

`ensureFollowUpFromEvent` seeds metrics from template `reportFields` and follow-up actions when `follow_up` is a template readiness dimension.

Report due window: **48 hours** after event end.

## Authority

All items carry `softBeta: true` and `durableAuthority: false` while Gate A is open.
