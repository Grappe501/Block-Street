# Personal Relationship Network

**Document ID:** PHASE-003.4  
**Artifact:** `PERSONAL_RELATIONSHIP_NETWORK.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Every participant owns a living network.**

Most CRMs belong to organizations. This network belongs to the **participant**. That is a profound difference — and potentially the platform's signature feature.

**Builds On:** [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) · [Personal Headquarters](PARTICIPANT_PROFILE_SYSTEM.md) · [Arkansas Relationship Graph](../phase-02/ARKANSAS_RELATIONSHIP_GRAPH.md) · [Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md)

**Live spec:** `data/registry/personal-relationship-network.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PRN-M01 | Purpose |
| PRN-M02 | Guiding principle |
| PRN-M03 | Philosophy |
| PRN-M04 | Automatic network creation |
| PRN-M05 | The network is personal |
| PRN-M06 | Relationship types |
| PRN-M07 | Relationship strength |
| PRN-M08 | Network growth |
| PRN-M09 | Network dashboard |
| PRN-M10 | QR code system [NET-003] |
| PRN-M11 | Invitation philosophy [NET-002] |
| PRN-M12 | Relationship timeline |
| PRN-M13 | Network health |
| PRN-M14 | Community integration |
| PRN-M15 | Future capabilities |
| PRN-M16 | Trust Graph architecture |
| PRN-M17 | HQ integration [PHQ-M08] |
| PRN-M18 | V1 scope |
| PRN-BG | Burt implementation guidance |
| AC-023 | Step 3.4 acceptance criteria |

---

## PRN-M01 — Purpose

**[PRN-M01]** This document defines the **Personal Relationship Network** — the foundational organizing engine of the platform.

**[PRN-M01a]** Every participant **automatically receives** a personal relationship network upon registration [NET-001].

**[PRN-M01b]** The Personal Relationship Network is **not simply a referral system**. It is a living representation of the **trusted relationships** a participant develops throughout their organizing journey.

**[PRN-M01c]** The platform grows through **people, one relationship at a time** [CP-008, OM-L2].

**[PRN-M01d]** Terminology: use **Personal Relationship Network** (not "Personal Network System" or "contact list"). Relationships — not contacts — are what we build.

---

## PRN-M02 — Guiding Principle

**[PRN-M02]**

> **Every relationship has the potential to strengthen a community.**

**[PRN-M02a]** The software should encourage **meaningful human connections** rather than transactional recruitment [PEP-M13, OIS-M14].

**[PRN-M02b]** Complementary principle:

> **Every participant owns a living network** — it belongs to them, not to the organization.

---

## PRN-M03 — Philosophy

**[PRN-M03]** Participants do **not** "collect users."

**[PRN-M03a]** Participants **build communities**.

**[PRN-M03b]** Every invitation is the **beginning of a relationship** — not a conversion metric.

**[PRN-M03c]** Every relationship contributes to the strength of **Arkansas's organizing network** [REL-M10].

**[PRN-M03d]** Anti-patterns to avoid:

| Avoid | Prefer |
|-------|--------|
| Leaderboards by recruit count | Celebrate connection and collaboration |
| "Add contacts" | Invite someone to organize together |
| CRM ownership model | Participant-owned network |
| Transactional invites | Personal, relationship-first invitations |

---

## PRN-M04 — Automatic Network Creation

**[PRN-M04]** Immediately after registration, the platform creates **without setup**:

| Asset | ID pattern | V1 |
|-------|------------|-----|
| Personal Network ID | `NET-{uuid}` | ✅ |
| Network Dashboard | My Network section [PHQ-M08] | ✅ |
| Invitation URL | `/s/{slug}` [NET-002] | ✅ |
| QR Code | encodes invitation URL [NET-003] | ✅ |
| Relationship Timeline | append-only history | seed on first invite |
| Network Analytics | size, activity, health | basic counts |
| Growth Timeline | network over time | stub |
| Future Mentorship Tree | derived from `mentors` edges | future |

**[PRN-M04a]** **No setup required.** Every participant begins with the **same opportunity** [PEP-M11].

**[PRN-M04b]** Provisioning hook: `createPersonalNetwork(participantId)` runs in registration transaction [USR-001].

---

## PRN-M05 — The Network Is Personal

**[PRN-M05]** Each participant **owns** their network. It reflects real-world relationships:

| Category | Examples |
|----------|----------|
| Personal | My Friends · My Classmates · My Family |
| Community | My Neighbors · My Coworkers · My Organizations |
| Organizing | My Volunteers · My Mentors |

**[PRN-M05a]** The network is a **view over the participant's relationship subgraph** [REL-M10b] — not a separate silo of data.

**[PRN-M05b]** Categories are **organizational lenses** — filters over typed edges, not separate databases.

---

## PRN-M06 — Relationship Types

**[PRN-M06]** Relationships are **typed graph edges** [REL-M12]. Canonical types:

| Type | Edge key | Meaning | V1 |
|------|----------|---------|-----|
| Invited | `invited` / `invited_by` | Referral chain | ✅ |
| Connected | `connected_to` | Mutual network membership | ✅ |
| Mentored | `mentors` | Mentorship direction | future |
| Volunteer Partner | `volunteered_with` | Shared service | future |
| Committee Member | `member_of` | Shared committee | future |
| Project Collaborator | `collaborates_on` | Shared project | future |
| Campus Friend | `attends` + `connected_to` | Same institution | partial |
| County Connection | `resides_in` + `connected_to` | Same county | partial |
| Alumni Connection | `graduated_from` | Shared alumni | future |
| Professional Connection | `professional_with` | Career pathway | future |

**[PRN-M06a]** Additional relationship types may be introduced over time **without schema break** — extend enum + metadata [REL-M12].

**[PRN-M06b]** V1 implements: `invited_by`, `invited`, `connected_to` [REL-M13].

---

## PRN-M07 — Relationship Strength

**[PRN-M07]** Relationships **naturally develop** through shared experience. Strength is **descriptive**, not competitive:

| Stage | Meaning | Signals |
|-------|---------|---------|
| **Introduced** | Invitation sent or accepted | `invited_by` edge created |
| **Connected** | Both participants active | profile complete, both logged in |
| **Active** | Regular platform engagement | events, discussions |
| **Collaborating** | Shared work | committee, project, volunteer |
| **Mentoring** | Development relationship | `mentors` edge |
| **Long-Term** | Sustained engagement over time | anniversary, multi-year |

**[PRN-M07a]** The platform recognizes relationship maturity **without turning it into a competition** [PEP-M13].

**[PRN-M07b]** Strength is stored as **edge metadata** (`relationshipStrength`, `lastSharedActivity`) — computed by Trust Graph orchestrator [PRN-M16].

---

## PRN-M08 — Network Growth

**[PRN-M08]** Networks grow **organically** — each participant develops their own organizing community:

```text
Alex
├── Jordan
│     ├── Maya
│     ├── Ethan
│     └── Ava
├── Chris
│     ├── Emma
│     └── Liam
└── Sofia
```

**[PRN-M08a]** Tree visualization is a **view** over `invited_by` edges — not a separate hierarchy table.

**[PRN-M08b]** Depth is unlimited; breadth celebrates **connection**, not rank.

**[PRN-M08c]** Cross-ref Step 3.5 Recruitment Engine for attribution analytics and welcome flow.

---

## PRN-M09 — Network Dashboard

**[PRN-M09]** Every participant sees in **My Network** [PHQ-M08]:

| Element | Description |
|---------|-------------|
| Network size | Total connected relationships |
| New relationships | Recent joins via invite |
| Recent activity | Invites, accepts, shared events |
| Mentorship | Mentors and mentees (future) |
| Growth timeline | Network expansion over time |
| Community impact | Contribution through network |
| Suggested connections | Graph-based introductions (future) |
| Relationship anniversaries | Future celebration |

**[PRN-M09a]** The dashboard should **celebrate connection** — warm copy, never shame for small networks.

**[PRN-M09b]** Step 3.6 Network Board adds **depth widgets** within this section; HQ provides the shell [PHQ-M08a].

---

## PRN-M10 — QR Code System [NET-003]

**[PRN-M10]** Every participant automatically receives:

| Asset | V1 |
|-------|-----|
| Permanent share URL | ✅ `/s/{slug}` |
| Dynamic QR Code | ✅ encodes share URL |
| Downloadable graphics | future |
| Printable cards | future |
| Event check-in capability | future |

**[PRN-M10a]** The QR code becomes the participant's **portable organizing identity** — scannable at tabling, classrooms, events.

**[PRN-M10b]** QR regenerates if slug changes; URL remains permanent per participant.

**[PRN-M10c]** Mobile-first: large display, one-tap share, copy link [PHQ-M17].

---

## PRN-M11 — Invitation Philosophy [NET-002]

**[PRN-M11]** Invitations should feel **personal**:

| Message tone | Example |
|--------------|---------|
| Join my network | "Join my network — let's organize together." |
| Campus | "Help strengthen our campus." |
| County | "Help strengthen our county." |
| Relationship | "I'd love for you to be part of what we're building." |

**[PRN-M11a]** Emphasis is **relationship — not marketing** [PRN-M03b].

**[PRN-M11b]** Share link landing page [PAGE-SHARE] shows inviter name, mission snippet, county/campus context — never generic spam.

**[PRN-M11c]** Pre-filled invite copy is **suggested**, always editable by participant.

---

## PRN-M12 — Relationship Timeline

**[PRN-M12]** Every relationship has a **history** — append-only [KDG-M07, STS-M16]:

| Event | Timeline entry |
|-------|----------------|
| Invitation sent | `relationship.invite_sent` |
| Joined | `relationship.joined` |
| First event together | `relationship.first_event` |
| First committee | `relationship.first_committee` |
| Volunteer project | `relationship.first_volunteer` |
| Mentorship | `relationship.mentorship_started` |
| Shared milestones | cross-ref JRN-M07 |

**[PRN-M12a]** The platform **remembers relationships over time** — feeds Civic Passport [CPP-001] and Trust Graph [PRN-M16].

**[PRN-M12b]** V1: `invite_sent` + `joined` events on `relationship_events` table.

---

## PRN-M13 — Network Health

**[PRN-M13]** Rather than emphasizing **size alone**, consider:

| Health signal | Weight |
|---------------|--------|
| Active participation | High |
| Volunteer involvement | High |
| Shared projects | High |
| Mentorship | High |
| Events together | Medium |
| Long-term engagement | Medium |
| Community building | High |

**[PRN-M13a]** **Healthy relationships matter more than large numbers** [OIS-M14, PRN-M02].

**[PRN-M13b]** Network health score is **private to the participant** — never public leaderboard.

**[PRN-M13c]** V1: display size + "active this month" count; full health orchestrator in v1.1.

---

## PRN-M14 — Community Integration

**[PRN-M14]** Relationships connect participants to communities:

```
Participant ──connected_to──► Participant
     │                              │
     ├── resides_in ──► County ◄────┤
     ├── attends ──► Institution    │
     ├── member_of ──► Committee     │
     ├── collaborates_on ──► Project │
     └── attended ──► Event          │
```

**[PRN-M14a]** The Personal Relationship Network is the **bridge between individuals and communities** [OM-L2 → OM-L3].

**[PRN-M14b]** Inviting someone strengthens **both** personal network and county/campus community simultaneously.

---

## PRN-M15 — Future Capabilities

**[PRN-M15]** Architecture anticipates without requiring redesign:

- Relationship mapping · Shared interests · Suggested introductions
- Mentor matching · Volunteer matching · Professional networking
- Alumni networking · Career pathways

**[PRN-M15a]** All powered by **Trust Graph** traversal [PRN-M16] + Participant Knowledge Graph [Step 3.12].

---

## PRN-M16 — Trust Graph Architecture

**[PRN-M16]** Introduce the **Trust Graph** — the platform's defining relational innovation.

> Most platforms know **who is connected**. This platform understands **how people have grown together**.

**[PRN-M16a]** A Trust Graph does **not rank people**. It records the **history of collaboration** between them:

| Trust signal | Example |
|--------------|---------|
| Invited by | Direct referral edge |
| Shared projects | Worked on three projects together |
| Committee service | Served on the same committee |
| Volunteer service | Volunteered together |
| Events attended | Attended five events together |
| Mentorship | Mentor relationship established |
| Multiplication | Introduced two new organizers |

**[PRN-M16b]** Trust is **context and depth** — not a score to compete on [PEP-M13].

**[PRN-M16c]** Trust Graph structure:

```
TrustGraph
├── nodes: Participant[]
├── edges: RelationshipRecord[] (typed, with metadata)
├── trustSignals: TrustSignal[] (derived, append-only)
└── orchestrator: buildTrustContext(participantA, participantB) → TrustContext
```

**[PRN-M16d]** Over time, Trust Graph powers:

| Capability | Step |
|------------|------|
| Better team recommendations | 3.13 |
| Mentor matching | 3.13 |
| Project staffing | Phase 5 |
| Community resilience analysis | Phase 6 |
| Smarter introductions | 3.13 |
| Meaningful AI assistance | Phase 6 |

**[PRN-M16e]** V1: store `invited_by` + `connected_to` edges; trust orchestrator returns edge list. Full signal derivation in v1.1.

**[PRN-M16f]** Cross-ref [REL-M10], [REL-M12] — Trust Graph is the **participant-centric layer** over the Arkansas Relationship Graph.

---

## PRN-M17 — HQ Integration [PHQ-M08]

**[PRN-M17]** Personal Relationship Network lives in **My Network** section of Personal Headquarters [PHQ-001].

| HQ element | Network source |
|------------|----------------|
| People invited | `invited` edge count |
| Share link + QR | `networks.share_slug` |
| Growth timeline | network analytics |
| Quick Actions | Invite, Share QR [PHQ-M14] |

**[PRN-M17a]** Aggregator: `assembleNetworkSection(participantId)` called by `assembleHeadquarters()` [PHQ-M18c].

**[PRN-M17b]** Deep network views may expand inline or navigate to `/hq/network` — never a separate competing home.

---

## PRN-M18 — V1 Scope

**[PRN-M18]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| Auto network on registration | `NET-{uuid}`, slug, QR |
| Share URL | `/s/{slug}` [NET-002] |
| QR code | Display + copy [NET-003] |
| Invite attribution | `invited_by` edge [Step 3.5] |
| Network dashboard | Size, invite list, share tools |
| Relationship timeline | invite_sent + joined |
| Trust Graph | Edge storage; basic context |
| HQ integration | My Network section populated |

**[PRN-M18a]** Deferred: mentorship tree, health score, anniversaries, printable QR, event check-in.

---

## PRN-BG — Burt Implementation Guidance

**[PRN-BG]** Implementation should:

1. **Generate every network automatically** on registration — zero setup [PRN-M04]
2. **Assign permanent Network IDs** — `NET-{uuid}`, immutable
3. **Separate relationship data from participant identity** — edges in `DB-RELATIONSHIPS`, identity in `DB-USERS` [REL-M14]
4. **Preserve historical relationships** — never delete; archive status [REL-M12]
5. **Support future relationship types** — extensible enum + metadata
6. **Optimize for mobile sharing** — QR prominent, one-tap copy [PHQ-M17]
7. **Avoid gamifying recruitment** — no public leaderboards [PRN-M03d]

**[PRN-BG-a]** Recommended file structure:

```
src/lib/network/createPersonalNetwork.ts    # Registration hook
src/lib/network/assembleNetworkSection.ts   # HQ aggregator
src/lib/trust/buildTrustContext.ts          # Trust Graph orchestrator
src/components/hq/sections/NetworkSection.tsx
src/app/s/[slug]/page.tsx                   # Share landing [PAGE-SHARE]
data/registry/personal-relationship-network.json
```

**[PRN-BG-b]** Database tables:

| Table | Purpose |
|-------|---------|
| `networks` | Network ID, owner, slug, created_at [DB-NETWORKS] |
| `relationships` | Typed edges [DB-RELATIONSHIPS] |
| `relationship_events` | Timeline append-only |
| `referrals` | Attribution audit [DB-REFERRALS] |

**[PRN-BG-c]** API: `GET /api/network/[slug]` [API-NETWORK-001] · share resolution [API-NETWORK-002]

---

## AC-023 — Acceptance Criteria

Step 3.4 is complete when:

- [x] **[AC-023a]** Every participant automatically receives a Personal Relationship Network. `[PRN-M04]`
- [x] **[AC-023b]** Relationship philosophy documented — not transactional recruitment. `[PRN-M02, PRN-M03]`
- [x] **[AC-023c]** Network structure, types, strength, and lifecycle defined. `[PRN-M06, PRN-M07, PRN-M08]`
- [x] **[AC-023d]** QR code and invitation concepts incorporated. `[PRN-M10, PRN-M11]`
- [x] **[AC-023e]** Trust Graph architecture specified. `[PRN-M16]`
- [x] **[AC-023f]** HQ integration documented. `[PRN-M17]`
- [x] **[AC-023g]** Burt has blueprint for core relational organizing engine. `[PRN-BG, personal-relationship-network.json]`

---

**Next Step:** 3.5 — Recruitment Engine (NET-002/003 attribution depth)

*Trace: USR-001 registration → createPersonalNetwork() → invited_by edges → Trust Graph → HQ My Network → Civic Passport timeline*
