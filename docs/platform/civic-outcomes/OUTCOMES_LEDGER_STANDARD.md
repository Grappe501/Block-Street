# Outcomes Ledger Standard

**System ID:** OUT-001

## OutcomeRecord

Every outcome begins with a documented baseline.

| Field | Description |
|-------|-------------|
| outcome_type | output, outcome, or impact |
| indicator | Configurable metric name |
| baseline | Starting value |
| current_value | Latest measurement |
| target_value | Program goal |
| confidence_level | low, moderate, high, very_high |
| attribution_level | correlation through direct_attribution |

API: `GET/POST /api/v1/civic-outcomes/outcomes`
