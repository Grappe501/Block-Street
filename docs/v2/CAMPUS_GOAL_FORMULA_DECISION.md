# Campus Goal Formula Decision

**Status:** Locked V2-A.3 · 2026-07-14  
**Active version:** `enrollment_share_of_county_vap_v1`

## Current formula (canonical)

```text
campus_share = campus_enrollment ÷ county_voting_age_population

campus_registration_goal = ceil(county_registration_goal × campus_share)
campus_vci_goal          = ceil(county_vci_goal × campus_share)
```

- Contribution model: **sub_goal_within_parent** (does not add on top of the county total).
- County parent totals: RedDirt Victory Plan → `data/field-goals/county-field-goals.json`.
- Rounding: `Math.ceil` (documented, consistent).
- Launch-team / confirmed participants remain separate metrics.

## Superseded

```text
Math.ceil(county_voter_registration_goal × 0.25)
```

Flat 25% (same for every school in a county) is **not active**. Preserved in lineage and registries as superseded only.

## County VAP limitation

Source: `data/registry/county-demographics.json`  
Method: estimated (~76% of county population) until verified ACS figures load.  
**UI must not label estimated VAP as official ACS data.**

## Henderson State (Clark) sample

| Input | Value |
|--------|------:|
| Enrollment | 3,190 |
| Clark County VAP (est.) | 16,299 |
| Share | ~19.57% |
| Registration sub-goal | **57** |
| VCI sub-goal | **498** |
| Launch-team goal | 6 (separate) |

## Related

- `src/lib/field-goals/campus-goals.ts`
- `docs/v2/REDDIRT_FIELD_GOAL_SOURCE_AUDIT.md`
