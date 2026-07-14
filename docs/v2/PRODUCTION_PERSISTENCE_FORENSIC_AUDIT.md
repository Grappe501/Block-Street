# Production Persistence Forensic Audit

**Date:** 2026-07-14  
**Verdict:** **Netlify Database / Postgres is NOT the live canonical store.**  
Canonical production durability today is **Netlify Blobs** + **static/seed JSON** on the deploy artifact, with some in-memory/session paths.

Machine twin: `data/v2/production-persistence-forensic-audit.json`

## Backend labels in use

| Label | Meaning |
|-------|---------|
| `netlify_blobs` | Durable server write via Blobs (`durable-json`) |
| `static_seed` | Checked-in JSON shipped with the build |
| `session_storage` / cookies | Auth sessions |
| `in_memory` | Process memory only |
| `not_persisted` | No durable write |
| `netlify_database_postgres` | **Not certified live** — V2-B deferred |

## Action classifications (summary)

| Action | Backend | Notes |
|--------|---------|-------|
| Invite create/accept | `netlify_blobs` (+ seed) | Wave1 invites; flush patterns required |
| Place / map lock | `netlify_blobs` / auth store | Home place JSON |
| Position volunteer/lead | local JSON write on server FS / Blobs intended | `data/position-participation/store.json` — Blobs dual-path still evolving |
| County goals / VCI | `static_seed` | `data/field-goals/county-field-goals.json` from RedDirt ingest |
| Launch readiness / build % | `static_seed` | Not product certification |
| Communication attempt | `not_persisted` | Education contact scaffold — durable log deferred |
| Director inspection | `not_persisted` audit yet | Reason captured client-side only in this slice |
| Event creation | varies by phase module | Many civic-action stores are JSON/Blobs |
| Confirmed voter-registration results | `not_persisted` / unconnected | UI must say so |

## Do not claim

- “Everything is stored”
- “Postgres is live”
- “Netlify Database is canonical”

until V2-B dual-write + readback certification passes.

## Operator/Director panel copy

```text
Current canonical persistence backend: netlify_blobs + static_seed
Postgres migration status: deferred (V2-B)
```
