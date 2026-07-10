# Phase 2 Build Bible — Digital Arkansas

**Document ID:** PHASE-002.10  
**Artifact:** `PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md`  
**Status:** Canonical  
**Phase 2 Status:** Complete

> **Phase 2 answers:** *What exists?*

---

## Phase 2 Summary

**Name:** Digital Arkansas (formerly Arkansas Organizing Registry)  
**Question answered:** What is the knowledge model of the platform?

The Registry is not a list. It is the **digital map of Arkansas** — a living twin initialized before the first participant arrives.

---

## Step Index (All Complete)

| Step | Document | Core Concept |
|------|----------|--------------|
| 2.1 | [Registry Doctrine](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md) | Registry = source of truth |
| 2.2 | [County Model](COUNTY_REGISTRY_MODEL.md) | 75 organizing homes |
| 2.3 | [Institution Model](INSTITUTION_REGISTRY_MODEL.md) | Canonical campus profile |
| 2.4 | [Relationship Graph](ARKANSAS_RELATIONSHIP_GRAPH.md) | Digital twin — nodes + edges |
| 2.5 | [Status Framework](CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md) | Status-driven OS |
| 2.6 | [Outreach Intelligence](STATEWIDE_OUTREACH_INTELLIGENCE.md) | Mission Board — show gaps |
| 2.7 | [Community Identity](COMMUNITY_IDENTITY_PERSONALIZATION_SYSTEM.md) | Community DNA |
| 2.8 | [Knowledge Governance](KNOWLEDGE_DATA_GOVERNANCE_FRAMEWORK.md) | Knowledge Provenance |
| 2.9 | [Digital Twin Init](ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md) | Arkansas already built |
| 2.10 | This document | Phase closeout + transition |

---

## Registry Artifacts

```
data/registry/
├── counties.json
├── institutions.json
├── relationship-types.json
├── status-framework.json
├── outreach-intelligence.json
├── community-identity.json
├── knowledge-governance.json
├── digital-twin-init.json
└── schemas/
```

---

## Architectural Locks

| Concept | Requirement |
|---------|-------------|
| Graph model | Everything connects [REL-M01] |
| Status-driven UI | Query status, not hard-coded pages [STS-M01] |
| Opportunity-first | Show what you don't have yet [OIS-M01] |
| Community DNA | One renderer, many communities [CID-M13] |
| Knowledge Provenance | Know why we believe facts [KDG-M10] |
| Digital twin init | Ship living Arkansas [ADT-M02] |

---

## Transition — Living Systems

Phase 2 complete. The master plan now organizes around **living systems**, not software modules.

→ [Living Systems Architecture](../master/LIVING-SYSTEMS-ARCHITECTURE.md)  
→ [Participant Journey](../phase-03/PARTICIPANT_JOURNEY.md) — bridge to Phase 3

**Next phase:** Phase 3 — **People**

*The Registry gives people a place. The Network gives people relationships. The Journey gives people purpose.*
