# Chain of Command Doctrine — Volunteer System

**Status:** Scaffold locked 2026-07-14 · V2-A.3  
**Also:** [`GRASSROOTS_LEADERSHIP_CHAIN_OF_COMMAND.md`](./GRASSROOTS_LEADERSHIP_CHAIN_OF_COMMAND.md)  
**Audience first:** Every dashboard answers *Who is this built for?* before *What feature is this?*  
**Staffing:** Purely grassroots — no paid campaign staff. Volunteer Manager is the statewide personnel lead.  
**Tone:** Structure may be disciplined; UI language emphasizes service, responsibility, support, teamwork, and shared leadership — not militaristic imagery.

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
Community / City leads   Institution Leads (colleges; HS/trade/tech bonus)
   ↓                             ↓
Functional Leads / Co-Leads · Working Committees
   ↓
General Volunteers
```

## Rules

1. **Matrix command** — functional and geographic chains both apply; see [`MATRIX_COMMAND_DOCTRINE.md`](./MATRIX_COMMAND_DOCTRINE.md).
2. **Primary functional chain** — every volunteer role has a functional parent toward Volunteer Manager (Director above VM). College Leader → Volunteer Manager; Institution Lead → College Leader.
3. **Geographic coordination** — campuses and county-scoped roles also connect to County Commander (and Cluster Commander above) for territory execution and resources.
4. **Need-to-know dashboards** — a leader only sees scopes they own (county only, education only, function+scope only). No statewide dump for County or College Leaders.
5. **College system under Volunteer Manager** — College Leader Workbench tracks goal-scope post-secondary colleges; high schools and trade/technical schools are bonus coverage, not accountability KPIs. County Commanders support campus needs within their county geography.
6. **Counties under Volunteer Manager** — County Volunteer Commands are parallel functional subordinates, scoped to that county, with geographic reporting through Cluster Commanders.
7. **Area Campaign Leader Dashboard** — when a human holds a leadership assignment, `/leader/{assignmentId}` (and admin inspect) shows only what that position needs; Field Plan responsibilities bind into that shell next phase.
8. **Escalation** — default functional escalation: Institution Lead → College Leader → Volunteer Manager → Director. Geographic escalation: County Commander → Cluster Commander → Campaign Command Manager → Director.
9. **Grassroots wording** — never imply employment hierarchy; this is volunteer chain of command.

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
