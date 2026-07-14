# V1-CERT-PASS-01 — Vision-to-Implementation Audit Protocol

**Protocol ID:** `V1-CERT-PASS-01`  
**Program:** Version 1.0 Certification  
**Pass:** 1 of 10  
**Operating mode:** `READ · INSPECT · TRACE · TEST · CLASSIFY · REPORT`  
**Default repair posture:** `NO REPAIRS DURING AUDIT`

This document is the canonical Pass 1 protocol adopted 2026-07-14.  
Product implementation must not change during this pass except for audit-enabling, read-only tooling.

## Constitutional principle

> A capability is not built merely because code, documentation, routes, schemas, or components exist.  
> A capability is built only when the intended Human can use it through a complete, governed, working experience.

## Classification vocabulary

```text
CERTIFIED PRESENT
PARTIALLY IMPLEMENTED
SCAFFOLDED ONLY
DOCUMENTED ONLY
DUPLICATED OR CONFLICTING
IMPLEMENTED DIFFERENTLY
BROKEN
MISSING
INTENTIONALLY DEFERRED
REMOVE FROM V1
```

## Six-axis scores (0–4)

Existence · Integration · Human Experience · Governance · Reliability · Launch Readiness

**Certified Present** requires:

```text
Existence ≥ 3, Integration ≥ 3, Human Experience ≥ 2,
Governance ≥ 3, Reliability ≥ 2, Launch Readiness ≥ 2
```

## Implementation modes

```text
Production-backed | Development-backed | Local-only | Mock-backed
Fixture-backed | Static demo | Placeholder | Documentation-only | Missing
```

## Artifacts

Human-readable docs under `docs/v1-certification/`.  
Machine-readable under `data/v1-certification/`.  
Runner: `npm run v1:cert:pass1` / `npm run v1:cert:pass1:all`.

## Hard boundaries

No feature implementation, UI redesign, schema changes, permission changes, production behavior changes, or Version 2 planning during Pass 1.

Pass 2 begins only after Steve accepts the Pass 1 certification record.
