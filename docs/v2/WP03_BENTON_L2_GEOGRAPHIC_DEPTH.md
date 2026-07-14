# WP-03 — Benton County L2 Geographic Depth

**Status:** awaiting Field Plan source (skeleton only)  
**Machine twin:** `data/field-plan/depth/l2-geographic-playbooks/benton.json`  
**Layer registry:** `data/field-plan/depth-layers.json` · [`FIELD_PLAN_DEPTH_LAYERS.md`](./FIELD_PLAN_DEPTH_LAYERS.md)

## Purpose

Transform Benton County from a generic county shell into a geographic operating model — using only the real Field Plan and approved doctrine.

## L2 must answer

- What organizing geographies exist inside Benton County?
- Which cities, campuses, precinct groupings, communities, or operating areas belong in the plan?
- Which command owns each geography?
- Which leadership positions are required?
- Which positions are currently vacant?
- What goals are allocated to each geography?
- Which Field Plan responsibilities apply there?
- What does the Director need to inspect?
- What does the Volunteer Manager need to act on?
- What does a local leader need to see today?

## Benton L2 data contract

```text
Benton County
├── County identity and status
├── Geographic operating areas
│   ├── Stable area ID
│   ├── Approved name
│   ├── Area type
│   ├── Included places
│   ├── Parent command
│   └── Source citation
├── Leadership requirements
│   ├── Required position
│   ├── Reporting relationship
│   ├── Vacancy state
│   └── Invite readiness
├── Goal allocations
│   ├── Registration
│   ├── VCI
│   └── Launch team, separately
├── Field Plan responsibilities
├── Task-template references
├── KPI references
├── Evidence expectations
└── Review and approval state
```

## Hard guardrails

Do not:

- Invent Benton County organizing zones
- Infer political doctrine from geography
- Fabricate leadership assignments
- Treat placeholder personnel as real people
- Activate L4 execution
- Create fake task completion data
- Restore the superseded 25% formula
- Present a shell as an operational command board
- Mark invitations certified because a route renders
- Enable sensitive personnel controls without production persistence and RBAC

## Parallel build (with WP-01)

```text
WP-01 establishes:
Who may enter the organization,
how they are assigned,
and whether that assignment can be trusted.

WP-03 establishes:
Where the organization operates,
which positions are needed there,
and what the Field Plan requires.

WP-01 + WP-03 together establish:
A real person can be safely bound
to a real position
inside a real geographic command.
```

Until both are proven, the platform has an increasingly complete organizational model — not yet a certified operating chain.
