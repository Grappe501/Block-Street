# Arkansas Organizing Registry

The canonical dataset for Gather Arkansas. Every page, map, and dashboard builds on this registry.

## Files

| File | Contents |
|------|----------|
| `counties.json` | 75 Arkansas counties |
| `institutions.json` | Colleges & universities (V1), + trade/jr/high later |

## Institution Schema

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
  "culture": "Flagship public research university; strong Greek life and SEC athletics culture.",
  "representationStatus": "needs_organizer",
  "v1Priority": true,
  "disclaimer": "Independent student organizing network. Not affiliated with or endorsed by the institution."
}
```

## Representation Status

| Status | UI Label | Meaning |
|--------|----------|---------|
| `needs_organizer` | Needs Organizer | Outreach target — no active network |
| `building` | Building | Organizers joining |
| `active` | Active | Recruiting and growing |

## Expansion Order

1. **V1:** 4-year colleges & universities (`v1Priority: true`)
2. **V1.5:** Community colleges
3. **V2:** Trade schools, technical institutes
4. **V3:** High schools (self-registration)

## Legal Note

Never use official logos. Color values are *inspired by* publicly known school colors — not trademark reproductions. Every page includes independence disclaimer.
