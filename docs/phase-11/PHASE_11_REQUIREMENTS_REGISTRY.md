# Phase 11 Requirements Registry

**Pattern:** `CAE-[BUILD]-[WAVE]-[DOMAIN]-[NUMBER]`  
**Live registry:** `data/civic-action/requirements_registry.json`

## Wave 11.1-W1 Summary

| Domain | Count | Doc Status | Tech Status |
|--------|-------|------------|-------------|
| CON | 20 | documented | Planned for 11.1-W2–W8 |
| POL | 8 | documented | Planned for 11.1-W7 |
| SEC | 6 | documented | Planned for 11.1-W3, ITL |
| PRV | 5 | documented | Planned for 11.1-W2–W5 |
| ACC | 5 | documented | Planned for 11.1-W4 |
| **Total** | **44** | **documented** | Partial W3 service enforcement |

## Wave 11.1-W3 Summary (INI-SVC-001)

| Domain | Count | Registry Status | Enforcement |
|--------|-------|-----------------|-------------|
| SVC | 6 | implemented | domain-service, policy |
| CHR | 3 | implemented | charter-validator |
| OWN | 6 | implemented | owner-eligibility |
| LIF | 5 | implemented | state-machine, domain-service |
| APR | 4 | implemented | approve, activate |
| SCP | 5 | implemented | scope change handlers |
| DEP | 4 | implemented | dependency-graph |
| CLS | 5 | implemented | closeout, archive, successor |
| REL | 4 | implemented | idempotency, version, outbox |
| **Total** | **42** | **implemented** | `src/lib/civic-action/builds/11.1/services/` |

## Constitutional Requirements (CON)

| ID | Title |
|----|-------|
| CAE-11.1-W1-CON-001 | Governing institution |
| CAE-11.1-W1-CON-002 | Accountable Human owner |
| CAE-11.1-W1-CON-003 | Service identity prohibition |
| CAE-11.1-W1-CON-004 | Approved purpose |
| CAE-11.1-W1-CON-005 | Defined scope |
| CAE-11.1-W1-CON-006 | Bounded authority |
| CAE-11.1-W1-CON-007 | Draft does not grant authority |
| CAE-11.1-W1-CON-008 | Strategic linkage |
| CAE-11.1-W1-CON-009 | Governed lifecycle |
| CAE-11.1-W1-CON-010 | Version history |
| CAE-11.1-W1-CON-011 | Closeout basis |
| CAE-11.1-W1-CON-012 | Review requirement |
| CAE-11.1-W1-CON-013 | Cross-institution boundaries |
| CAE-11.1-W1-CON-014 | Visibility vs authority |
| CAE-11.1-W1-CON-015 | AI boundaries |
| CAE-11.1-W1-CON-016 | Attribution |
| CAE-11.1-W1-CON-017 | Cancellation history |
| CAE-11.1-W1-CON-018 | Emergency expiration |
| CAE-11.1-W1-CON-019 | Owner required state |
| CAE-11.1-W1-CON-020 | History preservation |

## Policy, Security, Privacy, Accessibility

See `data/civic-action/requirements_registry.json` for full text, risk level, enforcement_layer, and planned_test per requirement.

## Traceability

[PHASE_11_TRACEABILITY_MATRIX.md](PHASE_11_TRACEABILITY_MATRIX.md)
