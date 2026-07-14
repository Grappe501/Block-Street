# Campus Civic Goals — City-proportional Doctrine

**Accepted:** 2026-07-14  
**Applies to:** colleges, universities, high schools, private/charter schools

## Idea

Treat each campus **like a city inside its county**.

Compare:

| Base | Meaning |
|------|---------|
| Campus enrollment | City population stand-in |
| County voting-age population (VAP) | County adult civic base (estimate until ACS loaded) |

## Formula

```text
share = campus_enrollment ÷ county_voting_age_population

voter_registration_goal = max(floor, round(county_registration_goal × share))
VCI_goal                 = max(floor, round(county_VCI_goal × share))
```

**VCI** = Vote Civic Involvement (stored as `vote_participation`).

County goals themselves use:

```text
county_registration = max(floor, round(county_VAP × registrationRateOfVap))
county_VCI          = max(floor, round(county_registration × vciShareOfRegistration))
```

…or seeded county targets when present (e.g. Pulaski).

## Data

- Demographics: `data/registry/county-demographics.json` (VAP currently estimated as 76% of total population)
- Engine: `src/lib/position-participation/proportional-goals.ts`

## Not this formula

Launch-team goal (minimum 6) remains separate from registration/VCI.
