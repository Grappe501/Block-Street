# Campus Civic Goals — Enrollment Share of County VAP

**Canonical (V2-A.3):** See `CAMPUS_GOAL_FORMULA_DECISION.md`.

```text
share = campus_enrollment ÷ county_voting_age_population
campus_registration_goal = Math.ceil(county_registration_goal × share)
campus_vci_goal = Math.ceil(county_vci_goal × share)
```

**VCI** = Victory Contribution Index (RedDirt).

County VAP is **estimated** in `data/registry/county-demographics.json` until ACS loads.

Flat 25% institution sub-goal is **superseded**.

Launch-team goal remains separate.
