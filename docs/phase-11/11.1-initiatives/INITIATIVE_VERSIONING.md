# Initiative Versioning

**Build:** 11.1 · **Wave:** W2

**Code:** `src/lib/civic-action/builds/11.1/versioning.ts`

## Principle

No overwrite. Every major change creates a new version record linking charter and/or scope snapshots.

## Version Triggers

- purpose_changed  
- owner_changed  
- scope_changed  
- institution_changed  
- visibility_changed  
- governance_class_changed  
- charter_major_edit  
- type_changed  

## Entities Versioned

- `InitiativeRecord.current_version` (monotonic integer)  
- `InitiativeVersionRecord` (immutable log)  
- `InitiativeCharterRecord.version`  
- `InitiativeScopeRecord.version`  

## Not Versioned In Place

`InitiativeHistoryEvent` — append-only events reference version numbers in `new_state` payload.

## Minor Edits

Typos and non-material corrections may append history without new charter version (institution policy POL-007); W3 implements threshold logic.
