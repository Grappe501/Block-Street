# Relationship Intelligence Architecture

**System ID:** REL-001 · Build 10.3

## Layers

1. **Canonical Graph** — `RelationshipNode` and `RelationshipEdge` entities
2. **Relationship Ledger** — `RelationshipEvent` records every verified interaction
3. **Strength Engine** — explainable factors (frequency, duration, collaboration, projects, mentoring, participation)
4. **Analytics** — connectors, isolation, resilience, collaboration metrics
5. **Privacy Gate** — individual and institutional visibility controls
6. **Advisory AI** — recommendations and insights without hidden scoring

## Data Flow

```
Participation / Leadership / Missions
        ↓
RelationshipEvent (ledger)
        ↓
Edge strength recalculation
        ↓
Graph + Dashboards + Federation aggregates
```

## Implementation

- Engine: `src/lib/community-relationship/engine.ts`
- Store: `data/community-relationship/store.json`
- API: `/api/v1/community-relationship/*`

Builds on Phase 7 RLI-001 campaign relationship intelligence and Phase 10 CIV-001 / LDR-001.
