# Phase 11 Traceability Matrix

**Scaffold:** CAE-SCAFFOLD-001  
**Honesty rule:** W1–W2 requirements are **documented** only. W3 service requirements are **implemented** in INI-SVC-001. UI/API enforcement is W4+ unless noted.

## Legend

| Doc Status | Tech Enforcement |
|------------|------------------|
| documented | Specification complete in W1 |
| planned | Scheduled in enforcement_layer column |

## Build 11.1 — Wave 1

| Requirement ID | Domain | Doc Status | Enforcement Layer | Test |
|----------------|--------|------------|-------------------|------|
| CAE-11.1-W1-CON-001 | CON | documented | 11.1-W2 data, W3 service | constitution + boundary |
| CAE-11.1-W1-CON-002 | CON | documented | 11.1-W3 service | ownerless scenario |
| CAE-11.1-W1-CON-003 | CON | documented | 11.1-W3 service | AI ownership scenario |
| CAE-11.1-W1-CON-004 | CON | documented | 11.1-W3 service | shell initiative rejection |
| CAE-11.1-W1-CON-005 | CON | documented | 11.1-W2 charter, W3 service | scope creep scenario |
| CAE-11.1-W1-CON-006 | CON | documented | 11.1-W3 service, SEC | authority laundering rejection |
| CAE-11.1-W1-CON-007 | CON | documented | 11.1-W3 service | draft authority scenario |
| CAE-11.1-W1-CON-008 | CON | documented | 11.1-W2 data, 11.2 objectives | isolated initiative check |
| CAE-11.1-W1-CON-009 | CON | documented | 11.1-W2 lifecycle | lifecycle vocabulary test |
| CAE-11.1-W1-CON-010 | CON | documented | 11.1-W2 history, W5 events | charter versioning |
| CAE-11.1-W1-CON-011 | CON | documented | 11.1-W2 closeout | closeout constitution test |
| CAE-11.1-W1-CON-012 | CON | documented | 11.1-W3 service, W7 ops | zombie initiative detection |
| CAE-11.1-W1-CON-013 | CON | documented | 11.9 coalition, W3 | cross-institution scenario |
| CAE-11.1-W1-CON-014 | CON | documented | 11.1-W3 permissions | visibility boundary test |
| CAE-11.1-W1-CON-015 | CON | documented | 11.1-W3 service, W6 advisory | AI ownership scenario |
| CAE-11.1-W1-CON-016 | CON | documented | shared audit, W5 events | audit reconstruction |
| CAE-11.1-W1-CON-017 | CON | documented | 11.1-W2 closeout | cancellation scenario |
| CAE-11.1-W1-CON-018 | CON | documented | 11.1-W3 service | emergency scenario |
| CAE-11.1-W1-CON-019 | CON | documented | 11.1-W3 service, W7 ops | ownerless scenario |
| CAE-11.1-W1-CON-020 | CON | documented | 11.1-W2 history, W5 events | audit immutability |
| CAE-11.1-W1-POL-001 | POL | documented | 11.1-W7 institution policy | policy configuration |
| CAE-11.1-W1-POL-002 | POL | documented | 11.1-W7 institution policy | governance class matrix |
| CAE-11.1-W1-POL-003 | POL | documented | 11.1-W7 ops | review cadence |
| CAE-11.1-W1-POL-004 | POL | documented | 11.1-W7 institution policy | backup requirement |
| CAE-11.1-W1-POL-005 | POL | documented | 11.1-W7 institution policy | visibility policy |
| CAE-11.1-W1-POL-006 | POL | documented | 11.1-W7 institution policy | emergency policy |
| CAE-11.1-W1-POL-007 | POL | documented | 11.1-W7 institution policy | version approval |
| CAE-11.1-W1-POL-008 | POL | documented | 11.1-W7 institution policy | retention policy |
| CAE-11.1-W1-SEC-001 | SEC | documented | 11.1-W3 service, ITL | identity context test |
| CAE-11.1-W1-SEC-002 | SEC | documented | 11.1-W3 service | unauthorized activation |
| CAE-11.1-W1-SEC-003 | SEC | documented | 11.9 coalition | cross-institution scenario |
| CAE-11.1-W1-SEC-004 | SEC | documented | 11.1-W3 service, audit | ownership transfer audit |
| CAE-11.1-W1-SEC-005 | SEC | documented | 11.1-W3 service | archive immutability |
| CAE-11.1-W1-SEC-006 | SEC | documented | 11.1-W3 service | emergency expiration |
| CAE-11.1-W1-PRV-001 | PRV | documented | 11.1-W2 data | visibility model |
| CAE-11.1-W1-PRV-002 | PRV | documented | 11.1-W4 UI, W5 API | public view redaction |
| CAE-11.1-W1-PRV-003 | PRV | documented | 11.9 coalition | coalition privacy |
| CAE-11.1-W1-PRV-004 | PRV | documented | 11.1-W4 forms | charter field audit |
| CAE-11.1-W1-PRV-005 | PRV | documented | 11.15 safety | safety gate trigger |
| CAE-11.1-W1-ACC-001 | ACC | documented | 11.1-W4 UI | readability review |
| CAE-11.1-W1-ACC-002 | ACC | documented | 11.1-W4 UI | accessibility audit |
| CAE-11.1-W1-ACC-003 | ACC | documented | 11.1-W4 UI | a11y charter form |
| CAE-11.1-W1-ACC-004 | ACC | documented | 11.1-W4 UI | responsive layout |
| CAE-11.1-W1-ACC-005 | ACC | documented | 11.1-W4 i18n | Spanish path test |

## W1 Artifact Traceability

| Artifact | Requirements Covered |
|----------|---------------------|
| 01_CONSTITUTION.md | All CON |
| INITIATIVE_AUTHORITY_MODEL.md | CON-002, CON-006, CON-019, SEC-* |
| INITIATIVE_SCOPE_STANDARD.md | CON-005, CON-007 |
| INITIATIVE_CHARTER_STANDARD.md | CON-004, CON-010, POL-007 |
| INITIATIVE_LIFECYCLE_CONSTITUTION.md | CON-009, CON-012 |
| INITIATIVE_CLOSEOUT_CONSTITUTION.md | CON-011, CON-017 |
| INITIATIVE_AI_BOUNDARIES.md | CON-015 |
| INITIATIVE_PRIVACY_AND_SECURITY.md | CON-013, CON-014, SEC-*, PRV-* |
| INITIATIVE_SPANISH_VOCABULARY.md | ACC-005 |
| initiative_vocabulary.json | Vocabulary tests |
| initiative_types.json | Taxonomy, CON-008 alignment |

**Next update:** 11.1-W3 adds service-layer enforcement.

## Build 11.1 — Wave 2 (DATA)

| Requirement ID | Domain | Doc Status | Enforcement Layer | Test |
|----------------|--------|------------|-------------------|------|
| CAE-11.1-W2-DATA-001 | DATA | documented | 11.1-W3 service | schema contract |
| CAE-11.1-W2-DATA-002 | DATA | documented | 11.1-W3 service | membership constraint |
| CAE-11.1-W2-DATA-003 | DATA | documented | 11.1-W3 service | version integrity |
| CAE-11.1-W2-DATA-004 | DATA | documented | 11.1-W3 service | charter record |
| CAE-11.1-W2-DATA-005 | DATA | documented | 11.1-W3 service | scope record |
| CAE-11.1-W2-DATA-006 | DATA | documented | 11.1-W3 service | timeline record |
| CAE-11.1-W2-DATA-007 | DATA | documented | 11.1-W3 service | membership record |
| CAE-11.1-W2-DATA-008 | DATA | documented | 11.1-W3 state machine | state machine |
| CAE-11.1-W2-DATA-009 | DATA | documented | 11.1-W3 service | transition validation |
| CAE-11.1-W2-DATA-010 | DATA | documented | 11.1-W3 service | audit integrity |
| CAE-11.1-W2-DATA-011 | DATA | documented | 11.1-W3 service | dependency graph |
| CAE-11.1-W2-DATA-012 | DATA | documented | 11.1-W3 service | review record |
| CAE-11.1-W2-DATA-013 | DATA | documented | 11.1-W3 service | closeout record |
| CAE-11.1-W2-DATA-014 | DATA | documented | 11.1-W3 service | id immutability |
| CAE-11.1-W2-DATA-015 | DATA | documented | 11.1-W3 service | retention policy |
| CAE-11.1-W2-DATA-016 | DATA | documented | 11.1-W3 service | activation validation |
| CAE-11.1-W2-DATA-017 | DATA | documented | 11.1-W3, 11.9 | membership boundary |
| CAE-11.1-W2-DATA-018 | DATA | documented | 11.1-W3 service | portfolio index |
| CAE-11.1-W2-DATA-019 | DATA | documented | 11.1-W3 service | version trigger |
| CAE-11.1-W2-DATA-020 | DATA | documented | 11.1-W3 service | ownerless detection |
| CAE-11.1-W2-DATA-021 | DATA | documented | 11.1-W3 migration | legacy projection |
| CAE-11.1-W2-DATA-022 | DATA | documented | 11.1-W3 service | aggregate validation |

W2 technical enforcement: **Planned for 11.1-W3**.

## Build 11.1 — Wave 3 (SVC, CHR, OWN, LIF, APR, SCP, DEP, CLS, REL)

| Requirement ID | Domain | Registry Status | Enforcement | Test |
|----------------|--------|-----------------|-------------|------|
| CAE-11.1-W3-SVC-001 | SVC | implemented | domain-service.ts | direct mutation guard |
| CAE-11.1-W3-SVC-002 | SVC | implemented | policy.ts | authority resolution |
| CAE-11.1-W3-SVC-003 | SVC | implemented | createDraft | create draft |
| CAE-11.1-W3-SVC-004 | SVC | implemented | createDraft | draft authority |
| CAE-11.1-W3-SVC-005 | SVC | implemented | commands.ts | command dispatch |
| CAE-11.1-W3-SVC-006 | SVC | implemented | events.ts | traceable IDs |
| CAE-11.1-W3-CHR-001 | CHR | implemented | charter-validator.ts | validation levels |
| CAE-11.1-W3-CHR-002 | CHR | implemented | charter-validator.ts | activation blocked |
| CAE-11.1-W3-CHR-003 | CHR | implemented | charter-validator.ts | cross-field errors |
| CAE-11.1-W3-OWN-001 | OWN | implemented | owner-eligibility.ts | activation owner |
| CAE-11.1-W3-OWN-002 | OWN | implemented | owner-eligibility.ts | eligibility |
| CAE-11.1-W3-OWN-003 | OWN | implemented | owner-eligibility.ts | acceptance |
| CAE-11.1-W3-OWN-004 | OWN | implemented | owner-eligibility.ts | owner_required |
| CAE-11.1-W3-OWN-005 | OWN | implemented | owner-eligibility.ts | service identity rejected |
| CAE-11.1-W3-OWN-006 | OWN | implemented | transferOwner | transfer history |
| CAE-11.1-W3-LIF-001 | LIF | implemented | state-machine.ts | allowed transitions |
| CAE-11.1-W3-LIF-002 | LIF | implemented | transitionStatus | illegal rejected |
| CAE-11.1-W3-LIF-003 | LIF | implemented | domain-service | scheduled revalidation |
| CAE-11.1-W3-LIF-004 | LIF | implemented | domain-service | distinct end states |
| CAE-11.1-W3-LIF-005 | LIF | implemented | assertNotArchived | archive read-only |
| CAE-11.1-W3-APR-001 | APR | implemented | policy.ts | approval resolution |
| CAE-11.1-W3-APR-002 | APR | implemented | approve | charter version |
| CAE-11.1-W3-APR-003 | APR | implemented | activate | condition blocking |
| CAE-11.1-W3-APR-004 | APR | implemented | activate | transactional activation |
| CAE-11.1-W3-SCP-001 | SCP | implemented | requestScopeChange | scope request |
| CAE-11.1-W3-SCP-002 | SCP | implemented | approveScopeChange | new version |
| CAE-11.1-W3-SCP-003 | SCP | implemented | versioning.ts | immutable versions |
| CAE-11.1-W3-SCP-004 | SCP | implemented | domain-service | institution change |
| CAE-11.1-W3-SCP-005 | SCP | implemented | domain-service | emergency scope |
| CAE-11.1-W3-DEP-001 | DEP | implemented | dependency-graph.ts | blocking deps |
| CAE-11.1-W3-DEP-002 | DEP | implemented | dependency-graph.ts | cycle detection |
| CAE-11.1-W3-DEP-003 | DEP | implemented | dependency-graph.ts | waiver audit |
| CAE-11.1-W3-DEP-004 | DEP | implemented | dependency-graph.ts | no constitutional waiver |
| CAE-11.1-W3-CLS-001 | CLS | implemented | requestCancellation | cancellation |
| CAE-11.1-W3-CLS-002 | CLS | implemented | complete | closeout validation |
| CAE-11.1-W3-CLS-003 | CLS | implemented | complete | completion classification |
| CAE-11.1-W3-CLS-004 | CLS | implemented | archive | archive preservation |
| CAE-11.1-W3-CLS-005 | CLS | implemented | createSuccessor | successor lineage |
| CAE-11.1-W3-REL-001 | REL | implemented | idempotency store | idempotency test |
| CAE-11.1-W3-REL-002 | REL | implemented | assertVersion | version conflict |
| CAE-11.1-W3-REL-003 | REL | implemented | persist + events | transaction |
| CAE-11.1-W3-REL-004 | REL | implemented | event outbox | outbox pattern |

W1/W2 remain **documented** until UI/API layers enforce remaining cross-cutting rules.

**Next update:** 11.1-W4 adds Human workflows and UI on stable service commands.
