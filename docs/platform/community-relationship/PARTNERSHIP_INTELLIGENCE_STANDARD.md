# Partnership Intelligence Standard

**System ID:** REL-001

## Organizational Relationship Map

Organizations may view (where permission exists):

- Partner organizations
- Shared volunteers
- Shared events and initiatives
- Coalition participation

## Partnership Types

- `partner_organization`
- `coalition_partner`
- `neighbor_organization`
- `community_contact`

## Recommendations

AI may suggest partnership opportunities based on existing collaboration history. All recommendations are advisory (`advisory_only: true`).

## API

- `GET /api/v1/community-relationship/recommendations?institution_id=`
- `GET /api/v1/community-relationship/analytics?institution_id=`
