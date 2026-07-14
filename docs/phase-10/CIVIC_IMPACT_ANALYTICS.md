# Civic Impact Analytics

**System ID:** CIA-001 · Build 10.8 · AC-201

Combined impact, resilience, and social capital analytics that answer:  
*Are communities becoming stronger because institutions are operating?*

## Guiding Principle

> Impact is multi-dimensional. Single vanity metrics are forbidden.

## Capabilities

- Composite Civic Impact Index (participation × outcomes × health × relationships)
- Resilience score (from Community Health engine)
- Social capital score (network density + mentorship + collaboration trust)
- Geographic impact heat summaries (permission-aware aggregates)
- Longitudinal trend packs for executive reporting
- Explainable score cards — each dimension cites source engine evidence
- Federation benchmarks — approved aggregates only
- Closeout feed into Phase 10 certification

## Architectural Locks

| Lock | Rule |
|------|------|
| Multi-dimension only | No single-number gamification |
| Source engines remain canonical | CIA composes — does not duplicate |
| Human-readable explanations | Every score has a reason string |
| Advisory dashboards | Analytics inform; Humans decide |

**Engine:** `src/lib/civic-impact-analytics/` · **Registry:** `data/registry/civic-impact-analytics.json`  
**Admin:** Phase 10 Civic Growth tab · `AdminCivicImpactAnalytics`

**Acceptance:** AC-201 · Phase 10 closeout criterion
