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
| 11.6 | Institutional Operations & Mission Execution | OPS-001 | Blob "Strategic Planning / Mission Execution" → **OPS-001** (16 waves); supersedes prior CAP-001 label |
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
| CAE-11.4-W3 Domain Services | `docs/phase-11/11.7-communications/03_DOMAIN_SERVICES_PROTOCOL.md` (`CAE-11.7-W3`) |
| CAE-11.4-W4 Human Experience | `docs/phase-11/11.7-communications/04_HUMAN_EXPERIENCE_PROTOCOL.md` (`CAE-11.7-W4`) |
| CAE-11.4-W5 APIs & Events | `docs/phase-11/11.7-communications/05_API_EVENTS_INTEGRATIONS.md` (`CAE-11.7-W5`) |
| CAE-11.4-W6 Intelligence | `docs/phase-11/11.7-communications/06_INTELLIGENCE_LAYER.md` (`CAE-11.7-W6`) |
| CAE-11.4-W7 Optimization | `docs/phase-11/11.7-communications/07_OPTIMIZATION_LAYER.md` (`CAE-11.7-W7`) |
| CAE-11.4-W8 Production | `docs/phase-11/11.7-communications/08_PRODUCTION_READINESS.md` (`CAE-11.7-W8`) |

## Knowledge & Learning content mapping

| Blob label | Correct repo location | System ID |
|------------|----------------------|-----------|
| Phase 11.5 Knowledge overview | `docs/phase-11/11.12-adaptive-learning/00_KNOWLEDGE_ENGINE_OVERVIEW.md` | **ADP-001** |
| CAE-11.5-W1–W8 (when pasted) | `docs/phase-11/11.12-adaptive-learning/` (`CAE-11.12-W*`) | ADP-001 |
| CAE-11.12-W1 Constitution | `docs/phase-11/11.12-adaptive-learning/01_CONSTITUTION.md` | ADP-001 ✓ |
| CAE-11.12-W2 Canonical Model | `docs/phase-11/11.12-adaptive-learning/02_CANONICAL_MODEL_PROTOCOL.md` | ADP-001 ✓ |

**Note:** Blob architecture lists Communications as 11.4 and Knowledge as 11.5. Repository uses **11.7** for Communications and **11.12** for Adaptive Execution & Continuous Learning (Institutional Brain / LMS). Repository **11.5** remains **TIM-001** (Calendar).

Partial knowledge capabilities already exist in **11.7 COM-002** (knowledge graph, capture, explorer, institutional memory). **11.12 ADP-001** owns the full Learning Academy, courses, skills, certifications, and AI tutor stack.

## Institutional Operations content mapping

| Blob label | Correct repo location | System ID |
|------------|----------------------|-----------|
| CAE-11.6-W1 Strategic Planning | `docs/phase-11/11.6-institutional-operations/` (`CAE-11.6-W*`) | **OPS-001** |
| Strategic APIs | `/api/v1/strategy/*` (not `/api/v1/objectives` — owned by 11.2 OBJ-001) | OPS-001 |

**Note:** User blob labels Build 11.6 as Institutional Operations & Mission Execution Engine (16 waves). Repository **11.6** is **OPS-001**. Prior scaffold label CAP-001 (Resource/Capacity) is deferred or re-homed in a future build.

## Mission Operations content mapping

| Blob label | Repo location | Status |
|------------|---------------|--------|
| Phase 11.3 overview | `docs/phase-11/11.3-missions/` (pending) | Not yet saved |
| CAE-11.3-W1–W7 | `docs/phase-11/11.3-missions/` (pending) | Not yet saved |

## Implementation order (constitutional)

```text
11.2 complete → 11.3 W1–W8 → 11.4 RSP-001 → 11.5 TIM-001 → … → 11.7 COM-002 complete ✓ → … → 11.12 ADP-001
```

**Out-of-order note:** Build 11.7 was implemented before 11.3 per recovery blob sequence. Mission Operations (11.3) remains the scaffold-recommended next build.

## Overlap notes

- **11.3 mission communications** (W4): operational, mission-bound chat and debriefs.
- **11.7 institutional communications** (COM-002): authoritative record, decisions, knowledge graph.
- **11.2 mission workspace** (W4): strategic mission view under Objective workbench.
- **11.3 command workbench** (W4): daily operations center ("What am I doing today?").
