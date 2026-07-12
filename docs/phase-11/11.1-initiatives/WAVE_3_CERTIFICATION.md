# Wave 3 Certification

**Wave ID:** CAE-11.1-W3 · **Subsystem:** INI-SVC-001

## Gates

| Gate | Requirement |
|------|-------------|
| G01 | Service architecture documentation present |
| G02 | Domain service modules present |
| G03 | ≥40 W3 requirements registered |
| G04 | Service tests pass (`w3-tests.ts`) |
| G05 | Illegal transitions rejected |
| G06 | Service identity owner rejected |
| G07 | Circular dependency detected |
| G08 | Direct mutation forbidden |
| G09 | Draft creation works |
| G10 | Restore to active denied |

## Validation

```bash
npm run phase11:11.1:w3
npm run phase11:11.1:w3:all
```

Programmatic: `runIniW3Certification()` in `w3.ts`.

API: `GET /api/v1/civic-action/scaffold?build=11.1&wave=w3`

## Acceptance Scenario

Abbreviated flow in `w3-tests.ts` covers draft → review → approve → preparation → blocked activation → archive → restore denial.

## Deferred to Later Waves

- Full UI workflows (W4)
- Public HTTP command API (W5)
- Scheduled transition worker revalidation (W7)
- Institution policy configuration UI (W7)
- Full approval separation-of-duties matrix (W10)

## Status

Certification passes when all gates green and `isIniW3Complete()` returns true.
