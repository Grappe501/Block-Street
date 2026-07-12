# Initiative Lifecycle Constitution

**Build:** 11.1 · **Wave:** W1 · **Canonical source:** [01_CONSTITUTION.md](01_CONSTITUTION.md)

Wave 2 implements detailed states and transitions. This document establishes constitutional meaning.

## Lifecycle Flow

```text
Concept → Discovery → Design → Approval → Preparation → Active
  → Paused / At Risk → Closing → Completed or Cancelled → Archived
```

## State Meanings

### Concept
Idea not validated. Allowed: draft purpose, initial owner, discovery notes. Not allowed: public launch, broad resource allocation, mobilization, official communication.

### Discovery
Investigate need, stakeholders, evidence, feasibility, risk. Outputs: problem statement, stakeholder input, feasibility, recommendation.

### Design
Develop structure: charter, scope, owners, timeline, preliminary objectives, dependencies, approval requirements.

### Approval
Outcomes: approved, approved with conditions, returned for revision, rejected, deferred. Rejected drafts preserved with decision record.

### Preparation
Approved but not fully active. Team assignment, objectives, workstreams, calendar, resources, safety, communications, partner agreements.

### Active
Requires: eligible owner, approved charter, institution context, timeline, review rhythm, objective or operating mandate, safety approvals, audit capability.

### Paused
Temporarily stopped. Retains ownership, records, obligations, audit history.

### At Risk
Execution continues with documented substantial concerns. Not a substitute for explaining risk.

### Closing
Closeout underway: mission closure, resource return, communications, evidence, outcomes, financial close, partner closeout, archival, after-action review.

### Completed
Met approved closeout basis. Categories: as planned, with adjustments, partially completed, pilot concluded, transitioned to continuous operation, replaced by successor.

### Cancelled
Ended before planned completion. Records authority, reason, obligations, Human impact, resource disposition, data retention, lessons.

### Archived
Non-operational; available for audit, learning, evidence, playbooks, compliance per retention policy.

## Restoration

Archived/cancelled/completed initiatives are not simply reactivated. Path: restoration request → need review → owner/scope review → new approval → restored version or successor initiative.

## Dependency Types

```text
must_begin_before · must_complete_before · provides_resource · provides_data
provides_authority · provides_training · provides_technology · provides_partnership
blocks_activation · blocks_completion
```

Circular dependencies must be detected and block activation until resolved.

Entity implementation: **11.1-W2** (`InitiativeStatus`, `InitiativeTimeline`, `InitiativeHistory`).
