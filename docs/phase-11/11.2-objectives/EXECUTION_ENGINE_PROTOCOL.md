# Execution Engine Protocol

**Protocol:** CAE-11.2-W3 · **Subsystem:** OBJ-SVC-001

## Mission

Transform the canonical execution model into a living execution engine. W2 defined what execution objects are; W3 defines how they behave.

## Constitutional doctrine

Execution is governed, not edited. Humans request actions; the Domain Layer determines lawfulness.

## Sole mutation path

`ExecutionDomainService.execute()` — `src/lib/civic-action/builds/11.2/services/execution-engine.ts`

No UI, API, automation, AI, or script may bypass this engine.

## Engine scope

Objective → Key Result → Workstream → Mission → Milestone → Deliverable → Task → Evidence → Outcome

## Core responsibilities

Lifecycle, ownership, permission, dependency, parent-child validation, traceability, events, versions, audit, notifications (via events), orchestration hooks.
