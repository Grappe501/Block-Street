# Arkansas Organizing Registry (AOR)

> **The Registry is not a list. It is the digital map of Arkansas.**  
> If it doesn't exist in the Registry, it doesn't exist in the platform.

**Authority doctrine:** [docs/phase-02/ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md](../../docs/phase-02/ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md)  
**Architecture:** Graph of interconnected entities (counties **contain** institutions, etc.) — formalized in Step 2.4.

Every page, map, and dashboard builds on this Registry.

## Files

| File | Contents |
|------|----------|
| `counties.json` | 75 Arkansas counties (minimal bootstrap — full model in Step 2.2) |
| `schemas/county-record.schema.json` | JSON Schema for canonical county graph node |
| `institutions.json` | Colleges & universities (partial bootstrap — full Canonical Profile in Step 2.3) |
| `relationship-types.json` | Canonical relationship type catalog (PHASE-002.4) |
| `status-framework.json` | Lifecycles, status categories, dashboard queries (PHASE-002.5) |
| `outreach-intelligence.json` | Mission Board, opportunity types, dashboard levels (PHASE-002.6) |
| `schemas/status-transition.schema.json` | Status timeline transition records |

## Requirements

| ID | Requirement |
|----|-------------|
| REG-001 | Arkansas County Registry |
| CNTY-002 | County Registry Model (PHASE-002.2) |
| INST-003 | Institution Registry Model (PHASE-002.3) |
| REL-001 | Arkansas Relationship Graph (PHASE-002.4) |
| STS-001 | Status & Lifecycle Framework (PHASE-002.5) |
| OIS-001 | Outreach Intelligence & Mission Board (PHASE-002.6) |
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
