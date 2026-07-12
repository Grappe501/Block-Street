# Initiative Charter Validation

**Build:** 11.1 · **Wave:** W3

Stage-specific validation in `services/charter-validator.ts`.

## Levels

| Level | Used when |
|-------|-----------|
| `draft` | Creation, draft edits |
| `review_submission` | Submit for review |
| `approval` | Approve command |
| `activation` | Activate command |
| `scope_change` | Material scope requests |
| `closeout` | Completion |

## Activation Gates (MVP)

- Approved charter version
- Eligible owners
- Class 4+ backup owner
- `next_review_date` scheduled
- Status must be `preparation` or `approved`
- No blocking dependencies
- No `owner_required` exception

## Result Shape

`InitiativeCharterValidation` — `is_valid`, `errors`, `warnings`, `missing_fields`.
