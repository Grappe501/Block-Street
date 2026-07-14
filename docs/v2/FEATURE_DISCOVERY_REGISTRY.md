# Feature Discovery Registry

**Status:** Canonical · accepted 2026-07-14  
**Purpose:** Prevent “where did we put that?” as capabilities grow into the thousands.  
**Machine ledger:** `data/registry/feature-discovery-registry.json`

Every capability is classified by:

| Field | Meaning |
|-------|---------|
| **id** | Stable feature id |
| **title** | Human name |
| **audience** | Participant → … → Architect (see Audience Sectioning) |
| **journey** | Related journey id(s) from Product Certification Registry |
| **product** | Surface family (Launch, Network, Field, Operator, LIX, …) |
| **phase** | Build/phase reference |
| **certification** | not_started · implemented · pending_cert · certified_present |
| **nav** | Where a human finds it (route or “docs only”) |
| **keywords** | Search terms |
| **dependsOn** | Other feature ids |
| **owner** | Role or named owner |

## Doctrine

1. New capabilities **must** register here before claiming ship.
2. Operator Command and Assurance Dashboard read this ledger.
3. Certification state here must not exceed Product Certification Registry for linked journeys.
4. Audience field is mandatory — no “everyone sees everything” entries without justification.

## Seed inventory

See JSON for seed rows covering Launch path, Operator Command, and core hubs. Expand additively — never delete shipping ids; mark `status: deprecated` instead.
