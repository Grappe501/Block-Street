# Relationship Privacy Standard

**System ID:** REL-001

## Individual Controls

| Setting | Default | Description |
|---------|---------|-------------|
| public_connections | true | Public connection visibility |
| mentorship_visibility | true | Show mentorship relationships |
| collaboration_history_visible | true | Show collaboration strength detail |
| partnership_visibility | true | Show organizational partnerships |

## Organizational Controls

Institutions determine shared relationship visibility and federation sharing. No hidden graph access.

## Federation

Federation receives aggregated collaboration trends only — no private operational relationships exposed.

## API

- `GET /api/v1/community-relationship/privacy?user_id=&institution_id=`
- `POST /api/v1/community-relationship/privacy`

All privacy changes are recorded in the audit trail.
