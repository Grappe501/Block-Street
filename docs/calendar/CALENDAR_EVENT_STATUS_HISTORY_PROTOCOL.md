# Event Status History Protocol — CAL-P2 Wave 4A

## Entry shape

Each history entry records:

- `category` — operational, approval, publication, or note
- `fromStatus` / `toStatus` — when applicable
- `actor`, `role`, `note`, `recordedAt`
- `softBeta: true`, `durableAuthority: false` while Gate A open

## Seed order

1. Import `event.history` notes
2. Import `event.approval_history` decisions
3. Snapshot current `operational_status`

## Display

- Event `/lifecycle/history` — full timeline
- Event `/history` — same merged timeline (legacy route preserved)
- Command `/command/events/lifecycle/transitions` — recent cross-event entries

## Honesty

Status history does **not** imply Postgres durability or enforced RBAC while Gate A remains open.
