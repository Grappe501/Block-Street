# Protocol 7 Certification — Build 11.7 Communications Optimization

**Wave:** 11.7-W7 · **Subsystem:** COM-OPT-001

## Gates

| Gate | Requirement |
|------|-------------|
| G01 | Optimization documentation present |
| G02 | Optimization modules and API routes |
| G03 | Advisory-only constitution (8+ prohibited actions) |
| G04 | Explainable optimizations |
| G05 | Advisor blocks approve/send |
| G06 | Feedback rejection learns |
| G07 | Simulation non-mutating |
| G08 | Lessons engine runs |

## Certification

```bash
npm run phase11:11.7:w7:all
```

Entry point: `src/lib/civic-action/builds/11.7/w7.ts`
