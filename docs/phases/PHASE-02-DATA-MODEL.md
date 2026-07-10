# Phase 2 — Data Model

**Status:** Pending  
**Goal:** Define and implement users, campuses, counties, referrals, QR/share links, signups, roles, and network relationships in Netlify DB.

## Steps

| # | Step | Status | Notes |
|---|------|--------|-------|
| 2.1 | Finalize schema documentation | ✅ Done | docs/architecture/DATA-MODEL.md |
| 2.2 | Connect Netlify DB (Postgres) | ⏳ Pending | After Netlify site created |
| 2.3 | Create migration: counties table | ⏳ Pending | Seed 75 counties |
| 2.4 | Create migration: campuses table | ⏳ Pending | Seed founding council |
| 2.5 | Create migration: users table | ⏳ Pending | With affiliation_type |
| 2.6 | Create migration: referrals table | ⏳ Pending | Relationship graph |
| 2.7 | Seed county data | ⏳ Pending | From data/counties.json |
| 2.8 | Seed campus data | ⏳ Pending | From data/campuses.json |
| 2.9 | API routes for read operations | ⏳ Pending | /api/counties, /api/campuses |
| 2.10 | Admin dashboard: Data Model tab | ⏳ Pending | Show schema + seed status |

## Deliverables

- [ ] Postgres schema live on Netlify DB
- [ ] 75 counties seeded
- [ ] Founding council campuses seeded
- [ ] API endpoints for reference data
- [ ] Admin shows DB connection status

## Exit Criteria

Phase 2 complete when database is connected, seeded, and queryable from the app.
