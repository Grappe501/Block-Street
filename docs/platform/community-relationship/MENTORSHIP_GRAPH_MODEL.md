# Mentorship Graph Model

**System ID:** REL-001

## First-Class Mentorship

Mentorship relationships use `relationship_type: mentor` edges with `category: mentorship` events.

## Tracked Metrics

- Active mentors and mentees
- Mentor load (mentees per mentor)
- Mentorship history via event ledger
- Mentorship health on executive dashboard

## API

- `GET /api/v1/community-relationship/mentorship` — graph + mentor load
- `POST /api/v1/community-relationship/mentorship` — accept mentorship (mutually confirmed)

## Privacy

Users may hide mentorship visibility via privacy controls without deleting underlying relationships.
