# Objective Workbench Protocol

**Protocol:** CAE-11.2-W4 · **Subsystem:** OBJ-UX-001

Translates the execution engine into a mission-focused Human operating system. Humans think in goals, work, progress, and today's priorities — not domain services.

## Six questions (every dashboard)

Why · What · How · Attention · Next · Help

## Architecture

`Institution → Initiative → Objective Workbench → Workstreams → Missions → Today's Work`

## Routes

- `/initiatives/[id]/objectives` — portfolio
- `/initiatives/[id]/objectives/new` — conversational builder
- `/initiatives/[id]/objectives/[objectiveId]/*` — workbench sections

## Principle

No lifecycle rules in React. All writes via `/api/v1/civic-action/objectives/commands`.
