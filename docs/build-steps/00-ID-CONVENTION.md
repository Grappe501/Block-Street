# Design Artifact ID Convention

> Every approved design decision receives a stable, unique ID.  
> Burt references these IDs in implementation, tests, commits, and documentation.

---

## ID Format

```
[CATEGORY]-[NUMBER]
```

Examples: `PI-001`, `MS-001`, `ER-003`

---

## Category Codes

| Code | Category | Used In |
|------|----------|---------|
| **PI** | Platform Identity | Name, identity statement, motto, long-term identity |
| **MS** | Mission | Mission statement requirements |
| **VS** | Vision | Vision statement requirements |
| **PU** | Purpose | Problem/solution purpose statements |
| **AU** | Audience | Primary and secondary audience definitions |
| **GS** | Geographic Scope | State, county, institution coverage |
| **OP** | Organizing Philosophy | Relational organizing, beliefs, principles |
| **OH** | Organizing Homes | Campus, county, personal network structures |
| **ER** | Equal Representation | Equal standing, no hierarchy rules |
| **LS** | Launch Success | V1 readiness, pillars, checklist |
| **GM** | Growth Model | Evolution strategy, versioning, V1 scope |
| **OM** | Organizing Model | Five layers, organizing homes, database philosophy |
| **CP** | Core Principles | Immutable platform constitution (CP-001–015) |
| **DG** | Design Guardrails | Legal, ethical, operational, architectural boundaries |
| **BG** | Burt Guardrails | Implementation constraints for Burt |
| **ED** | Engineering Doctrine | Design → Build → Validate → Iterate |
| **CT** | Constitutional Test | Feature approval questions (CT-001) |
| **NS** | North Star | Ultimate destination, success metrics, five questions |
| **NB** | Nonpartisan Boundaries | What platform must not do |
| **GV** | Governance | Moderation, rules, student leadership |
| **TC** | Teaching Curriculum | WHY/HOW/WHAT, Roberts Rules, guides |
| **RG** | Registry | Arkansas Organizing Registry data requirements |
| **UI** | User Interface | Pages, flows, components |
| **DM** | Data Model | Schema, tables, relationships |
| **AC** | Acceptance Criteria | Step completion criteria |
| **TR** | Traceability System | ID format, matrix, verification gate |

---

## Two ID Layers

### Layer 1 — Constitutional IDs (Phase 1 docs)

Used in build-step documents: `PI-001`, `CP-003`, `NS-013`, `ED-001`, etc.

These define *why* the platform exists and *what principles* govern it.

### Layer 2 — Production Requirement IDs (Phase 1.9+)

Used in `data/requirements-registry.json` for implementation:

```
[DOMAIN]-[NUMBER]
```

Examples: `REG-001`, `NET-014`, `USR-022`, `TEST-NET-001`, `DOC-USR-001`

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

**Page IDs:** `PAGE-HOME`, `PAGE-JOIN`, `PAGE-NETWORK` (stable, not numbered)

**Rule:** IDs never change. Superseded requirements marked deprecated; IDs never reused.

**Registry:** `data/requirements-registry.json` · [PHASE-001.9](PHASE-001.9-MASTER-TRACEABILITY.md)

---

## Build Step Document IDs

```
PHASE-[NNN].[S]
```

| Part | Meaning | Example |
|------|---------|---------|
| `PHASE` | Fixed prefix | — |
| `NNN` | Phase number (001, 002…) | `001` = Phase 1 |
| `S` | Step number within phase | `.1` = Step 1 |

**Example:** `PHASE-001.1` = Phase 1, Step 1 — Platform Identity

---

## Document File Naming

```
docs/build-steps/PHASE-[NNN].[S]-[SHORT-TITLE].md
```

Example: `PHASE-001.1-PLATFORM-IDENTITY.md`

---

## How Burt Uses IDs

1. **Implementation** — Code comments reference requirement IDs: `// Implements OH-003`
2. **Commits** — `feat(signup): county-first flow [OH-002, UI-004]`
3. **Tests** — Test descriptions cite IDs: `PI-001: platform displays working name`
4. **Traceability** — Any feature traces back to an approved design artifact
5. **Revisions** — Changed requirements get new IDs; old IDs marked superseded, never reused

---

## Status Values

| Status | Meaning |
|--------|---------|
| **Canonical** | Approved — governs all future work |
| **Draft** | Under review — do not implement |
| **Superseded** | Replaced by newer ID — historical reference only |

---

## Index

| Document ID | Title | Status |
|-------------|-------|--------|
| PHASE-001.1 | Platform Identity | Canonical |
| PHASE-001.2 | North Star Outcome | Canonical |
| PHASE-001.3 | Core Principles (Platform Constitution) | Canonical |
| PHASE-001.4 | Platform Boundaries & Design Guardrails | Canonical |
| PHASE-001.5 | Organizing Model | Canonical |
| PHASE-001.6 | Growth Model & Evolution Strategy | Canonical |
| PHASE-001.7 | Launch Success Definition | Canonical |
| PHASE-001.8 | Implementation Doctrine & Engineering Protocol | Canonical |
| PHASE-001.9 | Master Traceability & Requirement ID System | Canonical |
| BUILD-BIBLE | Consolidated Phase 1 index (Steps 1.1–1.9) | Canonical |
