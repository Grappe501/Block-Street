# Phase 11 Executive Assistant Index — LIX-003

**Build:** 11.7-lix · **Wave:** W3 · **Protocol:** CAE-11.7-W3  
**Registry:** `data/phase-11/executive_capability_registry.json` · **Vocabulary:** `data/phase-11/executive_vocabulary.json`

## Capability classes

Observe · Retrieve · Summarize · Compare · Prepare · Draft · Recommend · Track · Remind · Escalate for Human Attention

## Prohibited actions

Approve · Reject · Publish · Send · Assign · Spend · Contract · Vote · Certify · Change Governance

## Runtime surfaces

- **Services:** `src/lib/civic-action/builds/11.7/living/executive-assistant/services/executive-assistant-service.ts`
- **APIs:** `/api/v1/localbrain/executive-assistant`, `/briefings`, `/decisions`, `/commitments`, `/drafts`, `/executive-inquiry`

## Wave dependencies

- **W1:** LocalBrain memory (private boundary)
- **W2:** Active context, attention, institution isolation
- **W3:** Briefings, decisions, commitments, drafting (prepare-only)

## Constitutional invariants

`CAE-11.7-W3-EA-001` through `EA-010` — see `executive-assistant/invariants.ts`
