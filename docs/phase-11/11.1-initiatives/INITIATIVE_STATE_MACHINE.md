# Initiative State Machine

**Build:** 11.1 · **Wave:** W2

**Live contract:** `data/phase-11/initiative_state_machine.json`  
**Code:** `src/lib/civic-action/builds/11.1/state-machine.ts`

## Canonical States (14)

```text
concept · discovery · design · approval_pending · approved · preparation
active · paused · at_risk · owner_required · closing · completed · cancelled · archived
```

Only **one** active status per initiative.

## Primary Path

```text
concept → discovery → design → approval_pending → approved → preparation → active
  → closing → completed → archived
```

## Branches

- `active` ↔ `paused` ↔ `active`
- `active` → `at_risk` → `active` | `paused` | `closing`
- `active` → `owner_required` (exception) → recovery paths
- Cancellation allowed from most pre-terminal states → `cancelled` → `archived`

## Illegal Transitions (Rejected)

| From | To | Reason |
|------|-----|--------|
| concept | completed | No skip lifecycle |
| concept | active | No skip approval |
| cancelled | active | Restoration workflow required |
| archived | active | Restoration or successor required |
| completed | active | Restoration workflow required |

## Activation Gate

Requires: institution, executive owner, operational owner, approved charter, scope record, valid status (`preparation` or path into `active`).

**Enforcement:** 11.1-W3 service engine.

## Legacy Map

MVP status `approval` → `approval_pending`
