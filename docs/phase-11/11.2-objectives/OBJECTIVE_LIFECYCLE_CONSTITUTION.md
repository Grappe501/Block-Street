# Objective Lifecycle Constitution

**Build:** 11.2 · **Wave:** W1 · **Canonical source:** `data/phase-11/objective_lifecycle.json`

## States

```text
Draft → Proposed → Approved → Ready → Active → On Track → Needs Attention → At Risk → Completed → Partially Achieved → Superseded → Archived
```

## Gates

- **Parent Initiative gate:** Objectives may not become Active until parent Initiative is Active (INI-001).
- **Approval gate:** Proposed → Approved requires Human authorization.
- **Activation gate:** Ready → Active requires operational readiness (W3).

Lifecycle rules are enforced by the domain layer (W3), not the UI.

## UI rule

Users never edit authoritative status directly. Lifecycle changes use explicit Human-readable actions (W4).
