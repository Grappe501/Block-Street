# Phase 11 Context Index — LocalBrain Context Intelligence (LIX-002)

**Build:** 11.7-lix · **Wave:** W2 · **Protocol:** CAE-11.7-W2  
**Registry:** `data/phase-11/context_registry.json` · **Vocabulary:** `data/phase-11/context_vocabulary.json`

## Core context types

| Type | Authority | Privacy default |
|------|-----------|-----------------|
| Human Context | Human declared | Private LocalBrain |
| Institution Context | Canonical / Human selection | Institution restricted |
| Mission Context | Canonical assignment | Mission restricted |
| Calendar / Meeting Context | System observed | Institution restricted |
| Location / Travel Context | Purpose-limited permission | Private LocalBrain |
| Device Context | System observed | Session scoped |
| Attention Context | System inferred | Private LocalBrain |
| Emergency Context | Institution required | Federation restricted |

## Authority order

1. Canonical institutional fact  
2. Current Human declaration  
3. Verified system observation  
4. Derived system inference  
5. AI suggestion  

## Runtime surfaces

- **Services:** `src/lib/civic-action/builds/11.7/living/context/services/context-intelligence-service.ts`
- **APIs:** `/api/v1/localbrain/context`, `/context/active`, `/context/select`, `/context/confirm`, `/context/correct`
- **Attention:** `/api/v1/localbrain/attention`, `/next-actions`, `/focus-sessions`

## Constitutional invariants

`CAE-11.7-W2-CTX-001` through `CTX-010` — see `context/invariants.ts` and [CONTEXT_CONSTITUTION.md](11.7-living-intelligence/CONTEXT_CONSTITUTION.md).
