# Human Experience Protocol — CAE-11.7-W4

**Protocol:** CAE-11.7-W4 · **Subsystem:** COM-UX-001 · **Version:** 0.9.1-com-w4

> **Recovery note:** This protocol was labeled **CAE-11.4-W4** in the recovery blob. The repository registers Communications at **Build 11.7** (COM-002). See [BUILD_NUMBER_RECONCILIATION.md](../BUILD_NUMBER_RECONCILIATION.md).

Translates the communications domain engine into a mission-focused Human collaboration workbench. Humans think in conversations, decisions, meetings, and today's brief — not domain services.

## Four collaboration questions (every home view)

What conversations matter · Which decisions need me · What action items are on me · What changed

## Architecture

`Institution → Communications Workbench → Mission Conversations → Threads → Messages → Decisions`

## Routes

- `/communications` — home
- `/communications/brief` — daily brief
- `/communications/missions/[missionId]` — mission conversation
- `/communications/meetings/[id]` — meeting workspace
- `/communications/decisions/[id]` — decision workspace
- `/communications/documents/[id]` — document collaboration
- `/communications/knowledge` — knowledge explorer
- `/communications/notifications` — notification center
- `/communications/search` — natural language search

## Principle

No lifecycle rules in React. All writes via `/api/v1/civic-action/communications/commands`. AI suggests — Humans post.
