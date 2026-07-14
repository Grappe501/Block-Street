# Evidence index — CAL-P1 Gate A (Shadow Persistence)

| Artifact | Purpose | Status |
|----------|---------|--------|
| `status.json` | Machine-readable Gate A verdict | **OPEN** |
| `../../../../docs/calendar/CAL_P1_GATE_A_SHADOW_PERSISTENCE_REPORT.md` | Human report | OPEN / awaiting DB |
| `probe.json` | Output of `calendar:db:probe` | Pending live target |
| `migrate.json` | Output of `calendar:db:migrate` | Pending |
| `seed-import.json` | First + second import results | Pending |
| `shadow-compare.json` | Pre/post restart and redeploy compares | Pending |
| `rollback-rehearsal.json` | Safe rehearsal DB only | Pending |
| `counts.json` | Event / scope / duplicate / audit counts | Pending |

Do not mark Gate A **CLOSED** until `status.json` → `verdict: "CLOSED"` with all acceptance flags true and no secrets in evidence files.
