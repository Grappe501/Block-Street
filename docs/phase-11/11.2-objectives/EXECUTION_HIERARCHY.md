# Execution Hierarchy

**Build:** 11.2 · **Wave:** W1

```text
Institution
  ↓
Initiative          (INI-001 — Build 11.1)
  ↓
Objective           ← purpose: what success looks like
  ↓
Key Result          ← measurement
  ↓
Workstream          ← major line of execution
  ↓
Mission             ← smallest meaningful work unit
  ↓
Milestone           ← checkpoint (not a deliverable)
  ↓
Deliverable         ← tangible output
  ↓
Task                ← executable action
  ↓
Activity            ← recorded work
  ↓
Evidence            ← proof
  ↓
Outcome             ← evaluated result
  ↓
Lessons Learned     ← institutional memory
```

## Parent-child rules

| Child | Parent | Cardinality |
|-------|--------|-------------|
| Objective | Initiative | many:1 |
| Key Result | Objective | many:1 |
| Workstream | Objective (primary) | many:1 |
| Mission | Workstream | many:1 |
| Milestone | Mission | many:1 |
| Deliverable | Mission | many:1 |
| Task | Mission | many:1 |

## Cross-cutting traces

Calendar events, resource allocations, budget items, volunteer assignments, communication campaigns, and automations must trace to an **Objective** (directly or through Mission ancestry).

## Success independence

Each layer evaluates success independently per [OBJECTIVE_SUCCESS_DOCTRINE.md](OBJECTIVE_SUCCESS_DOCTRINE.md).
