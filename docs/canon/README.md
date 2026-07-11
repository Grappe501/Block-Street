# Community Operating System Canon

**Authority:** Community Operating System Constitution → COS Canon → Canonical Knowledge Kernel

This directory holds canonical architecture documentation and the file-layer bootstrap for the **Canonical Knowledge Kernel (CKK)**.

## Layout

```text
docs/canon/
├── README.md
└── CANONICAL_KNOWLEDGE_KERNEL.md   ← COS-CKK-001 master specification

canon/
├── schemas/                        ← JSON schemas for Canon object records
├── validators/                     ← validation rule definitions (MVP)
└── README.md

data/canon/
├── canon_objects.jsonl             ← canonical object registry (bootstrap)
├── canon_relationships.jsonl       ← relationship graph edges
├── canon_requirements.jsonl        ← requirement traceability records
├── canon_validation.json           ← last validation report
├── canon_readiness.json            ← evidence-based readiness metrics
└── canon_graph.json                ← derived graph summary
```

## CLI

```bash
npm run canon:validate
npm run canon:index
npm run canon:orphans
npm run canon:readiness
npm run canon:report
npm run canon:impact -- COS-ARCH-000001
```

## Constitutional Stack

```text
Community Operating System Constitution
                    ↓
                 COS Canon
                    ↓
      Canonical Knowledge Kernel (CKK)
                    ↓
 Architecture · Requirements · Engineering
                    ↓
       Implementation · Testing · Release
```

**Live registry:** `data/registry/canonical-knowledge-kernel.json`  
**Requirement:** `CKK-001` · **Acceptance:** `AC-165`
