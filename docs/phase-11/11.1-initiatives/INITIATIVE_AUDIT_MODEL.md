# Initiative Audit Model

**Build:** 11.1 · **Wave:** W2

**Entity:** `InitiativeHistoryEvent` in `data-model.ts`

## Event Types

```text
initiative_created · owner_assigned · owner_changed · charter_approved
activated · paused · scope_changed · dependency_added · dependency_removed
review_completed · version_created · status_changed · closed · cancelled · archived
restoration_requested
```

## Fields

```text
initiative_event_id · initiative_id · institution_id · event_type
actor_human_id · previous_state · new_state · reason
correlation_id · request_id · occurred_at
```

## Rules

- **Append-only** — no update or delete  
- **Attribution** — consequential actions resolve to canonical Human (CON-016)  
- **Reconstruction** — full initiative history rebuildable from events + version snapshots  

## Relationship to Platform Audit

Aligns with Phase 11 shared `Phase11AuditEvent` pattern. Initiative history is domain-specific; platform audit may mirror events in W5.

## W3 Enforcement

Service layer writes history on every state transition, ownership change, charter approval, and scope material change.
