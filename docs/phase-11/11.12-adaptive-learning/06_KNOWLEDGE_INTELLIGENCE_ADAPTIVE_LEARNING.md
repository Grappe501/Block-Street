# Build 11.12 — Wave 6: Knowledge Intelligence & Adaptive Learning

**Protocol ID:** CAE-11.12-W6 · **Subsystem:** KNW-INT-001 · **Maps from:** CAE-11.5-W6

## Mission

Transform the governed Knowledge and Learning Engine into an intelligent institutional advisor that observes, retrieves, analyzes, explains, recommends, and teaches — without becoming a source of canonical truth.

## Architecture

```text
W3 Domain Engine → W5 Projections & Events → W6 Intelligence Orchestrator → Advisory Outputs
```

## Governing Principle

> Intelligence may influence Human attention, but it may not replace Human authority.

## API Surface

- `POST /api/v1/intelligence/knowledge/query`
- `POST /api/v1/intelligence/knowledge/related`
- `POST /api/v1/intelligence/knowledge/impact`
- `GET /api/v1/intelligence/knowledge/health`
- `GET /api/v1/intelligence/knowledge/gaps`
- `GET /api/v1/intelligence/learning/recommendations`
- `POST /api/v1/intelligence/learning/next-step`
- `GET /api/v1/intelligence/capability/coverage`
- `POST /api/v1/intelligence/capability/role-readiness`
- `GET /api/v1/intelligence/certification/readiness`
- `POST /api/v1/intelligence/research/synthesize`
- `POST /api/v1/intelligence/memory/query`
- `POST /api/v1/intelligence/tutor/turns`
- `POST /api/v1/ai/knowledge/query`

## Validate

```bash
npm run phase11:11.12:w6:all
```
