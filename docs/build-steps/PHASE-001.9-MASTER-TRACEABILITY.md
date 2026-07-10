# Build Step 1.9 — Master Traceability & Requirement Identification System

**Document ID:** PHASE-001.9  
**Status:** Canonical  
**Priority:** Critical  
**Master Build Plan Sequence:** Phase 001 — Foundational Constitution (final step)

> **Mandatory before Burt writes a single line of production code.**  
> If it cannot be traced, it should not be built.

**Builds On:** [00-ID-CONVENTION.md](00-ID-CONVENTION.md) · [PHASE-001.8](PHASE-001.8-IMPLEMENTATION-DOCTRINE.md) · All PHASE-001.1–001.8

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| TR-001 | Purpose |
| TR-002 | Guiding principle |
| TR-003 | Traceability chain |
| TR-004 | Requirement ID format |
| TR-005 | Domain prefixes |
| TR-006 | Requirement record schema |
| TR-007 | Traceability matrix |
| TR-008 | Acceptance test IDs |
| TR-009 | Documentation IDs |
| TR-010 | Page IDs |
| TR-011 | Database IDs |
| TR-012 | API IDs |
| TR-013 | Version history |
| TR-BR | Burt's verification responsibilities |
| TR-SR | Steve's approval responsibilities |
| TR-CC | Completion criteria |
| TR-MOTTO | Engineering motto |
| AC-009 | Step 1.9 acceptance criteria |

**Live registry:** `data/requirements-registry.json` · Admin **Traceability** tab

---

## TR-001 — Purpose

**[TR-001]** This document establishes the universal identification, traceability, and verification system for the Arkansas Student & Youth Organizing Network.

**[TR-001a]** Every requirement, feature, page, database object, API endpoint, user interface component, and test case should be traceable back to an approved design decision.

**[TR-001b]** The objective is to create a platform where every implementation can answer:

> **"Why does this exist?"**

---

## TR-002 — Guiding Principle

**[TR-002]**

- Nothing is implemented without an approved requirement.
- Nothing is approved without documentation.
- Nothing is deployed without verification.

*Extends [ED-GR] Golden Rule · [TR-MOTTO]*

---

## TR-003 — Traceability Chain

**[TR-003]** Every capability follows the same chain:

```
Mission
    ↓
North Star
    ↓
Constitutional Principle
    ↓
Requirement
    ↓
Architecture
    ↓
Database
    ↓
Backend
    ↓
Frontend
    ↓
Testing
    ↓
Documentation
    ↓
Deployment
    ↓
Feedback
    ↓
Next Version
```

**[TR-003a]** Every step remains connected. Nothing exists independently.

---

## TR-004 — Requirement ID Format

**[TR-004]** Every requirement receives a **permanent identifier**.

```
REG-001    Registry Requirement 001
NET-014    Network Requirement 014
USR-022    User Requirement 022
```

**[TR-004a]** IDs **never change**. Even if requirements evolve, the ID remains.

**[TR-004b]** Superseded requirements are marked deprecated; IDs are never reused.

*Constitutional IDs (PI-001, CP-003, etc.) from Phase 1 docs remain valid and link to this system.*

---

## TR-005 — Domain Prefixes

**[TR-005]** Production requirements use these domain prefixes:

| Prefix | Domain |
|--------|--------|
| **CONST** | Constitution cross-references |
| **REG** | Registry |
| **CNTY** | County |
| **INST** | Institution |
| **USR** | User |
| **NET** | Network |
| **EVT** | Events |
| **COM** | Committees |
| **MSG** | Messaging |
| **VOL** | Volunteer |
| **ANL** | Analytics |
| **ADM** | Administration |
| **SEC** | Security |
| **API** | API endpoints |
| **DB** | Database objects |
| **UI** | User interface |
| **MOB** | Mobile |
| **DEP** | Deployment |
| **TEST** | Testing |
| **DOC** | Documentation |

**[TR-005a]** Page identifiers use `PAGE-*` format (not numbered requirements).

---

## TR-006 — Requirement Record

**[TR-006]** Every requirement in `data/requirements-registry.json` should contain:

| Field | Description |
|-------|-------------|
| Requirement ID | Permanent identifier |
| Title | Short name |
| Purpose | Why it exists |
| Description | What it does |
| Priority | critical · high · medium · low |
| Principle | Constitutional link (CP-*, OM-*, NS-*) |
| Dependencies | Other requirement IDs |
| Related Requirements | Adjacent IDs |
| Acceptance Criteria | Measurable completion tests |
| Future Expansion Notes | V2+ scope |
| Implementation Status | pending · in_progress · done |
| Testing Status | pending · in_progress · done |
| Documentation Status | pending · approved · done |
| Trace | DB, API, frontend, test, doc IDs |

---

## TR-007 — Traceability Matrix

**[TR-007]** Every major capability maps back to the Constitution.

**Example:**

```
Principle: CP-008 Relationships First
    ↓
Requirement: NET-001 Personal Network Board
    ↓
Database: DB-NETWORKS
    ↓
API: API-NETWORK-001
    ↓
Frontend: PAGE-NETWORK /dashboard/network
    ↓
Testing: TEST-NET-001
    ↓
Documentation: DOC-NET-001
```

**[TR-007a]** Matrix entries live in `requirements-registry.json` under each requirement's `trace` object.

---

## TR-008 — Acceptance Test IDs

**[TR-008]** Every significant capability receives a permanent test identifier.

```
TEST-USR-004    New participant registration
TEST-NET-011    Referral link generation
TEST-CNTY-007   County page rendering
TEST-INST-012   Institution search
TEST-EVT-005    Event creation
```

**[TR-008a]** Test IDs follow `TEST-[DOMAIN]-[NUMBER]` format.

---

## TR-009 — Documentation IDs

**[TR-009]** Documentation follows the same convention.

```
DOC-USR-001    Participant Registration
DOC-NET-001    Personal Network
DOC-CNTY-001   County Hub
DOC-INST-001   Institution Directory
```

---

## TR-010 — Page IDs

**[TR-010]** Every page receives a stable identifier.

```
PAGE-HOME          /
PAGE-JOIN          /join
PAGE-MAP           /map
PAGE-SCHOOLS       /schools
PAGE-COUNTY        /county/[slug]
PAGE-INSTITUTION   /schools/[slug]
PAGE-NETWORK       /dashboard/network (V1)
PAGE-SHARE         /s/[slug] (V1)
PAGE-ADMIN         /admin
PAGE-SEARCH        /search (future)
```

---

## TR-011 — Database IDs

**[TR-011]** Tables become traceable.

```
DB-USERS
DB-NETWORKS
DB-INSTITUTIONS
DB-COUNTIES
DB-EVENTS
DB-COMMITTEES
DB-REFERRALS
```

---

## TR-012 — API IDs

**[TR-012]** Every endpoint receives documentation.

```
API-USERS-001         POST /api/users/register
API-INSTITUTIONS-001  GET  /api/institutions
API-NETWORK-001       GET  /api/network/[slug]
API-COUNTIES-001      GET  /api/counties
```

---

## TR-013 — Version History

**[TR-013]** Every requirement tracks:

- Created
- Modified
- Implemented
- Verified
- Deprecated (if applicable)
- Replacement Requirement

**[TR-013a]** Historical integrity should always be preserved.

---

## TR-BR — Burt's Responsibilities

**[TR-BR]** Before implementing any feature, Burt must verify:

| # | Check |
|---|-------|
| 1 | Requirement exists in registry |
| 2 | Requirement approved |
| 3 | Dependencies complete |
| 4 | Acceptance criteria defined |
| 5 | Test cases identified |
| 6 | Documentation location established |

**[TR-BRa]** If any are missing → **pause implementation**.

*Combines with [ED-IQ] · [ED-GR]*

---

## TR-SR — Steve's Responsibilities

**[TR-SR]** Steve approves:

- New requirements
- Constitutional changes
- Major architectural changes
- Priority order
- Release readiness

---

## TR-CC — Completion Criteria

**[TR-CC]** This system is successful when:

- Every feature can be traced to a requirement
- Every requirement has an owner
- Every implementation has acceptance criteria
- Every deployment can be audited
- Future versions can extend the system without ambiguity

---

## TR-MOTTO — Engineering Motto

**[TR-MOTTO]**

> **If it cannot be traced, it should not be built.**

---

## AC-009 — Acceptance Criteria

Step 1.9 is complete when:

- [x] **[AC-009a]** Universal ID format and domain prefixes are documented. `[TR-004, TR-005]`
- [x] **[AC-009b]** Requirement record schema is defined. `[TR-006]`
- [x] **[AC-009c]** Traceability chain and matrix format are established. `[TR-003, TR-007]`
- [x] **[AC-009d]** Test, doc, page, DB, and API ID conventions exist. `[TR-008–TR-012]`
- [x] **[AC-009e]** Live requirements registry seeded with V1-critical requirements. `[data/requirements-registry.json]`
- [x] **[AC-009f]** Burt has verification checklist before production code. `[TR-BR, TR-MOTTO]`

---

## Phase 1 Completion

With Step **1.9**, **Phase 1 is complete**.

Nine foundational documents. Burt can read them and understand:

| Step | Understanding |
|------|---------------|
| 1.1 | **Why** the platform exists |
| 1.2 | **What** it is trying to accomplish |
| 1.3 | **What principles** it must protect |
| 1.4 | **What boundaries** it must respect |
| 1.5 | **How** people are organized |
| 1.6 | **How** the platform should grow |
| 1.7 | **What defines** a successful launch |
| 1.8 | **How** implementation should proceed |
| 1.9 | **How** every future requirement will be tracked |

**Consolidated index:** [BUILD-BIBLE.md](BUILD-BIBLE.md)

**Phase 2 begins:** Arkansas Organizing Registry — canonical data foundation and domain models before production implementation.

---

## Burt — Production Code Gate

```
1. Read BUILD-BIBLE.md
2. Locate requirement in requirements-registry.json
3. Verify TR-BR checklist (all 6 items)
4. Implement with requirement ID in commits
5. Update registry status fields
6. Record TEST-* and DOC-* completion
7. ED-FD handoff in BUILD-LOG.md
```

**No requirement ID in commit → implementation review required.**

---

*Next: Phase 2 — Arkansas Organizing Registry (canonical data foundation)*
