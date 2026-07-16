# Matrix Command Doctrine

**Status:** Scaffold locked 2026-07-15 · V2-A.4 extension  
**Twin:** `data/volunteer-command/chain-of-command.json` · `data/volunteer-command/geographic-clusters.json`  
**Also:** [`CHAIN_OF_COMMAND_DOCTRINE.md`](./CHAIN_OF_COMMAND_DOCTRINE.md)

## Two command dimensions

Campaign work runs on **two legitimate reporting chains** at once:

| Dimension | Question | Examples |
|-----------|----------|----------|
| **Functional** | How do we do the work? | Outreach, Social Media, Volunteer Manager, Events, Registration, Education |
| **Geographic** | Where does the work happen? | Cluster → County → City / Campus / Community |

Functional managers own **standards, training, procedures, metrics, and best practices** statewide.

Geographic commanders own **execution within their territory** — resources, coordination, and local readiness.

## Matrix reporting

Many field leaders hold **dual reporting**:

```text
Henderson State Registration Chair
  ├── Operationally (geographic) → Clark County Commander
  └── Professionally (functional) → State Registration Director / College Leader chain
```

- The **County Commander** asks: *How is registration progressing in Clark County?*
- The **Registration Director** asks: *Are you following statewide registration standards?*

Both questions are valid. The software must represent both links without collapsing them into a flat committee list.

## Functional chain (Volunteer Manager subtree)

```text
Campaign Commander
├── Campaign Manager
├── Outreach Manager
├── Social Media Manager
├── Volunteer Manager
│   ├── Events Command
│   ├── Voter Registration Command
│   ├── Education Command
│   │     ├── College Command
│   │     └── High School Command
│   ├── Volunteer Training
│   ├── Leadership Development
│   └── Volunteer Placement
└── Campaign Command Manager
```

## Geographic chain

```text
Campaign Command
├── Cluster Commander (≈5 clusters · ~15 counties each)
│   └── County Commander
│         ├── Community Command
│         ├── County Volunteer Command
│         ├── County Outreach
│         ├── County Events
│         ├── County Registration
│         └── County Education
└── Additional clusters…
```

## College ↔ County connection

Post-secondary colleges sit **inside county geography**. Therefore:

- **College Leader** reports **functionally** to Volunteer Manager (Education Command).
- **Institution leads and campus functional chairs** report **functionally** through College Leader / statewide function directors.
- The same campus roles report **operationally** to the **County Commander** for their county — resources, local coordination, and county readiness.
- County Commanders may inspect campus progress within their county; College Leader retains statewide education standards.

## Executive Command Council

Senior functional and geographic leads coordinate through a five-seat executive team:

```text
Campaign Commander
├── Campaign Manager
├── Outreach Manager
├── Social Media Manager
├── Volunteer Manager
└── Campaign Command Manager
```

The Campaign Manager workbench sits at the center of the matrix — campaign health, county readiness, volunteer readiness, registration, events, outreach, and drill-down into any subordinate workbench.

## Rules

1. **Matrix command** — dual reporting is explicit in registries; do not hide geographic links behind functional-only trees.
2. **Primary escalation** — functional chain remains the default escalation path unless a geographic emergency requires County or Cluster Commander.
3. **Need-to-know dashboards** — unchanged; matrix links are navigation and accountability, not permission to dump unrelated scopes.
4. **Grassroots wording** — command structure supports service and shared leadership; avoid militaristic UI chrome.

## Related

- `data/volunteer-command/leadership-role-registry.json`
- `src/lib/volunteer-command/matrix-command.ts`
