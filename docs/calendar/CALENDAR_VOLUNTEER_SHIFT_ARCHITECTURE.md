# Volunteer Shift Architecture — CAL-P2 Wave 2A

## Modules

| Path | Purpose |
|------|---------|
| `src/lib/calendar/staffing/types.ts` | Canonical contracts |
| `src/lib/calendar/staffing/requirements.ts` | Staffing requirements CRUD |
| `src/lib/calendar/staffing/shifts.ts` | Shift builder + quick generation |
| `src/lib/calendar/staffing/coverage.ts` | Gap math and event summary |
| `src/lib/calendar/staffing/training-catalog.ts` | Training requirements |
| `src/lib/calendar/staffing/role-catalog.ts` | Role definitions |
| `src/lib/calendar/staffing/template-integration.ts` | Template → requirements |
| `src/lib/calendar/staffing/readiness-integration.ts` | Wave 1A staffing dimension |

## Identity

- `requirementId` — what the event needs
- `shiftId` — time-bound work period
- `interestId` — non-authoritative volunteer interest
- `confirmationId` — soft-beta only until Wave 2B

## Soft-beta rule

Interest ≠ confirmation. Suggested ≠ confirmed. Invited lead ≠ accepted lead.
