# Build 11.7 — Wave 6: Intelligence Layer

**Protocol ID:** CAE-11.7-W6 · **Subsystem:** COM-INT-001 · **Version:** 0.9.3-com-w6

## Mission

Transform the Communication Execution Engine into an advisory intelligence system that observes collaboration health, discovers relationships, and recommends actions — without mutating communication state.

## Architecture

```text
Domain Services (W3) → Projections (W5) → Intelligence Engine (W6) → Recommendations / Briefs / Copilot
```

## API Surface

- `GET /api/v1/intelligence/communications/recommendations`
- `GET /api/v1/intelligence/communications/health`
- `GET /api/v1/intelligence/communications/executive`
- `GET /api/v1/intelligence/communications/knowledge`
- `GET /api/v1/intelligence/communications/relationships`
- `POST /api/v1/ai/communications/query|explain`

## Validate

```bash
npm run phase11:11.7:w6:all
```
