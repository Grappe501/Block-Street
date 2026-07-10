# Service Registry

**Document ID:** SRG-001  
**Artifact:** `SERVICE_REGISTRY.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [Domain Service Architecture](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-007 · ENG-DS33]

**Live catalog:** `data/registry/service-registry.json`

> The **architectural map** of the Community Operating System — where every capability lives, what it depends on, and how it communicates.

---

## SRG-M01 — Purpose

**[SRG-M01]** The **Service Registry** catalogs every domain service in the platform.

**[SRG-M01a]** As capabilities are added, developers and AI coding assistants immediately understand:

- Where a feature belongs
- What it depends on
- How it should interact with the rest of the COS

**[SRG-M01b]** Preserves the **modular, domain-driven architecture** from Volume 1 [ENG-003 · ENG-007].

---

## SRG-M02 — Registry Record Schema

**[SRG-M02]** Each service entry includes:

| Field | Description |
|-------|-------------|
| `id` | Stable slug e.g. `community` |
| `name` | Display name |
| `businessPurpose` | One-line capability statement |
| `owningDomain` | Database schema / business domain |
| `implementationPath` | `services/{domain}/` |
| `publicContract` | Path to contracts module |
| `eventsPublished` | Domain event types emitted |
| `eventsConsumed` | Events subscribed to |
| `dependencies` | Other services + kernel capabilities |
| `version` | Contract semver |
| `healthEndpoint` | Observability hook (future) |
| `documentationLinks` | Phase docs · volume refs |
| `maintainer` | Team or role (when applicable) |

---

## SRG-M03 — Registry Operations

**[SRG-M03a]** **Register before merge** — new services add entry to `service-registry.json` [RCN-001].

**[SRG-M03b]** **Update on contract change** — version bump · events list · dependencies.

**[SRG-M03c]** **Admin visibility** — Engineering tab reads registry for live service map (future UI).

**[SRG-M03d]** **AI build validation** — Burt checks feature request against registry ownership before coding.

---

## SRG-M04 — Kernel vs Domain

**[SRG-M04]** Platform Kernel capabilities (`src/lib/kernel/`) are **not** domain services — they appear as `dependencies` on service records:

`identity` · `auth` · `permissions` · `events` · `audit` · `config` · `constitution`

Domain services **consume** kernel — never duplicate kernel logic.

---

## SRG-M05 — V1 Catalog

**[SRG-M05]** Sixteen domain services — full JSON in `data/registry/service-registry.json`:

Identity · Registry · Community · Mission · Experience · Opportunity · Growth · Leadership · Knowledge · Story · Capacity · Partnership · Communication · Intelligence · Search · Media

**[SRG-M05a]** Transitional paths: many services map to existing `src/lib/{domain}/` until `services/` migration per [ENG-003].

---

## SRG-M06 — Example Entry

```json
{
  "id": "community",
  "name": "Community Service",
  "businessPurpose": "Authoritative source for community state, membership, and lifecycle",
  "owningDomain": "community",
  "implementationPath": "services/community/",
  "publicContract": "services/community/contracts/",
  "eventsPublished": ["CommunityCreated", "MembershipChanged", "LeadershipAssigned"],
  "eventsConsumed": ["ParticipantJoined", "GrowthCampaignCompleted"],
  "dependencies": ["identity", "registry", "leadership", "kernel/events", "kernel/permissions"],
  "version": "1.0.0",
  "documentationLinks": ["COS-001", "CCN-001", "ENG-DS09"]
}
```

---

## AC-092 — Acceptance Criteria

- [x] **[AC-092a]** Registry purpose and record schema documented. `[SRG-M02]`
- [x] **[AC-092b]** Operations and kernel distinction defined. `[SRG-M03, M04]`
- [x] **[AC-092c]** V1 catalog populated for all 16 services. `[service-registry.json]`

---

**End of Service Registry.**
