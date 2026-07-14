# RedDirt Field Goal Source Audit

**Ingested:** 2026-07-14T09:22:21.719Z  
**Counties complete:** 75 / 75  
**Registration source:** `docs/strategic-plan/plurality-victory-plan/part-ii-electoral-math/chapter-05-fifty-thousand-new-voter-plan/statewide-registration-summary.json`  
**VCI source:** `docs/strategic-plan/plurality-victory-plan/command-center/victory-contribution-index.json`

## Definitions

- **Voter registration goal** — RedDirt chapter-05 `goals[].goal` (Victory Plan allocation; current built artifacts use Lane-2-weighted 50k allocation when DB SoT unavailable).
- **VCI** — **Victory Contribution Index** (not Vote Civic Involvement):  
  `VCI = Lane 2 @ 50% + Registration Goal + GOP Conversion @ 12% + City Influence (Top 75 vote targets in county)`

## Clark County sample

| Field | Value |
|-------|------:|
| Registration goal | 291 |
| VCI | 2543 |
| Institution 25% sub-goal | 73 |

## Conflicts / caveats

- Chapter-05 includes dbWarning: DB CountyCampaignStats unavailable at build time; artifacts used Lane-2-weighted allocation.

- Block-Street must consume the checked-in snapshot only — no runtime dependency on `H:\SOSWebsite\RedDirt`.
- Machine twin: `data/v2/reddirt-field-goal-source-audit.json`
