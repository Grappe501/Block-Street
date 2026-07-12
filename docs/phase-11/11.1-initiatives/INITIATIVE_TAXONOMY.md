# Initiative Taxonomy

**Build:** 11.1 · **Wave:** W1 · **Canonical source:** [01_CONSTITUTION.md](01_CONSTITUTION.md)

Machine-readable registry: `data/phase-11/initiative_types.json`

## Classification Rule

One **primary type** per initiative. Secondary characteristics allowed (e.g., Educational + Pilot + Coalition).

## Primary Types

### Program
Continuing or recurring organized body of work. Examples: leadership academy, volunteer program, mentorship program.

### Campaign
Time-bounded goal-oriented effort. Examples: voter registration, fundraising, recruitment, advocacy.

### Project
Bounded deliverable. Examples: website build, curriculum, community report, facility renovation.

### Operation
Coordinated multi-workstream execution under time pressure. Examples: election-day operation, disaster response, major deployment.

### Pilot
Limited test before broader adoption. Requires evaluation and expansion/termination decision.

### Community Response
Immediate community need. Often urgent and safety-sensitive.

### Educational Initiative
Learning or certification primary. Curriculum, cohorts, assessments.

### Research Initiative
Structured inquiry with data governance and evidence outputs.

### Coalition Initiative
Multi-institution shared effort. Detailed mechanics in Build 11.9 (COL-001).

### Institutional Change Initiative
Internal transformation: governance, digital transformation, compliance remediation.

### Emergency Initiative
Expedited activation with recorded authority, scope, expiration, and after-action review.

### Continuous Operating Function
Enduring institutional responsibility (identity ops, member services). Requires owner, mandate, review cycle, succession.

## Governance Classes

| Class | Description |
|-------|-------------|
| 1 — Routine | Low-risk internal |
| 2 — Managed | Multiple teams, moderate resources |
| 3 — Significant | Public impact, substantial resources, partners |
| 4 — High Risk | Sensitive data, youth, legal exposure |
| 5 — Critical | Emergency, public safety, statewide impact |

Default class per type is in `initiative_types.json`. Institution policy may elevate.

## Versus Other Objects

See constitution sections: Initiative vs strategic priority, objective, workstream, mission, task, team, institution, workspace.
