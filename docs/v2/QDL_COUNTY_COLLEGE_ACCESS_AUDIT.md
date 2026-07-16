# QDL County and College Access Audit

**Colleges:** 67 · **Counties:** 75 · **Clusters:** 5

## Current reach paths

| Audience | College | County | Command |
|----------|---------|--------|---------|
| Participant | `/schools/[slug]` | `/county/[slug]` | — |
| College leader | `/admin/college-command` | via institution county field | partial |
| County leader | — | `/admin/counties/[slug]/volunteer-command` | yes |
| Campaign | `/admin/volunteer-command` | all counties | yes |

## Missing cross-links

- College campus page → parent county hub (not linked in nav)
- County hub → colleges in county (partial — data exists, nav weak)
- College leader workbench → county volunteer command cross-link
- County leader workbench → college education contribution view
- Campaign leadership unified county+college map

## Data source

Institution `county` field + `geographic-clusters.json`. RedDirt not connected in W1.

See `data/qdl/qdl-w1-county-college-links.json`.
