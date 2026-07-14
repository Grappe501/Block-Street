# Lead seats → campaign pages → user profiles

**Status:** Planned · not rushed · honesty labels until real  
**Audience:** Ernie + Steve  
**Depends on:** Invite-chain CERTIFIED PRESENT · V2-B.5 freeze · Postgres/RBAC before personnel assign

## Destination (honest)

When someone claims a **lead position**:

1. They keep a durable **user account** (email/password session — live today).
2. They receive a **leadership assignment** bound to hierarchy role + scope (institution / county / function).
3. `/leader/:assignmentId` shows Field Plan L1 responsibilities + KPIs for that seat (shell today; content bind next).
4. College Command / County Volunteer Command list them as lead for that scope.
5. Their **network / profile** surfaces show roles they hold — without exposing statewide chrome they do not need.

## What exists today

| Piece | Status |
|-------|--------|
| Invite → activate → choose place → network | Soft-beta path |
| College Command institution KPIs | Live-ish |
| `/leader/:id` Area Leader shell | Stub / demo ids |
| Position membership store | Seed / Blobs-adjacent; sensitive assign off |
| Field Plan L1 frozen templates | V2-B.5 static_seed |

## Sequence (do not skip)

1. Invite-chain evidence CERTIFIED PRESENT  
2. Bind L1 library into `/leader/:id` for content-backed seats (read-only)  
3. Open recruitment ask / claim flow that creates assignment **without** inventing hierarchy  
4. Profile role badges from assignments  
5. Personnel mutations only after durable write path + RBAC  

We partner with beta users via `/feedback` while this path remains honest about “shell / next.”
