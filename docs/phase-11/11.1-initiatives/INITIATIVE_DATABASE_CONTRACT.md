# Initiative Database Contract

**Build:** 11.1 · **Wave:** W2

**Live contract:** `data/phase-11/initiative_database_contract.json`

## Tables (10)

1. `initiatives` — root record  
2. `initiative_charters` — constitutional content  
3. `initiative_scopes` — boundary dimensions  
4. `initiative_timelines` — lifecycle dates  
5. `initiative_memberships` — Human participation  
6. `initiative_versions` — immutable version log  
7. `initiative_dependencies` — typed dependencies  
8. `initiative_reviews` — scheduled reviews  
9. `initiative_history_events` — append-only audit  
10. `initiative_closeouts` — terminal closeout  

## Constraints

- **One governing institution** per initiative  
- **One operational owner** (active membership + record field)  
- **One executive owner**  
- **No service identity owners**  
- **No circular initiative dependencies**  
- **Unique** `(institution_id, initiative_slug)`  

## Deletion

**Never hard-delete:** initiative, charter, history, versions, audit.  
**Soft archive:** `is_archived = true`, `status = archived`.

## IDs

UUID/global string IDs immutable after creation.

## W3 Implementation

Postgres migrations and JSON store loaders will implement this contract in the Initiative Service Engine wave.
