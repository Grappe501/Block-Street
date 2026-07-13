# Build 11.12 — Wave 4: Human Experience & Learning Workbench

**Protocol ID:** CAE-11.12-W4 · **Subsystem:** KNW-UX-001 · **Maps from:** CAE-11.5-W4

## Mission

Transform Waves 1–3 into an experience ordinary Humans can use. Every screen answers one question before introducing the next decision.

## Guiding Principle

> Every screen should answer one question clearly before introducing the next decision.

## Workspaces

- Home Dashboard — "What is the most important thing for me to do right now?"
- Knowledge Reader — readable first, version-aware, historical banner
- Learning Workspace — path, course, tutor, assessments
- Competency Tracker — completion ≠ competency
- Certification Center — held, in progress, blocked with remaining requirements
- Mission Workspace — connects learning to field practice
- AI Command Bar — advisory only

## API Surface

- `GET /api/v1/workspace/home`
- `GET /api/v1/workspace/learning`
- `GET /api/v1/workspace/missions`
- `GET /api/v1/workspace/competencies`
- `GET /api/v1/workspace/certifications`
- `GET /api/v1/workspace/calendar`
- `GET /api/v1/workspace/notifications`
- `POST /api/v1/workspace/notes`
- `POST /api/v1/workspace/bookmarks`

## Site Routes

- `/learning` — home dashboard
- `/learning/knowledge` — library search
- `/learning/knowledge/[id]` — reader
- `/learning/courses/[id]` — course player
- `/learning/competencies` — competency tracker
- `/learning/certifications` — certification center
- `/learning/tutor` — AI tutor panel
- `/learning/mission` — mission workspace

## Validate

```bash
npm run phase11:11.12:w4:all
```
