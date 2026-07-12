# Command API Reference

All writes use typed commands via W3 `ExecutionDomainService`.

## Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/objectives` | `CreateObjective` |
| `POST /api/v1/objectives/commands` | Any `ExecutionCommandType` |
| `POST /api/v1/objectives/{id}/actions/{action}` | Lifecycle slug → command |

## Lifecycle Actions

| Slug | Command |
|------|---------|
| `propose` | ProposeObjective |
| `approve` | ApproveObjective |
| `activate` | ActivateObjective |
| `archive` | ArchiveObjective |

High-impact actions (`activate`, `approve`, `archive`) require `Idempotency-Key` header.

## Command Types

CreateObjective, ProposeObjective, ApproveObjective, ActivateObjective, ArchiveObjective, CreateMission, AssignMission, StartMission, CompleteMission, CreateTask, AssignTask, CompleteTask, AttachEvidence, RecordOutcome.
