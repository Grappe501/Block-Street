# Build 11.1 — Cursor Handoff

## Wave Completed

**CAE-11.1-W3** — Initiative Core Services, Business Rules, and Lifecycle Engine (INI-SVC-001)

---

## Next Wave

**11.1-W4 — Initiative Human Workflows and User Interface**

Build on W3 service commands (do not duplicate business logic in UI):

### Available service commands

`CreateInitiativeDraftCommand`, `UpdateInitiativeDraftCommand`, `SubmitInitiativeForReviewCommand`, `ApproveInitiativeCommand`, `ActivateInitiativeCommand`, `PauseInitiativeCommand`, `ResumeInitiativeCommand`, `TransferOperationalOwnershipCommand`, `RequestScopeChangeCommand`, `CompleteInitiativeCommand`, `ArchiveInitiativeCommand`, `CreateSuccessorInitiativeCommand`, `RestoreInitiativeCommand`

### Read models needed (W4)

- Initiative portfolio list
- Initiative detail aggregate
- Charter workbench (draft/review/approval views)
- Lifecycle controls and readiness panel
- Ownership panel with eligibility status
- History timeline

### UI states

Empty, loading, blocked (validation errors from `InitiativeCommandResult`), permission denied, owner_required, archived read-only.

### Requirements

- Conversational Spanish path for critical workflows
- Mobile reflow and keyboard/screen-reader charter forms
- States must not rely on color alone

---

## W3 Deliverables

### Documentation
- `03_SERVICE_ARCHITECTURE.md` + 16 specialized service docs
- `WAVE_3_CERTIFICATION.md`, `WAVE_3_TEST_PLAN.md`

### TypeScript
- `services/` — domain engine, policy, charter, ownership, dependencies, repository, events
- `w3.ts`, `w3-tests.ts`

### Requirements
- 42 W3 requirements (`SVC`, `CHR`, `OWN`, `LIF`, `APR`, `SCP`, `DEP`, `CLS`, `REL`), status **implemented**

---

## Validation

```bash
npm run phase11:11.1:w3
npm run phase11:11.1:w3:all
npm run phase11:gate
npm run typecheck
```

API: `GET /api/v1/civic-action/scaffold?build=11.1&wave=w3`

---

## Legacy Note

MVP `store.json` migrates to canonical keys via `ensureCanonicalInitiativeStore()`. All mutations must use `InitiativeDomainService.execute()`.
