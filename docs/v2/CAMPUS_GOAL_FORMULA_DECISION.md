# Campus Goal Formula Decision (V2-A.3)

**Decision date:** 2026-07-14  
**Status:** Canonical  
**Machine twin:** `data/v2/campus-goal-formula-decision.json`

## Supersession

The flat **25%** institution sub-goal rule (`Math.ceil(county_goal × 0.25)`) is **superseded**.

Prior feature id `FEAT-EDU-SUBGOAL-25` remains in the registry as historical lineage with certification `superseded`.

## Current formula

```text
campus_share = campus_enrollment ÷ county_voting_age_population

campus_registration_goal = Math.ceil(county_registration_goal × campus_share)

campus_vci_goal = Math.ceil(county_vci_goal × campus_share)
```

- Rounding: `Math.ceil` everywhere.
- Contribution model: `sub_goal_within_parent` — campus goals do not inflate county totals.
- Launch-team goal remains a separate metric.

## County VAP

Source: `data/registry/county-demographics.json`

County voting-age population is **estimated** (76% of total population) until verified ACS figures are loaded.

**Do not** label estimated VAP as official ACS data.

## Sources

| Input | Source |
|-------|--------|
| County registration / VCI | RedDirt → `data/field-goals/county-field-goals.json` |
| County VAP | `data/registry/county-demographics.json` (estimate) |
| Campus enrollment | Institution registry |

Formula version id: `enrollment_share_of_county_vap_v1`
