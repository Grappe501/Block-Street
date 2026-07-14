# V2-B Postgres Port Readiness Map

**Status:** Prepared — **not started**  
Machine twin: `data/v2/v2b-postgres-port-readiness-map.json`

## Safe order (locked)

1. Read-only relational schema  
2. Identity and tenancy  
3. Dual-write  
4. Read comparison  
5. Backfill  
6. Verification  
7. Selective read cutover  
8. Rollback proof  
9. Canonical-store declaration  
10. Blob retirement only after certification  

## Entity classes (initial)

| Entity | Classification |
|--------|----------------|
| Field goals snapshot | `static_seed` → later dual-write optional |
| Invites / accept | `Blob temporary` → `ready for dual-write` candidate |
| Position memberships | `Blob temporary` / local JSON — needs durability proof first |
| Identity/GHID | `requires identity reconciliation` |
| High-school contacts | `requires privacy review` |
| Verified registration results | `not persisted` — blocked until source exists |
| Director audit log | `not persisted` — schema first |

Do not perform destructive cutover in V2-A.2.
