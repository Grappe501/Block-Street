# Implementation Protocol Architecture

**Effective from:** Build 11.2  
**Applies through:** Phase 20

## Waves become protocols

Beginning with Build 11.2, each build wave is an **implementation protocol** — an engineering specification Burt (Cursor) can execute, not merely a design document.

Build 11.1 used "waves." Build 11.2+ uses **protocols** with the same eight-layer sequence:

```text
1. Objective Protocol          (constitution & execution model)
2. Canonical Model Protocol    (data architecture)
3. Domain Services Protocol    (lifecycle engine)
4. Human Experience Protocol   (UI & workflows)
5. API Protocol                (events & integrations)
6. Intelligence Protocol       (analytics & recommendations)
7. Optimization Protocol       (continuous improvement)
8. Production Protocol         (readiness & launch)
```

## Protocol ID format

```text
CAE-{build}-{protocol}
Example: CAE-11.2-W2 = Objective Canonical Data Model Protocol
```

## Protocol rules

| Rule | Meaning |
|------|---------|
| Documentation + contracts | W1–W2 deliver docs and JSON/TS contracts |
| Domain enforcement | W3+ deliver services that enforce contracts |
| No layer skipping | Each protocol builds on the prior |
| Single canonical model | One approved model per build; all layers derive from it |
| Humans govern | Protocols document authority; services enforce it |

## Build 11.2 protocols

| Protocol | Name | Status |
|----------|------|--------|
| CAE-11.2-W1 | Objective Protocol | Complete |
| CAE-11.2-W2 | Canonical Model Protocol | Complete |
| CAE-11.2-W3 | Domain Services Protocol | Complete |
| CAE-11.2-W4 | Human Experience Protocol | Complete |
| CAE-11.2-W5 | API Protocol | Complete |
| CAE-11.2-W6 | Intelligence Protocol | Planned |
| CAE-11.2-W7 | Optimization Protocol | Planned |
| CAE-11.2-W8 | Production Protocol | Planned |

## Relationship to Build 11.1

INI-001 (Build 11.1) governs Initiatives. OBJ-001 (Build 11.2) governs execution beneath Initiatives. Protocol numbering aligns across builds for traceability.
