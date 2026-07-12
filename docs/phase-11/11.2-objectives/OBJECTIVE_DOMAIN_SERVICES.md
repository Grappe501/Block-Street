# Objective Domain Services

**Protocol:** CAE-11.2-W3

| Service | Responsibility |
|---------|----------------|
| ObjectiveLifecycleService | State transitions |
| ObjectiveCreationService | CreateObjective command |
| ObjectiveApprovalService | Propose/Approve |
| ObjectiveActivationService | Activate with ownership gates |
| ObjectiveArchiveService | Archive with child checks |
| ObjectiveReviewService | Review rhythm (W5+) |
| ObjectiveOwnershipService | Owner validation |

Implemented in `execution-engine.ts` objective handlers.
