# Wave 2 Certification — CAE-11.7-W2

```bash
npm run phase11:11.7:w2
npm run localbrain:context:validate
```

## Certification gates (G01–G10)

| Gate | Status | Evidence |
|------|--------|----------|
| G01 Context Authority | Pass | 18+ registered types; human override test |
| G02 Institution Isolation | Pass | `institution_isolation` test |
| G03 Context Accuracy | Pass | conflict detection, correction, stale expiry |
| G04 Mission Traceability | Pass | `mission_context_traceability`, work resume |
| G05 Time & Meeting | Pass | calendar context, no unauthorized recording |
| G06 Location Privacy | Pass | permission required; no continuous tracking |
| G07 Attention Integrity | Pass | explainable priorities; focus interruption rules |
| G08 Next-Action Safety | Pass | nonauthoritative; dismissible |
| G09 Privacy & Retention | Pass | privacy control center; inference pause |
| G10 Human Experience | Partial | APIs complete; UI components deferred to W3+ |

**Tests:** 28/28 (`w2-tests.ts`)

## Wave 3 handoff (CAE-11.7-W3)

Wave 3 builds the **AI Executive Assistant, Briefing & Decision Preparation Runtime** on:

- Active-context contracts (`active_context`, context stack, institution switch)
- Mission/objective context and next-action contracts
- Meeting lifecycle context (before/during/after; no silent recording)
- Attention priorities and focus-session interruption policy
- Privacy restrictions and Human-declared preferences
- LocalBrain memory interfaces (W1) and preparation boundaries (`mutates_canonical: false`)
- Evidence and explainability requirements from attention and next-action services
