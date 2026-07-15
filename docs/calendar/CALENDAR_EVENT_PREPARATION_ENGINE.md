# Calendar Event Preparation Engine

Soft-beta runtime checklist for event logistics, materials, promotion, and reminders.

## Categories

| Category | Readiness dimension | Blocks readiness |
|----------|---------------------|------------------|
| logistics | — | optional per item |
| materials | materials | required items |
| promotion | promotion | required items |
| reminder | — | scheduling only |

## Template seed

`ensurePreparationFromEvent` seeds items from template `logistics`, `materials`, `promotion`, and `reminders` arrays on first access.

## Authority

All items carry `softBeta: true` and `durableAuthority: false` while Gate A is open.
