# Build 11.12 — Wave 7: Knowledge Evolution & Institutional Wisdom

**Protocol ID:** CAE-11.12-W7 · **Subsystem:** KNW-OPT-001 · **Maps from:** CAE-11.5-W7

## Mission

Transform intelligence findings and Human observations into governed improvement cycles. Wave 7 governs what the Institution does with W6 findings — without permitting autonomous self-rewriting.

## Governing Principle

> The Institution may learn continuously, but institutional truth changes only through governed Human authority.

## Architecture

```text
W6 Intelligence → Improvement Candidates → Human Review → Pilot → W3 Domain Commands → Outcomes → Institutional Wisdom
```

## API Surface

- `GET /api/v1/improvements`
- `POST /api/v1/improvements/candidates`
- `POST /api/v1/improvements/{id}/triage`
- `POST /api/v1/improvements/{id}/implement`
- `POST /api/v1/improvements/{id}/outcomes`
- `GET /api/v1/improvements/pilots`
- `POST /api/v1/improvements/pilots/{id}/start|stop`
- `GET /api/v1/knowledge-stewardship/work-queue`
- `GET /api/v1/institutional-learning/maturity|health|executive-brief|improvement-portfolio`
- `GET /api/v1/optimization/knowledge`
- `POST /api/v1/ai/knowledge/optimize`

## Validate

```bash
npm run phase11:11.12:w7:all
```
