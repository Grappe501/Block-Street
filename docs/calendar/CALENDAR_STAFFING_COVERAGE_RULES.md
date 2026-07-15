# Staffing Coverage Rules — CAL-P2 Wave 2A

## Gap math

```
minimumGap = max(0, minimumNeeded - confirmedCount)
targetGap = max(0, targetNeeded - confirmedCount)
```

## Counting perspectives

| Metric | Counts toward minimum? |
|--------|------------------------|
| `interestedCount` | No |
| `eligibleInterestCount` | No (pipeline only) |
| `suggestedCount` | No |
| `acceptedLeadCount` | Lead coverage only |
| `confirmedCount` | Yes (soft-beta labeled) |

## Status ladder

`not_planned` → `critical_gap` / `under_minimum` → `minimum_covered` → `target_covered` → `overstaffed`

Canceled shifts are excluded from coverage.
