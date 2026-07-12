# Wave 6 Handoff — Initiative Intelligence

**Next wave:** CAE-11.1-W6 — Initiative Intelligence, Recommendations, and Readiness Assistance

## Available for W6

### Events (read-only consumption)
- Full catalog in `data/phase-11/initiative_event_catalog.json`
- Committed facts in `initiative_domain_events` store slice
- Outbox stream for near-real-time features

### Read Models
- `InitiativeView` — role-aware API detail
- `InitiativeOperationalProjection` — analytics slice
- Search index — `initiative_search_index`
- Readiness assembler — `ux/assemble-readiness.ts`
- Health query — deterministic reasons (not opaque scores)

### APIs
- `GET /api/v1/initiatives/{id}/readiness`
- `GET /api/v1/initiatives/{id}/health`
- `GET /api/v1/search/initiatives`

## Advisory-Only Boundaries (W6 must obey)

- No autonomous lifecycle mutation
- No approval, activation, or ownership assignment by AI
- Recommendations require Human review and explicit command invocation
- Duplicate detection is suggestive — never auto-merge or auto-archive
- Charter assistance may draft text but cannot submit for review without Human action

## Permitted Data Features

- Similarity scoring across name, purpose, scope, institution
- Readiness gap analysis from deterministic blockers
- Ownerless-work detection from ownership + status projections
- Risk signal surfacing from `at_risk`, dependencies, overdue reviews

## Prohibited

- Direct Initiative table writes from intelligence layer
- Fabricated confidence presented as authority
- Cross-institution similarity without agreement scope

## Explainability Requirements

Every W6 recommendation must include:
- Triggering signals (event IDs or projection fields)
- Confidence band (not a hidden score)
- Suggested next Human action with link to governed endpoint
- English and Spanish summary strings

## False-Positive Handling

- Humans can dismiss suggestions (logged, non-mutating)
- Dismissals do not change Initiative state
- Repeated false positives feed tuning metadata only

## Starting Point

1. Subscribe intelligence workers to `initiative_domain_events` + search index
2. Build duplicate candidate API as `GET /api/v1/initiatives/duplicates/candidates` (read-only, W6)
3. Extend readiness API with advisory `suggestions[]` field (non-authoritative)
