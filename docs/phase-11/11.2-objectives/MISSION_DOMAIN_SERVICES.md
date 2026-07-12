# Mission Domain Services

**Protocol:** CAE-11.2-W3

| Service | Responsibility |
|---------|----------------|
| MissionLifecycleService | planned → ready → active → completed |
| MissionAssignmentService | AssignMission command |
| MissionCompletionService | CompleteMission |
| MissionDependencyService | Blocking dependency evaluation |

Parent Objective must not be Draft for StartMission.
