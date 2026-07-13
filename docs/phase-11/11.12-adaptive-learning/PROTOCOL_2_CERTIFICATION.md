# Protocol 2 Certification — Knowledge Canonical Data Model

**Protocol ID:** CAE-11.12-W2 · **Build:** 11.12 · **Subsystem:** ADP-001

## Gates (12)

| Gate | Name | Enforcement |
|------|------|-------------|
| G01 | Protocol documentation spine | 13 W2 documents |
| G02 | JSON contracts | 5 contract files |
| G03 | Canonical entity registry | 50+ entities |
| G04 | Database tables | 30+ tables |
| G05 | Lifecycle state machines | Artifact, Course, Certification, Competency, Claim |
| G06 | Parent-child constraints | illegal_child_parent rules |
| G07 | W2 requirements documented | 24+ requirements |
| G08 | Store key registry | 40+ keys |
| G09 | Versioning rules | 8+ triggers |
| G10 | Orphan knowledge prohibited | data-validation.ts |
| G11 | Traceability protocol | LearningObject → Institution |
| G12 | Knowledge event catalog | 15+ events |

## Run certification

```bash
npm run phase11:11.12:w2:all
```

Implementation: `src/lib/civic-action/builds/11.12/w2.ts`

Service enforcement planned for W3.
