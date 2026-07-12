# Relationship Ledger Standard

**System ID:** REL-001

## RelationshipEvent

Every meaningful interaction becomes a ledger event:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Event ID |
| relationship_edge_id | string | Associated edge |
| event_type | string | worked_on_mission, served_together, mentored, etc. |
| category | enum | volunteer, training, meeting, project, mission, mentorship, leadership, committee, research, planning, community_event, coalition, communication |
| date | ISO datetime | When interaction occurred |
| source | string | Originating system |
| verification | enum | Verification level |
| duration_minutes | number | Optional |
| notes | string | Optional |
| institution_id | string | Owning institution |

## Principles

- Events are append-only
- Each event triggers explainable strength recalculation
- Verification levels escalate through institutional confirmation
- History is preserved for longitudinal relationship timelines
