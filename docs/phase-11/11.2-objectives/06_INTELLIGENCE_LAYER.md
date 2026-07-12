# Build 11.2 — Wave 6: Intelligence Layer

**Protocol ID:** CAE-11.2-W6 · **Subsystem:** OBJ-INT-001 · **Version:** 0.8.6-obj-w6

## Mission

Transform the Objective Execution Engine into an advisory intelligence system that observes progress, predicts risks, and recommends actions — without mutating execution.

## Architecture

```text
Execution Engine (W3) → Projections (W5) → Intelligence Engine (W6) → Recommendations / Briefs / Copilot
```

## API Surface

- `GET /api/v1/intelligence/objectives/recommendations`
- `GET /api/v1/intelligence/objectives/progress`
- `GET /api/v1/intelligence/objectives/risks`
- `GET /api/v1/intelligence/objectives/capacity`
- `GET /api/v1/intelligence/objectives/forecast`
- `GET /api/v1/intelligence/objectives/executive`
- `GET /api/v1/objectives/{id}/intelligence`
- `POST /api/v1/ai/objectives/query|explain|recommend`

## Validate

```bash
npm run phase11:11.2:w6:all
```
