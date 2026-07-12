# Relationship API

**System ID:** REL-001 · Base path: `/api/v1/community-relationship`

## Graph

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | /nodes | community_relationship.view | List nodes |
| POST | /nodes | community_relationship.manage | Create node |
| GET | /edges | community_relationship.view | List edges |
| GET | /events | community_relationship.view | List events |
| POST | /events | community_relationship.manage | Record interaction event |
| GET | /graph | community_relationship.view | Full graph with privacy filter |

## Intelligence

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /mentorship | Mentorship graph + load |
| POST | /mentorship | Accept mentorship |
| GET | /collaboration | Collaboration analytics |
| GET | /connectors | Community connectors |
| GET | /isolation | Isolation alerts |
| GET | /resilience | Network resilience metrics |
| GET | /recommendations | AI advisory recommendations |
| GET | /insights | Relationship insights |

## Dashboards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard | User relationship dashboard |
| GET | /analytics | Health + executive dashboard |
| GET | /federation | Aggregated federation analytics |

## Privacy

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /privacy | Get privacy settings |
| POST | /privacy | Update privacy settings |

## Admin

`GET /api/admin/community-relationship/overview` — aggregated admin view
