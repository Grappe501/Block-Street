# Wave 3 Test Plan

**Protocol:** CAE-11.12-W3

## Test suite

`w3-tests.ts` — `runKnwW3ServiceTests()` (18+ assertions)

## Required scenarios

1. Illegal artifact transition rejected (`draft→published`)
2. Direct mutation forbidden (`assertKnowledgeMutationViaService`)
3. Create artifact starts `draft`
4. Publish without approval blocked
5. Version conflict on stale `expected_version`
6. Course completion binds `bound_course_version`
7. Competency not auto from course completion
8. Certification blocked without requirements
9. AI suggestion cannot become canonical without review
10. Translation staleness on source version change
11. Events emitted on publish
12. Idempotency works
13. Service identity rejected

## Invocation

```bash
npm run phase11:11.12:w3:all
```
