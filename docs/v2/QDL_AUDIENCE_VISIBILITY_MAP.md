# QDL Audience Visibility Map

## Modes

| Mode | Who | Entry | Must not leak |
|------|-----|-------|---------------|
| **User experience** | Participant, volunteer | `/home`, `/calendar`, `/network` | Build language, Director chrome |
| **Leadership work** | Leads, managers | `/leader/*`, `/command/*`, `/admin/volunteer-command` | Engineering diagnostics |
| **Director inspection** | Director, operator | `/admin/director`, `/admin?tab=command` | — |
| **Engineering / debug** | Architect, CI | `/admin/calendar/*`, `/ops/*`, audit pages | Ordinary nav links |

## W1 enforcement

- LaunchChrome hides `/start` and `/field-strategy` from member stage
- Legacy SiteHeader/Footer: Director links flagged for audience gating (full gate in W2)
- Build language mapped in `data/qdl/qdl-w1-copy-findings.json`
