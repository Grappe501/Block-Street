# Objective Constitution

**Build:** 11.2 · **Wave:** W1 · **System ID:** OBJ-001  
**Wave ID:** CAE-11.2-W1  
**Status:** Canonical documentation (technical enforcement planned W2–W8)

> **An Initiative may exist without Objectives. Execution may never exist without Objectives.**

**Live contracts:** `data/phase-11/objective_vocabulary.json` · `data/phase-11/objective_types.json` · `src/lib/civic-action/builds/11.2/constitution.ts`

---

## Constitutional Principle

An **Initiative** defines **why** the organization exists around a problem.

An **Objective** defines **what success looks like**.

Everything else derives from Objectives.

---

## Constitutional Formula

```text
Current State + Desired State + Evidence of Success + Time Horizon + Responsible Owners + Measurement + Review Rhythm = Governed Objective
```

---

## Definition

An **Objective** describes the future state the institution intends to create.

It is **not** a task, meeting, calendar event, project plan, or checklist.

---

## Execution Hierarchy

```text
Institution → Initiative → Objective → Key Result → Workstream → Mission → Milestone → Deliverable → Task → Activity → Evidence → Outcome → Lessons Learned
```

Every level inherits purpose from the level above.

See [EXECUTION_HIERARCHY.md](EXECUTION_HIERARCHY.md).

---

## Twelve Constitutional Commitments

1. Every Objective belongs to exactly one Initiative.
2. Every Key Result belongs to exactly one Objective.
3. Every Workstream belongs to one primary Objective.
4. Every Mission belongs to one Workstream.
5. Every Deliverable belongs to one Mission.
6. Every Task belongs to one Mission.
7. Calendar events, resources, communications, and budget items trace to an Objective.
8. Objectives may not become Active until parent Initiative is Active.
9. AI may recommend Objectives but may never approve them.
10. Completed work retains permanent traceability.
11. Archived Objectives remain searchable institutional memory.
12. No orphan work is permitted.

---

## Objective Characteristics

Every Objective must answer: why does this matter; what changes; who benefits; how will we know; who owns success; when should it exist; what evidence proves success; what assumptions exist; what constraints exist.

---

## Success Doctrine

- A completed Task does not imply a successful Mission.
- A completed Mission does not imply a successful Objective.
- A completed Objective does not imply a successful Initiative.
- Each layer evaluates independently.

See [OBJECTIVE_SUCCESS_DOCTRINE.md](OBJECTIVE_SUCCESS_DOCTRINE.md).

---

## Traceability

The platform can always answer: **"Why does this Task exist?"**

```text
Task → Mission → Workstream → Objective → Initiative → Institution
```

See [OBJECTIVE_TRACEABILITY_STANDARD.md](OBJECTIVE_TRACEABILITY_STANDARD.md).

---

## Specialized Documents

| Document | Purpose |
|----------|---------|
| [OBJECTIVE_TAXONOMY.md](OBJECTIVE_TAXONOMY.md) | 13 objective types |
| [OBJECTIVE_LIFECYCLE_CONSTITUTION.md](OBJECTIVE_LIFECYCLE_CONSTITUTION.md) | Lifecycle states |
| [OBJECTIVE_AUTHORITY_MODEL.md](OBJECTIVE_AUTHORITY_MODEL.md) | Ownership roles |
| [OBJECTIVE_REVIEW_DOCTRINE.md](OBJECTIVE_REVIEW_DOCTRINE.md) | Review rhythm |
| [OBJECTIVE_AI_BOUNDARIES.md](OBJECTIVE_AI_BOUNDARIES.md) | AI may / may not |
| [OBJECTIVE_SPANISH_VOCABULARY.md](OBJECTIVE_SPANISH_VOCABULARY.md) | Core Spanish terms |

---

## Relationship to Build 11.1

Build 11.1 (INI-001) governs Initiatives. Build 11.2 (OBJ-001) governs execution beneath Initiatives. An active Initiative may host zero or many Objectives; execution artifacts may not exist without Objective ancestry.

---

## Validation

```bash
npm run phase11:11.2:w1
```
