# Calendar Event RSVP Engine

Soft-beta RSVP planning and response tracking for events that require attendance estimates.

## Checklist categories

| Category | Purpose |
|----------|---------|
| plan | Capacity target and RSVP collection open |
| operations | Check-in plan and day-of list |

## Template seed

`ensureRsvpFromEvent` seeds checklist items when template `rsvpMode` is required, recommended, or optional.

## Authority

All RSVP records carry `softBeta: true` and `durableAuthority: false` while Gate A is open.
