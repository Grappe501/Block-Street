# Execution State Machines

**Protocol:** CAE-11.2-W3 · **Source:** `state-machines.ts`, `objective_state_machines.json`

Enforced by `ExecutionValidationService.assert*Transition` in validation pipeline.

Objective: Draft → Proposed → Approved → Ready → Active → … → Archived

Mission: Planned → Ready → Active → Completed → Archived

Task: Draft → Assigned → Active → Completed → Archived

Illegal shortcuts (e.g. Draft → Approved) rejected at domain layer.
