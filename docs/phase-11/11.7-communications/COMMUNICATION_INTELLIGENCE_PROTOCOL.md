# Communication Intelligence Protocol

**Protocol ID:** CAE-11.7-W6 · **Subsystem:** COM-INT-001

## Constitution

1. Intelligence is **advisory only** — never authoritative for communication mutations.
2. Every recommendation includes **why**, **evidence**, **confidence**, and **uncertainty notes**.
3. Humans may **dismiss** recommendations without domain mutation.
4. Analysis respects **institution boundaries** and permission scope.
5. AI copilot blocks **approve**, **send**, **decide**, and governance override intents.

## Modules

- `recommendation-engine.ts` — explainable, dismissible recommendations
- `communication-health.ts` — response time, decision latency, meeting efficiency
- `relationship-discovery.ts` — knowledge graph (no people scoring)
- `copilot.ts` — read-only query router
