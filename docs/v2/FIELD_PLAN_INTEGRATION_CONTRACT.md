# Field Plan Integration Contract

**Status:** 30,000-foot framework ingested — county/city drill-down pending  
**Doctrine:** `docs/v2/ARKANSAS_VICTORY_FIELD_FRAMEWORK.md`  
**Twins:**

- `data/volunteer-command/field-plan-position-contract.json`
- `data/field-plan/victory-field-framework.json`
- `data/field-plan/position-content.json`

## Current rule

Role cards resolve Field Plan content by **role key** (e.g. `event_lead`) from `position-content.json`.  
Scope-specific overrides may appear under `positions` later without route changes.

Where content is still missing, show:

> Detailed responsibilities will be populated from the campaign Field Plan.

## Do not

- Rebuild Volunteer Command / College Command for Field Plan
- Invent county-level venue databases in this slice
- Add new CIWS role cards for Media/Logistics until drill-down requests them

Hierarchy: Field Plan → Domain → Leadership Position → Committee → Phase → Responsibility → Task Template → KPI → Evidence.
