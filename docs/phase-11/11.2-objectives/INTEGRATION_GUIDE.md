# Integration Guide

## Replaceable Adapters

| Adapter | Role |
|---------|------|
| search-projection | Institution-scoped search index |
| notification-adapter | Event → notification queue |
| calendar-adapter | One-way calendar entries |
| analytics-projection | Derived operational metrics |
| audit-adapter | Immutable audit trail |
| webhook-delivery | Signed external delivery |
| initiative-guard | Upstream 11.1 Initiative contract |

## Dispatch Hub

`integrations/dispatch.ts` fans out outbox records to consumers. Each consumer is idempotent via `consumer-receipts.ts`.

## Automation

Automation submits the same commands as Humans via `POST /objectives/commands` with `request_source: automation`. No bypass path exists.

## AI

`POST /ai/objectives/query` receives human and machine summaries only — never raw persistence models or mutation endpoints.
