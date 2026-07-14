# Role-Scoped Dashboard Doctrine

Every dashboard answers: **what does this person need to know and do because of their position?**

- Higher roles see subordinate rollups.
- Lower roles do not see unrelated higher-level data.
- Sections are registry-driven (`dashboard-config-registry.json` + role registry).
- College Leader: education only.
- County Volunteer Lead: assigned county only.
- Volunteer Manager: statewide volunteer workforce.
- Director: complete platform, inspection read-only by default.
