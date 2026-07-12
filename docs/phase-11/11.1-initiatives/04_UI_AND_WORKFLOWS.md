# Build 11.1 — Wave 4: Initiative Human Workflows, Workbench, and User Interface

**Wave ID:** CAE-11.1-W4 · **Subsystem:** INI-UX-001 · **Status:** Implemented (Phase 0)

> **Every screen should help the Human understand the Initiative, their authority, and the next responsible action.**

Wave 4 translates W1 constitution, W2 data model, and W3 service engine into role-aware Human workflows. **No lifecycle rules live in React** — the UI calls `InitiativeApplicationService.executeCommand()` and renders results.

## Governing Principle

The Initiative experience is a **living institutional workspace**, not a database panel. Blocked states use plain language via `human-messages.ts`.

## Routes

| Route | Purpose |
|-------|---------|
| `/initiatives` | Institution portfolio |
| `/initiatives/new` | Creation wizard (Concept draft only) |
| `/initiatives/[id]` | Initiative home / overview |
| `/initiatives/[id]/charter` | Charter workbench |
| `/initiatives/[id]/readiness` | Readiness & activation center |
| `/initiatives/[id]/people` | Ownership panel |
| `/initiatives/[id]/manage` | Lifecycle controls |
| `/initiatives/[id]/history` | Human-readable timeline |

Legacy `/initiative/[id]` redirects to `/initiatives/[id]`.

## Code Map

- `src/lib/civic-action/builds/11.1/ux/` — view-model assemblers, human messages, UI actions, locale
- `src/features/initiatives/components/` — shell, cards, blocked states, lifecycle actions
- `src/app/(site)/initiatives/` — pages
- `src/app/api/v1/civic-action/initiatives/` — portfolio, detail, commands API

## Wave 5 Handoff

See `WAVE_5_API_HANDOFF.md` for required queries, commands, events, and live auth integration.
