# Build 11.1 — Wave 6: Initiative Intelligence Layer

**Wave ID:** CAE-11.1-W6  
**Subsystem:** INI-INT-001  
**Version:** 0.7.4-ini-w6

## Mission

Transform the Initiative system from passive records into an **advisory operating intelligence layer** that surfaces patterns, risks, duplicates, and recommendations — while Humans retain every consequential decision.

## Doctrine

> Based on everything we know, what should Humans probably look at next?

- Explainable · Evidence-backed · Confidence-labeled · Dismissible · Permission-scoped

## Services

| Service | Module |
|---------|--------|
| Institution graph | `intelligence/institution-graph.ts` |
| Initiative graph | `intelligence/initiative-graph.ts` |
| Recommendations | `intelligence/recommendation-engine.ts` |
| Duplicate detection | `intelligence/duplicate-detection.ts` |
| Risk intelligence | `intelligence/risk-intelligence.ts` |
| Capacity | `intelligence/capacity-intelligence.ts` |
| Portfolio | `intelligence/portfolio-intelligence.ts` |
| Executive brief | `intelligence/executive-brief.ts` |
| Copilot | `intelligence/copilot.ts` |
| Feedback | `intelligence/feedback-store.ts` |

## APIs

```text
GET  /api/v1/intelligence/recommendations
GET  /api/v1/intelligence/portfolio
GET  /api/v1/intelligence/risks
GET  /api/v1/intelligence/capacity
GET  /api/v1/intelligence/timeline
GET  /api/v1/intelligence/briefing
POST /api/v1/intelligence/feedback
POST /api/v1/ai/query
GET  /api/v1/initiatives/duplicates/candidates
GET  /api/v1/initiatives/{id}/intelligence
```

## UI

- `/initiatives/{id}/intelligence` — advisory panel
- Portfolio executive brief card on `/initiatives`
- `RecommendationCard`, `ConfidenceBadge`, `ExecutiveBriefCard`

## AI Prohibitions

The copilot and all intelligence services **may not**: approve, assign ownership, spend money, activate, close, invite, delete, or override governance.

## Validation

```bash
npm run phase11:11.1:w6:all
```

## Deferred

- Full LLM integration (copilot uses keyword router today)
- Resource/grant intelligence (stubs reserved for Build 11.6)
- Real-time event-driven recompute workers
- Graph visualization UI (data available via API)
