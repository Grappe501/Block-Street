# CMS Content Inventory — Build 8.3.1

**System ID:** CMS-001

## Existing Content Sources

| Source | Location | Classification |
|--------|----------|----------------|
| Public site pages | `src/app/(site)/` | **Migrate** — county/school pages |
| Phase docs | `docs/phase-*` | **Archive Only** — not CMS editorial |
| Registry counties/schools | `data/registry/` | **Canonical** — dynamic data, CMS overlays |
| Build log | `docs/build-log/` | **Retire** from CMS scope |
| Admin UI copy | React components | **Stable interface copy** — selective migrate |
| Email/notification copy | Not centralized | **Migrate Later** — Build 8.4 |
| Mission templates | `data/missions/` | **Merge** — reference via ContentRelation |
| Search index | `data/search/search_objects.jsonl` | **Integrate** — publish hooks |

## Migration Classification

| Asset | Status |
|-------|--------|
| Bootstrap articles | Canonical |
| County profile pages | Migrate |
| Help/onboarding copy | Needs Review |
| Hard-coded labels | Stable interface copy |
| Legal/policy text | High-risk workflow |

## Deliverables

- `data/cms/content_items.json` — canonical repository bootstrap
- Search integration via `indexPublishedContent()` on publish
