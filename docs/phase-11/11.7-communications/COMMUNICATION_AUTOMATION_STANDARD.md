# Communication Automation Standard

**Build:** 11.7 COM-002

## Event-Driven Automation

Integrations react to authoritative domain events — never to UI state or direct database mutation.

## Subscribers

| Consumer | Responsibility |
|----------|----------------|
| search | Visibility-scoped search index |
| notifications | Mention, meeting reminder, decision, announcement |
| calendar | One-way schedule entries (no lifecycle mutation) |
| analytics | Derived operational projections |
| mission | Action item sync + mission conversation stubs |
| knowledge | Relationship graph edges |
| webhooks | External signed delivery |

## Mission Sync

`communication.action_item_created` events queue entries in `mission-sync.ts` for Build 11.3 integration.
