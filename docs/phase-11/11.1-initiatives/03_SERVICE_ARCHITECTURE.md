# Initiative Service Architecture

**Build:** 11.1 · **Wave:** W3 · **Subsystem:** INI-SVC-001  
**Wave ID:** CAE-11.1-W3  
**Governed by:** [01_CONSTITUTION.md](01_CONSTITUTION.md), [02_DATA_MODEL.md](02_DATA_MODEL.md)

## Mission

One authoritative Initiative Service Engine enforces constitutional rules from W1 and canonical records from W2. All mutations pass through typed commands; read models stay separate.

## Layering

```text
Interface (HTTP, jobs — W4/W5)
        ↓
InitiativeApplicationService  — coordinates commands
        ↓
InitiativeDomainService       — lifecycle, charter, ownership, dependencies
        ↓
Policy / Charter / Owner / Dependency engines
        ↓
Repository + Event outbox
```

## Code Map

| Module | Path |
|--------|------|
| Application layer | `src/lib/civic-action/builds/11.1/services/application-service.ts` |
| Domain engine | `src/lib/civic-action/builds/11.1/services/domain-service.ts` |
| Commands | `services/commands.ts` |
| Policy | `services/policy.ts` |
| Charter validation | `services/charter-validator.ts` |
| Ownership | `services/owner-eligibility.ts` |
| Dependencies | `services/dependency-graph.ts` |
| Persistence | `services/repository.ts` |
| Events | `services/events.ts` |

## Domain Authority Rule

Direct client status changes, generic CRUD activation, and bypassing charter validation are prohibited. `assertInitiativeMutationViaService()` guards against non-service mutation paths.

## Query Separation

Mutation services do not serve dashboard projections. Query services (portfolio, history, readiness) are planned for W4/W5.

## Certification

See [WAVE_3_CERTIFICATION.md](WAVE_3_CERTIFICATION.md). Run `npm run phase11:11.1:w3`.
