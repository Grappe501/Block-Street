# Phase 11 Build Number Reconciliation

**Updated:** 2026-07-12  
**Authority:** `data/civic-action/scaffold.json` and `docs/phase-11/PHASE_11_MASTER_SCAFFOLD.md`  
**Purpose:** Map blob-recovery protocol pastes to registered repository build numbers.

## Rule

When a recovery blob uses a different build number than the live scaffold, **the repository scaffold wins** for implementation, requirements IDs (`CAE-{build}-W{n}`), and certification scripts — unless the scaffold is formally renumbered in a dedicated change.

## Blob vs repository (builds 11.3–11.16)

| Build | Repository (authoritative) | System ID | Blob recovery notes |
|-------|---------------------------|-----------|---------------------|
| 11.3 | Mission and Workstream Execution | MSN-002 | Blob matches repo ✓ |
| **11.4** | **Team, Role, and Responsibility Coordination** | **RSP-001** | Blob labeled "Communications" — **wrong build number** |
| 11.5 | Calendar, Timing, and Operational Rhythm | TIM-001 | — |
| 11.6 | Resource, Capacity, and Logistics Management | CAP-001 | — |
| **11.7** | **Communications and Mobilization Operations** | **COM-002** | Blob "Communications" content → **save as 11.7** |
| 11.8 | Field Operations and Geographic Execution | FLD-001 | — |
| 11.9 | Coalition and Cross-Institution Coordination | COL-001 | — |
| 11.10 | Decision, Approval, and Escalation System | DEC-001 | — |
| 11.11 | Live Operations Command Center | OCC-001 | — |
| 11.12 | Adaptive Execution and Continuous Learning | ADP-001 | — |
| 11.13 | Action Evidence and Outcome Attribution | EVD-001 | — |
| 11.14 | Replication, Playbooks, and Execution Templates | PLY-001 | — |
| 11.15 | Operational Safety, Compliance, and Resilience | SAFE-001 | — |
| 11.16 | Phase 11 Certification and Controlled Launch | CAE-CERT-001 | — |

## Communications content mapping

| Blob label | Correct repo location |
|------------|----------------------|
| Phase 11.4 Communications overview | `docs/phase-11/11.7-communications/00_COMMUNICATIONS_OVERVIEW.md` |
| CAE-11.4-W1 Constitution | `docs/phase-11/11.7-communications/01_CONSTITUTION.md` (`CAE-11.7-W1`) |
| CAE-11.4-W2 Canonical Model | `docs/phase-11/11.7-communications/02_CANONICAL_MODEL_PROTOCOL.md` (`CAE-11.7-W2`) |

## Mission Operations content mapping

| Blob label | Repo location | Status |
|------------|---------------|--------|
| Phase 11.3 overview | `docs/phase-11/11.3-missions/` (pending) | Not yet saved |
| CAE-11.3-W1–W7 | `docs/phase-11/11.3-missions/` (pending) | Not yet saved |

## Implementation order (constitutional)

```text
11.2 W7 commit → 11.2 W8 complete → 11.3 W1–W8 → 11.4 RSP-001 → … → 11.7 COM-002
```

## Overlap notes

- **11.3 mission communications** (W4): operational, mission-bound chat and debriefs.
- **11.7 institutional communications** (COM-002): authoritative record, decisions, knowledge graph.
- **11.2 mission workspace** (W4): strategic mission view under Objective workbench.
- **11.3 command workbench** (W4): daily operations center ("What am I doing today?").
