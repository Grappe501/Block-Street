# V2-A — Operator Command

**Status:** First slice live — default `/admin` tab  
**Audience:** Operator (primary) · Architect (secondary read)  
**Why first:** Forensic audit — weakness is operational coherence, not raw capability count.

## Outcome

One place where an operator understands:

- what exists (Feature Discovery)
- what is healthy / incomplete (Certification Registry + Launch doctrine)
- what needs attention
- what should happen next

## Non-goals (this slice)

- Replacing all Director tabs
- Postgres cutover (V2-B)
- Participant UX redesign

## Surface

- Route: `/admin` default tab **Command**
- Component: `AdminOperatorCommand`
- Data: `product-certification-registry.json`, `feature-discovery-registry.json`, `launch-readiness.json`, `build-progress.json` (read-only summary)

## Next

Wire invite-chain evidence results into this Command attention queue when `V1-JRN-INVITE-CHAIN-01` runs.
