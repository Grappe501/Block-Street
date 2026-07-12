# Wave 8 Certification — CAE-11.1-W8

**Subsystem:** INI-PRD-001  
**Version:** 0.8.0-ini-w8

## Gates

| Gate | Requirement |
|------|-------------|
| G01 | Production documentation |
| G02 | Production modules and manifest |
| G03 | Configuration validation |
| G04 | Certification suite W1–W7 |
| G05 | Launch control center |
| G06 | Production certification levels (4) |
| G07 | Operator training modules |
| G08 | Continuous verification schedules |
| G09 | Executive sign-off records |
| G10 | Health check API |
| G11 | Build 11.1 complete documentation |
| G12 | Full wave suite passed |

## Run certification

```bash
npm run phase11:11.1:w8:all
```

Programmatic: `runIniW8Certification()` and `runBuild111Certification()` from `src/lib/civic-action/builds/11.1/w8.ts`.

## Build 11.1 completion

When all 8 waves pass: `isBuild111Complete() === true`.

See `BUILD_11.1_COMPLETE.md`.
