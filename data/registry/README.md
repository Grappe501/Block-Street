# Arkansas Organizing Registry

> **Canonical data foundation for ASYON.**  
> Authority doctrine: [docs/phase-02/ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md](../../docs/phase-02/ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md)  
> Phase 2 index: [docs/phase-02/README.md](../../docs/phase-02/README.md)

Every page, map, and dashboard builds on this registry.

## Files

| File | Contents |
|------|----------|
| `counties.json` | 75 Arkansas counties (minimal schema — formal model in Step 2.2) |
| `institutions.json` | Colleges & universities (formal model in Step 2.3) |

## Requirements

| ID | Requirement |
|----|-------------|
| REG-001 | Arkansas County Registry |
| REG-002 | Arkansas Institution Registry |
| REG-003 | Registry Purpose & Authority Doctrine |

## Institution Schema (Preliminary)

Formal schema defined in Step 2.3. Current bootstrap fields:

```json
{
  "slug": "ua-fayetteville",
  "name": "University of Arkansas",
  "shortName": "U of A",
  "type": "university",
  "sector": "public",
  "hbcu": false,
  "city": "Fayetteville",
  "county": "washington",
  "founded": 1871,
  "enrollment": 32140,
  "website": "https://uark.edu",
  "colors": { "primary": "#9D2235", "secondary": "#FFFFFF" },
  "culture": "Brief publicly sourced summary.",
  "representationStatus": "needs_organizer",
  "v1Priority": true,
  "disclaimer": "Independent student organizing network. Not affiliated with or endorsed by the institution."
}
```

## Representation Status (Preliminary)

Full system in Step 2.5. Current V1 values:

| Status | Meaning |
|--------|---------|
| `needs_organizer` | Outreach target — no active network |
| `building` | Organizers joining |
| `active` | Recruiting and growing |

## Expansion Order

1. **V1:** 4-year colleges & universities
2. **V1.5:** Community colleges
3. **V2:** Trade schools, technical institutes
4. **V3:** High schools (self-registration)

## Legal Note

Never use official logos. Color values are *inspired by* publicly known school colors — not trademark reproductions. Full rules in Step 2.7.
