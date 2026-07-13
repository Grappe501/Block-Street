# Knowledge Service Overlap Audit

**Protocol:** CAE-11.12-W3

## Sole mutation path

`KnowledgeDomainService` in `builds/11.12/services/knowledge-engine.ts`. `assertKnowledgeMutationViaService()` blocks direct writes.

## Known bypass paths (must migrate)

| Path | Risk | W3 action |
|------|------|-----------|
| `src/lib/training/` | Legacy training model | Migrate to ADP-001 Course/Competency/Certification |
| Direct `writeStoreSlice` on knowledge keys | Store corruption | Route through repository save/load |
| COM-002 `communication_knowledge` | ID collision | Reference-only bridging per DATA-019 |
| `src/lib/identity-trust/` certifications | Separate trust domain | Document boundary from operational certifications |

## Enforcement

W3 repository module is the only approved persistence layer for `KNOWLEDGE_STORE_KEYS`.
