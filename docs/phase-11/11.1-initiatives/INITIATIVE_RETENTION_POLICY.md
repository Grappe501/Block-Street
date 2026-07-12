# Initiative Retention Policy

**Build:** 11.1 · **Wave:** W2

## Deletion Rules

| Entity | Hard Delete | Soft Archive |
|--------|-------------|--------------|
| Initiative | **Never** | `is_archived`, `status=archived` |
| Charter | **Never** | `charter_status=archived` |
| History events | **Never** | N/A (retain per policy) |
| Versions | **Never** | N/A |
| Scope (superseded) | **Never** | Retain all versions |
| Closeout | **Never** | Permanent record |

## Archival Behavior

Archived initiatives remain:

- Searchable (metadata index)  
- Auditable (history + versions)  
- Reportable (portfolio, outcomes)  
- Reusable (playbook source in 11.14)  

## Data Retention

Institution policy (POL-008) defines retention duration. Sensitive population data triggers safety gates (PRV-005, 11.15).

## Restoration

Reactivation requires restoration workflow — prefer **successor initiative** for substantial cases (W1 closeout constitution).

## MVP Store

Current `data/civic-action/store.json` flat `initiatives` array remains until W3 migration writes canonical store keys.
