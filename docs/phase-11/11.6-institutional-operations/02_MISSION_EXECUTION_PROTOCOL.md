# CAE-11.6-W2 — Mission Execution Engine Protocol

**Protocol ID:** `CAE-11.6-W2`  
**System:** OPS-001 — Institutional Operations & Mission Execution

## Constitutional Principle

> Institutions accomplish their purpose through Missions.

Tasks, calendar events, documents, and communications do not exist independently. Everything supports one or more active Missions.

## Mission as Operational Container

An operational Mission is a governed object with ownership, outcomes, timeline, resources, accountability, and institutional memory. It is not merely a task list.

## API Namespace

Institutional operational missions are served at **`/api/v1/operations/missions`**.

Legacy county/campaign missions remain at `/api/v1/missions`. Strategic mission **statements** remain at `/api/v1/strategy/mission`. Execution missions under 11.2 objectives remain at `/api/v1/objectives/{id}/missions`.

## Traceability

Every operational Mission stores upward links to Program, Project, Objective, Goal, Pillar, Mission Statement, and Vision (Wave 1).

## AI Boundaries

Mission intelligence is advisory only. AI never changes mission state without Human approval.

## Integration

Wave 2 integrates with Wave 1 strategic planning, 11.1 identity, 11.2 people/teams, and 11.12 knowledge engine for lessons learned sync.
