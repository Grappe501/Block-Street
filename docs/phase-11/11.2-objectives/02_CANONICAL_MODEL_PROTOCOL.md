# Objective Canonical Data Model Protocol

**Build:** 11.2 · **Protocol:** W2 · **Protocol ID:** CAE-11.2-W2 · **System ID:** OBJ-001

## Mission

Define the authoritative data architecture for every execution object beneath an Initiative. This protocol is the **only approved canonical model** for execution objects.

No UI. No APIs. No business logic — only the model every future layer depends on.

**Governed by:** [01_CONSTITUTION.md](01_CONSTITUTION.md) · [PROTOCOL_ARCHITECTURE.md](../PROTOCOL_ARCHITECTURE.md)

## Canonical source

| Layer | Location |
|-------|----------|
| TypeScript | `src/lib/civic-action/builds/11.2/data-model.ts` |
| Entity registry | `src/lib/civic-action/builds/11.2/entity-registry.ts` |
| Database contract | `data/phase-11/objective_database_contract.json` |
| Entity schema | `data/phase-11/objective_entity_schema.json` |
| State machines | `data/phase-11/objective_state_machines.json` |
| Event catalog | `data/phase-11/objective_event_catalog.json` |
| Relationship matrix | `data/phase-11/objective_relationship_matrix.json` |

## Five constitutional principles

1. Objectives are first-class institutional records — not folders or projects.
2. Execution flows downward only; reverse inheritance prohibited.
3. Every object has a permanent canonical identity; IDs never recycle.
4. Every object is versioned; history is permanent.
5. Every object traces to Institution → Initiative → Objective.

## Entity graph

```text
Initiative (INI-001)
  └── Objective
        ├── KeyResult
        ├── Workstream
        │     └── Mission
        │           ├── Milestone
        │           ├── Deliverable
        │           └── Task
        ├── Outcome
        ├── Review
        └── LessonLearned
```

Cross-cutting: Evidence, Dependency, Risk, DecisionReference link polymorphically.

## Validation (protocol)

- No orphan execution records
- Permanent canonical IDs
- Valid parent-child relationships
- Lifecycle rules enforced (W3)
- Ownership traceable
- Every mutation creates a version (W3)
- Searchable and historically reconstructable

## Next protocol

**CAE-11.2-W3 — Domain Services Protocol:** lifecycle behavior, validation, mutation rules, execution services.

```bash
npm run phase11:11.2:w2:all
```
