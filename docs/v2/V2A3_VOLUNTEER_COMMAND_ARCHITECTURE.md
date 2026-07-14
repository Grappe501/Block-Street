# V2-A.3 — Volunteer Command Architecture

Volunteer Command is the statewide grassroots **personnel** workbench.

```text
Campaign Director
└── Volunteer Manager (/admin/volunteer-command)
    ├── County Volunteer Command
    ├── Education Volunteer Command → College Leader Workbench
    ├── Statewide Functional Commands
    └── Volunteer Intake & Development
```

College Leader does **not** disappear; it is a specialized subordinate command.

Persistence today: Netlify Blobs + static seed. Personnel shell actions that lack proven durability remain labeled scaffold / disabled.

Machine registries:

- `data/volunteer-command/leadership-role-registry.json`
- `data/volunteer-command/access-matrix.json`
- `data/volunteer-command/dashboard-config-registry.json`
- `data/volunteer-command/field-plan-position-contract.json`
