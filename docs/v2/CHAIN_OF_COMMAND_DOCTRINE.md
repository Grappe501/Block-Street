# Chain of Command Doctrine — Volunteer System

**Status:** Scaffold locked 2026-07-14  
**Audience first:** Every dashboard answers *Who is this built for?* before *What feature is this?*  
**Staffing:** Purely grassroots — no paid campaign staff. Volunteer Manager is the statewide personnel lead.

## Military-style chain (personnel)

```text
Campaign Director (inspect / final authority)
        ↓
Volunteer Manager          ← overall personnel management for the campaign
        ↓
   ┌────┼────────────────────────┐
   ↓    ↓                        ↓
County Volunteer Lead    College Leader / Education Organizing Lead
   ↓    ↓                        ↓
Community / City leads   Institution Leads (college & high school)
   ↓                             ↓
Functional Leads / Co-Leads · Working Committees
   ↓
General Volunteers
```

## Rules

1. **Unity of command** — every volunteer role reports through exactly one primary parent toward Volunteer Manager (Director above VM).
2. **Need-to-know dashboards** — a leader only sees scopes they own (county only, education only, function+scope only). No statewide dump for County or College Leaders.
3. **College system under Volunteer Manager** — College Leader Workbench and education leaderboards are subordinate commands, not peer systems to Volunteer Command.
4. **Counties under Volunteer Manager** — County Volunteer Commands are parallel subordinates, scoped to that county.
5. **Area Campaign Leader Dashboard** — when a human holds a leadership assignment, `/leader/{assignmentId}` (and admin inspect) shows only what that position needs; Field Plan responsibilities bind into that shell next phase.
6. **Escalation** — College Leader / County Lead escalate to Volunteer Manager; VM escalates to Director.
7. **Grassroots wording** — never imply employment hierarchy; this is volunteer chain of command.

## Field Plan hook (next phase)

```text
Field Plan position key
  → Leadership assignment
    → Area Campaign Leader Dashboard sections
      → Committee + phase responsibilities
        → Tasks / KPIs / evidence
```

Until Field Plan county drill-down lands, shells show placeholders — not invented doctrine.

## Related

- `data/volunteer-command/chain-of-command.json`
- `data/volunteer-command/leadership-role-registry.json`
- `data/volunteer-command/dashboard-config-registry.json`
- `docs/v2/AUDIENCE_SECTIONING_DOCTRINE.md`
