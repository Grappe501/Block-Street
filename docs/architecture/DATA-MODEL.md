# Data Model

> Phase 2 deliverable. Schema defined here; implemented when Netlify DB is connected.

## Core Entities

### users
The fundamental object. Every participant is a person with a network.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| slug | VARCHAR | URL-safe username for `/s/[slug]` |
| first_name | VARCHAR | |
| last_name | VARCHAR | |
| email | VARCHAR | Unique |
| phone | VARCHAR | Optional |
| affiliation_type | ENUM | `campus` \| `county` |
| campus_id | FK → campuses | Null if county |
| county_id | FK → counties | Null if campus |
| referred_by_id | FK → users | Who invited them |
| interests | JSONB | Array of interest tags |
| qr_code_url | VARCHAR | Generated QR image URL |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### campuses
Schools and educational institutions.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| slug | VARCHAR | URL slug |
| name | VARCHAR | Full name |
| short_name | VARCHAR | Display abbreviation |
| type | ENUM | `university` \| `college` \| `trade` \| `jr_college` \| `high_school` |
| is_founding_council | BOOLEAN | Leadership council member |
| is_self_registered | BOOLEAN | Future high school self-reg |
| city | VARCHAR | |
| county_id | FK → counties | Geographic county |
| created_at | TIMESTAMP | |

### counties
75 Arkansas county hubs.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| slug | VARCHAR | URL slug |
| name | VARCHAR | e.g. "Pulaski County" |
| fips_code | VARCHAR | Optional FIPS |
| created_at | TIMESTAMP | |

### referrals
Explicit relationship graph (who recruited whom).

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| referrer_id | FK → users | |
| referred_id | FK → users | |
| created_at | TIMESTAMP | |

### interests (reference)
Static list, stored as enum/tags on user:

- leadership
- events
- outreach
- communications
- committees
- voter_education
- issue_organizing

## Future Entities (v1.1+)

| Entity | Version | Purpose |
|--------|---------|---------|
| committees | v1.1 | Local + cross-campus/county |
| committee_members | v1.1 | Membership |
| events | v1.2 | Calendar |
| event_rsvps | v1.2 | Attendance |
| messages | v1.3 | Communication |
| surveys | v1.4 | Issue input |
| survey_responses | v1.4 | Student votes |
| volunteer_hours | v1.5 | Impact tracking |
| roles | v1.6 | Campus leadership permissions |

## Relationship Diagram

```
counties ←── campuses
    ↑            ↑
    │            │
    └── users ───┘
         │
    referrals (self-referential graph)
         │
    committees → events → messages
```

## Seed Data

- 75 counties from `data/counties.json`
- Founding council campuses from `data/campuses.json`
- Additional campuses added as students onboard schools
