# API Capability Inventory

**System ID:** API-001 · **Deliverable:** 8.5.1

| Route Family | Current | v1 Target | Class |
|--------------|---------|-----------|-------|
| `/api/auth/*` | Live | Wrap → `/api/v1/auth/*` | Internal |
| `/api/identity/*` | Live | `/api/v1/identity/*` | Internal |
| `/api/admin/*` | Live | `/api/v1/admin/*` | Administrative |
| `/api/content` | Live | `/api/v1/public/content` | Public |
| `/api/cms/*` | Live | `/api/v1/content/*` | Internal |
| `/api/notifications/*` | Live | `/api/v1/notifications/*` | Internal |
| `/api/missions/*` | Live | `/api/v1/missions/*` | Internal |
| `/api/search/*` | Live | `/api/v1/search` | Internal |

**Classification:** Keep · Standardize · Version · Wrap · Deprecate (legacy unversioned routes)
