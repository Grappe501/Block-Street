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
| **NB** | Nonpartisan Boundaries | What platform must not do |
| **GV** | Governance | Moderation, rules, student leadership |
| **TC** | Teaching Curriculum | WHY/HOW/WHAT, Roberts Rules, guides |
| **RG** | Registry | Arkansas Organizing Registry data requirements |
| **UI** | User Interface | Pages, flows, components |
| **DM** | Data Model | Schema, tables, relationships |
| **AC** | Acceptance Criteria | Step completion criteria |

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
