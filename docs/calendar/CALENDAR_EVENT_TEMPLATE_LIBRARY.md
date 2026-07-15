# Event Template Library — CAL-P2 Wave 1B

## Purpose

The Event Template Library reduces blank-page planning for campaign, College Community, county, city, volunteer, and candidate events. Templates provide **defaults, not commands**.

## Location

| Layer | Path |
|-------|------|
| Types & contract | `src/lib/calendar/templates/types.ts` |
| Catalog (18 templates) | `src/lib/calendar/templates/catalog.ts` |
| Registry & filters | `src/lib/calendar/templates/registry.ts` |
| Apply engine | `src/lib/calendar/templates/apply.ts` |
| Validation | `src/lib/calendar/templates/validate.ts` |
| JSON export | `data/calendar/event-templates.json` |

## Routes

- `/calendar/templates` — browse and filter
- `/calendar/templates/:templateId` — detail
- `/calendar/templates/:templateId/preview` — what will be generated
- `/calendar/templates/:templateId/use` — multi-step soft-beta create flow
- `/command/events/templates` — command dashboard view

## Versioning

Each event preserves:

- `template_id`
- `template_version`
- `template_applied_at`
- `template_snapshot`

Updating a catalog template does not rewrite existing events.

## Flagship templates

1. **Campus Voter-Registration Drive** (`tpl-campus-voter-registration-drive`)
2. **Campus Networking Event** (`tpl-campus-networking-event`)

## Soft-beta disclosures

Templates never confirm Kelly, assign volunteers, publish events, or create durable records while Gate A is open.

## Validation

```bash
npm run calendar:templates:validate
npm run test:calendar:templates
```
