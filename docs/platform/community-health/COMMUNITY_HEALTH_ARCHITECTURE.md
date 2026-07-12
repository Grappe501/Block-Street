# Community Health Architecture

**System ID:** CHD-001 · Build 10.4

## Stack

```
People → Relationships → Organizations → Leadership → Participation
  → Community Capacity → Community Health → Community Resilience
```

## Integration

Pulls signals from:
- **CIV-001** — participation events and scores
- **LDR-001** — leadership pipeline and mentor capacity
- **REL-001** — relationship density and network resilience

## Components

| Layer | Module |
|-------|--------|
| Health profiles | `CommunityHealthProfile` |
| Capacity | `CommunityCapacityMetrics` |
| Resilience | `ResilienceState` + risk detection |
| Geographic | `GeographicHealthPoint` |
| Reports | `CommunityHealthReport` (aggregated only) |

Engine: `src/lib/community-health/engine.ts`
