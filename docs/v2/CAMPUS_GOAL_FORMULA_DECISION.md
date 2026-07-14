# Campus Goal Formula Decision

**Status:** Locked 2026-07-14 (operator reaffirmation)  
**Active version:** `flat_0.25_of_county_v1`

## Rule

```text
education_institution_registration_sub_goal = ceil(county_voter_registration_goal × 0.25)
education_institution_vci_sub_goal          = ceil(county_vci × 0.25)
```

- Same number for **every** college and high school in that county.
- Contribution model: **sub_goal_within_parent** (does not add on top of the county total).
- County parent totals come from RedDirt Victory Plan artifacts on `H:\SOSWebsite\RedDirt` via read-only ingest into `data/field-goals/county-field-goals.json`.

## Superseded

`enrollment_share_of_county_vap_v1` (enrollment ÷ estimated county VAP) — no longer active for campus civic goals.

## County source honesty

If RedDirt chapter-05 JSON carries `dbWarning` / `allocated_from_lane2_weight`, Burt still treats those artifacts as the official RedDirt file of record until RedDirt’s `CountyCampaignStats` DB path is repaired and re-exported.
