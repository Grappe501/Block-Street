# Read API Reference

Read APIs return projection views assembled from W4 UX assemblers. They never mutate state.

## Collection

`GET /api/v1/objectives`

Query params: `initiative_id`, `institution_id`, `status`, `objective_type`, `owner_human_id`, `search`, `cursor`, `limit` (max 100).

## Detail Views

| Route | View |
|-------|------|
| `GET /objectives/{id}` | ObjectiveView |
| `GET /objectives/{id}/dashboard` | ObjectiveDashboardView |
| `GET /objectives/{id}/progress` | Progress summary |
| `GET /objectives/{id}/permissions` | Advisory permissions |
| `GET /objectives/{id}/workstreams` | Workstream board |
| `GET /objectives/{id}/missions` | Mission list |
| `GET /objectives/{id}/today` | Today's Work |

Routes scoped to an initiative require `initiative_id` query parameter.
