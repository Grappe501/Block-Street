# Protocol 3 Certification — Knowledge Domain Services

**Protocol ID:** CAE-11.12-W3 · **Build:** 11.12 · **Subsystem:** ADP-001

## Certification command

```bash
npm run phase11:11.12:w3:all
```

## Gates (10)

| Gate | Check |
|------|-------|
| G01 | W3 documentation spine (13 docs) |
| G02 | Domain service modules |
| G03 | 50+ domain services registered |
| G04 | 42+ W3 requirements `implemented` |
| G05 | Service tests pass |
| G06 | Illegal transitions rejected |
| G07 | Direct mutation forbidden |
| G08 | Create artifact starts draft |
| G09 | Publish approval gate |
| G10 | 40+ typed commands |

## Runtime

`runKnwW3Certification()` in `w3.ts` returns gate results and `test_results`.
