# Wave 6 Handoff — Knowledge Intelligence & Adaptive Learning

**From:** CAE-11.12-W5 (APIs, Events, Integrations)  
**To:** CAE-11.12-W6 (Knowledge Intelligence & Adaptive Learning)  
**Date:** 2026-07-13

## Stable W5 surfaces

- Versioned API gateway under `/api/v1/knowledge`, `/learning`, `/competencies`, `/certifications`, `/knowledge-ai`
- `knowledge_api_registry.json` — machine-readable route registry
- `knowledge_event_catalog.json` — 24 domain event types
- Permission-aware search index via `integrations/search-projection.ts`
- Outbox publisher + idempotent consumer receipts
- Mission evidence candidates (not auto-competency)
- AI tutor with assessment refusal boundaries
- Public credential verification projection

## W6 builds on

- Event streams from outbox (`knowledge_event_outbox`)
- Learning workspace projection API
- Competency profile read API (no ranking)
- Search explainability hooks
- Analytics counters (derived)
- Webhook delivery queue

## W6 does not rebuild

- Domain engine (W3)
- Canonical model (W2)
- Constitutional doctrine (W1)

## Entry points

- `runKnwW5Certification()` for gate status
- `GET /api/v1/learning/workspace` for learner context
- `searchKnowledge()` + `explainKnowledgeSearchResult()` for retrieval intelligence
