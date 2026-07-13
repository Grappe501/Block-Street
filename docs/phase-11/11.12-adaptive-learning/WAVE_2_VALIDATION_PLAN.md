# Wave 2 Validation Plan

**Build:** 11.12 · **Wave:** W2 · **Protocol:** CAE-11.12-W2

## Automated tests

`src/lib/civic-action/builds/11.12/w2-tests.ts`

| Test | Validates |
|------|-----------|
| entity_registry | 50+ canonical entities |
| store_keys | 40+ store partitions |
| state_machines | Five lifecycle machines |
| claim_requires_evidence_status | Validated claims need evidence |
| version_immutability_rules | Immutable version stores |
| course_completion_binds_version | Completion version binding |
| certification_requires_requirements | Award requires requirements_met |
| ai_content_labeled | AI content origin labeling |
| no_orphan_citation | Citation parent chain |
| traceability_chain | LearningObject upward chain |
| protocol_w2_gates | All 12 certification gates |

## Scripts

```bash
npm run phase11:11.12:w2      # structural validation
npm run phase11:11.12:w2:all  # typecheck + structural + tests
```

## Manual review checklist

- [ ] KNOWLEDGE_OVERLAP_AUDIT.md reviewed against COM-002 entities
- [ ] DATA-001 through DATA-008 invariants documented
- [ ] No competing canonical IDs with communication_knowledge

## W3 readiness

W2 delivers model only. W3 implements repositories, services, and runtime enforcement.
