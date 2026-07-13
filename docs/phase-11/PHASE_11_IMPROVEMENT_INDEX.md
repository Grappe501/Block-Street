# Phase 11 Improvement Index

**Subsystem:** KNW-OPT-001 (Build 11.12-W7)

## Improvement Commands

| Command | Layer | Description |
|---------|-------|-------------|
| CreateImprovementCandidate | W7 governance | Create governed improvement candidate |
| TriageImprovementCandidate | W7 governance | Triage with advance/defer/reject |
| CreateImprovementProposal | W7 governance | Formal proposal with measurement plan |
| ApproveImprovementPilot | W7 governance | Authorize isolated pilot |
| ApproveImprovementAdoption | W7 governance | Authorize implementation |
| BeginImprovementImplementation | W7 → W3 | Dispatch domain command |
| RecordImprovementOutcome | W7 outcomes | Benefit realization |
| CreateAIImprovementProposal | W7 AI | Governed AI change proposal |

## Improvement Events

| Event | Trigger |
|-------|---------|
| improvement.candidate_created | New candidate from W6 or Human |
| improvement.proposal_created | Proposal advanced from candidate |
| improvement.pilot_started | Pilot scope activated |
| improvement.pilot_stopped | Stop condition or failure |
| improvement.implementation_completed | W3 command succeeded |
| improvement.outcome_recorded | Post-implementation review |
| improvement.institutionalized | Successful cycle closed |
| AI.improvement_proposed | Tutor/intelligence feedback |

## Registry

`data/phase-11/knowledge_improvement_registry.json` — 8 improvement types with authority, pilot policy, and domain commands.
