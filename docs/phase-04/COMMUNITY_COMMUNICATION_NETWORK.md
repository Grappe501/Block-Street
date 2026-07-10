# Community Communication Network

**Document ID:** PHASE-004.7  
**Artifact:** `COMMUNITY_COMMUNICATION_NETWORK.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System  
**Acronym:** CCNET

> **Communication should build stronger communities—not create more noise.**

Most platforms build **messaging**. ASYON builds a **Communication Network** — one of the major platform engines.

Messaging is one piece. Announcements, knowledge sharing, discussions, mentorship, AI assistance, broadcasts, emergency alerts, and office hours are others. **Everything is communication.**

**Requirement:** CCNET-001 *(distinct from CCN-001 Community Constitution)*

**Builds On:** [Communication & Attention Management](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) · [Community Command Center](COMMUNITY_COMMAND_CENTER.md) · [Team & Working Group System](TEAM_WORKING_GROUP_SYSTEM.md) · [Mission & Project System](MISSION_PROJECT_SYSTEM.md) · [Relationship Graph](../phase-02/REGISTRY_RELATIONSHIP_MODEL.md)

**Live spec:** `data/registry/community-communication-network.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CCNET-M01 | Purpose |
| CCNET-M02 | Guiding principle |
| CCNET-M03 | Philosophy |
| CCNET-M04 | Communication types |
| CCNET-M05 | Communication spaces |
| CCNET-M06 | Mission-centered communication |
| CCNET-M07 | Knowledge preservation |
| CCNET-M08 | Attention management integration |
| CCNET-M09 | Search |
| CCNET-M10 | Moderation |
| CCNET-M11 | Cross-community communication |
| CCNET-M12 | Future AI assistance |
| CCNET-M13 | Conversation Graph architecture |
| CCNET-M14 | Platform integrations |
| CCNET-M15 | V1 scope |
| CCNET-BG | Burt implementation guidance |
| AC-040 | Step 4.7 acceptance criteria |

---

## CCNET-M01 — Purpose

**[CCNET-M01]** The **Community Communication Network (CCNET)** provides the **communication infrastructure** connecting participants, teams, missions, campuses, counties, and statewide initiatives.

**[CCNET-M01a]** Objectives:

- Create **meaningful conversations**
- **Reduce information overload**
- Strengthen **relationships**
- **Preserve knowledge**
- **Coordinate action**

**[CCNET-M01b]** CCNET is a **major platform engine** — not a messaging feature bolted onto communities.

**[CCNET-M01c]** Layering:

| Layer | Requirement | Role |
|-------|-------------|------|
| **Attention policy** | [CAM-001] | Who gets notified, when, how much |
| **Communication network** | CCNET-001 | Channels, content, graph, knowledge |
| **Transport** | MSG-001 (Phase 5) | Delivery infrastructure |

---

## CCNET-M02 — Guiding Principle

**[CCNET-M02]**

> **Communication should build stronger communities—not create more noise.**

**[CCNET-M02a]** **Every communication should have purpose** — aligned with CAM-M02a [CAM-001].

**[CCNET-M02b]** Complementary principles:

| Source | Principle |
|--------|-----------|
| CAM-001 | Earn attention. Never abuse it. |
| PEL-M13 | Does this strengthen relationships and belonging? |
| CGS-M07 | Knowledge preserved — not lost in threads |
| CCN-001 | People create culture; platform provides structure |

---

## CCNET-M03 — Philosophy

**[CCNET-M03]** Communication is **not one feature**. It is a **network** connecting every part of the platform.

**[CCNET-M03a]** Every message should answer:

| Question | Purpose |
|----------|---------|
| **Who needs this?** | Audience — relationship-aware [REL-001] |
| **Why does it matter?** | Purpose — mission-connected [MPS-001] |
| **What action is expected?** | Clarity — not noise |
| **When is it relevant?** | Timing — TSOS + CAM [TSOS-001, CAM-001] |

**[CCNET-M03b]** Communication modes are **typed** — announcements behave differently from discussions, broadcasts differently from direct messages [CCNET-M04].

---

## CCNET-M04 — Communication Types

**[CCNET-M04]** Multiple communication modes:

### Direct Conversations

Private participant-to-participant communication.

- Questions · Mentorship · Planning · Coordination · Relationship building

### Community Conversations

Open discussions within campus, county, team, mission, volunteer team, regional collaboration, future alumni networks.

**Digital gathering places** for communities.

### Announcements

**One-way** communication — distinct from conversations:

- Leadership updates · Meeting reminders · Volunteer opportunities · Project launches · Celebrations

### Discussion Threads

Organized conversations around topics:

- Project planning · Volunteer logistics · Community questions · Ideas · Feedback · Resources

**Knowledge grows through discussion** [CCNET-M07].

### Broadcasts

Large-scale communications — **used intentionally**:

- Statewide updates · County-wide · Campus notices · Emergency communications

### Community Stories

Narrative communication:

- Volunteer experiences · Project highlights · Success stories · Lessons learned · Photo journals

**Stories build culture** [CRA-001, CLS-001].

---

## CCNET-M05 — Communication Spaces

**[CCNET-M05]** Every community **automatically receives** communication channels:

| Default space | Purpose |
|---------------|---------|
| General Discussion | Open community dialogue |
| Announcements | Official updates |
| Questions | Ask and answer |
| Volunteer Coordination | Service logistics |
| Events | Event-related comms |
| Leadership | Organizer coordination |
| Resources | Shared knowledge links |

**[CCNET-M05a]** Communities may **create additional spaces** as needed — configurable, not hardcoded.

**[CCNET-M05b]** **Separate communication channels from communities** — channels are entities linked to community graph nodes [CCNET-BG].

---

## CCNET-M06 — Mission-Centered Communication

**[CCNET-M06]** Every mission receives **dedicated communication** [MPS-001]:

- Planning · Volunteer coordination · Files · Updates · Questions · Celebrations

**[CCNET-M06a]** **Conversations remain connected to the work** — mission context always visible; never generic platform-wide chat divorced from purpose.

**[CCNET-M06b]** Mission Headquarters includes communication spaces [MPS-M06] — scoped to mission timeline and team.

---

## CCNET-M07 — Knowledge Preservation

**[CCNET-M07]** Important discussions should **become knowledge** — not disappear into old message threads.

**[CCNET-M07a]** Examples promoted to knowledge:

- Frequently asked questions
- Best practices
- Meeting summaries
- Lessons learned
- Decision history

**[CCNET-M07b]** Orchestrator: `promoteDiscussionToKnowledge(threadId)` — links thread to Community Knowledge Base [4.8, KDG-001].

**[CCNET-M07c]** Connects to Mission reflection [MPS-M12] and institutional memory [CGS-M07].

---

## CCNET-M08 — Attention Management Integration

**[CCNET-M08]** CCNET integrates with [Communication & Attention Management](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) [CAM-001].

**[CCNET-M08a]** Participants control:

- Subscriptions
- Notification frequency
- Quiet hours
- Digest preferences

**[CCNET-M08b]** **CCNET produces content; CAM governs delivery** — never bypass Attention Budget [CAM-M13].

**[CCNET-M08c]** Communication remains **participant-centered** — opt-in where appropriate; relationship-aware defaults [REL-001].

---

## CCNET-M09 — Search

**[CCNET-M09]** All communication should be **searchable**.

**[CCNET-M09a]** Participants find:

- Messages · Announcements · Resources · Meeting notes · Projects · Community stories

**[CCNET-M09b]** **Knowledge becomes discoverable** — search indexes Conversation Graph nodes [CCNET-M13], not just raw text.

---

## CCNET-M10 — Moderation

**[CCNET-M10]** Communities have **moderation capabilities**:

| Capability | Purpose |
|------------|---------|
| Community guidelines | Shared norms [CCN-001] |
| Reporting | Safety escalation [SEC-001, TPS-M12] |
| Content review | Leader oversight |
| Role-based moderation | Distributed leadership [TWG-M09] |
| Conflict resolution | Healthy dialogue |

**[CCNET-M10a]** Moderation **protects healthy participation** while encouraging open dialogue — not censorship of dissent.

**[CCNET-M10b]** Constitutional alignment [CCN-M08]: moderation protects shared responsibility.

---

## CCNET-M11 — Cross-Community Communication

**[CCNET-M11]** Participants communicate **across communities** when appropriate:

- Campus collaborating with county
- Teams working together
- Regional initiatives
- Shared volunteer projects

**[CCNET-M11a]** Platform **encourages collaboration rather than isolation** [SCN-001, TWG-M13].

**[CCNET-M11b]** Cross-community threads are **typed graph edges** — visible to authorized participants only [SEC-001].

---

## CCNET-M12 — Future AI Assistance

**[CCNET-M12]** Future AI may assist by:

- Summarizing discussions
- Highlighting unanswered questions
- Identifying action items
- Suggesting resources
- Connecting similar conversations

**[CCNET-M12a]** AI **supports conversations without replacing human relationships** [PEL-M13, CAM-M15].

**[CCNET-M12b]** AI outputs link to Conversation Graph — auditable, not black-box replacements for community dialogue.

---

## CCNET-M13 — Conversation Graph Architecture

**[CCNET-M13]** **Signature feature.** Platform graph family:

| Graph | Purpose |
|-------|---------|
| Relationship Graph | [REL-001] — who knows whom |
| Growth Graph | [PGL-001] — how people develop |
| Trust Graph | [SEC-001, TPS-001] — safety and privacy |
| Personal Digital Twin | [PDT-001] — participant context |
| **Conversation Graph** | **What happened because people talked** |

**[CCNET-M13a]** The platform shouldn't merely **store messages**. It should **understand conversations**.

**[CCNET-M13b]** Example chain:

```
Conversation → belongs to Mission
Mission → belongs to Team
Team → belongs to Campus
Discussion → produced 3 Decisions
Decision → launched new Mission
Mission → became statewide Initiative
```

**[CCNET-M13c]** Node types: `conversation`, `thread`, `message`, `decision`, `outcome`, `mission`, `team`, `community`, `participant`, `resource`.

**[CCNET-M13d]** Institutional memory depth:

> Communities don't just remember **what was said**.  
> They remember **what happened because people talked to each other**.

**[CCNET-M13e]** Orchestrator: `queryConversationGraph(nodeId, depth)` — traverse from any entity to related conversations, decisions, outcomes.

**[CCNET-M13f]** Aligns with: preserve knowledge [CGS-M07], strengthen relationships [PEL-M13], future organizers stand on prior work [CCN-M14].

**[CCNET-M13g]** V1: graph schema spec + stub queries; full graph population post-messaging implementation.

---

## CCNET-M14 — Platform Integrations

**[CCNET-M14]** CCNET integrates across the platform:

| Consumer | Integration |
|----------|-------------|
| Community Command Center Feed [CCC-M10] | Curated announcements + stories |
| Team communication [TWG-M10] | Team-scoped channels |
| Mission updates [MPS-001] | Mission-scoped channels |
| Morning Brief [PCC-M17] | Unread highlights, not raw feed |
| Community Pulse [CCC-M20] | "Three new announcements this week" |
| Time OS [TSOS-001] | Meeting follow-ups, schedule change notices |
| Attention policy [CAM-001] | All delivery governed by preferences |

**[CCNET-M14a]** Community Feed widget is a **CCNET view** — filtered projection, not separate message store.

---

## CCNET-M15 — V1 Scope

**[CCNET-M15]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| CCNET philosophy & types | Documented — this step |
| Conversation Graph spec | Schema + stub |
| Announcements stub | Static feed on CCC |
| Feed widget | Placeholder content |
| Full messaging | Phase 5 / v1.1 |

**[CCNET-M15a]** Deferred: real-time messaging, AI summarization, full search index, broadcast emergency system.

---

## CCNET-BG — Burt Implementation Guidance

**[CCNET-BG]** Implementation should:

1. **Separate communication channels from communities** — channels as graph-linked entities
2. **Support multiple communication types** — typed content model [CCNET-M04]
3. **Maintain searchable history** — index for discovery [CCNET-M09]
4. **Preserve discussion context** — thread → mission → team → community chain
5. **Integrate notification preferences** — CAM-001 gate on all delivery [CCNET-M08]
6. **Support future AI summarization** — Conversation Graph as AI context source [CCNET-M12]

**[CCNET-BG-a]** Recommended file structure:

```
src/lib/ccnet/queryConversationGraph.ts
src/lib/ccnet/promoteDiscussionToKnowledge.ts
src/lib/ccnet/assembleCommunityFeed.ts
src/components/ccc/widgets/FeedWidget.tsx
data/registry/community-communication-network.json
```

**[CCNET-BG-b]** Database: `communication_channels`, `threads`, `messages`, `conversation_graph_edges` — messages never orphaned from context nodes.

---

## AC-040 — Acceptance Criteria

Step 4.7 is complete when:

- [x] **[AC-040a]** Community Communication Network philosophy documented. `[CCNET-M01, CCNET-M03]`
- [x] **[AC-040b]** Multiple communication modes defined. `[CCNET-M04, CCNET-M05]`
- [x] **[AC-040c]** Knowledge preservation incorporated. `[CCNET-M07]`
- [x] **[AC-040d]** Search and moderation principles established. `[CCNET-M09, CCNET-M10]`
- [x] **[AC-040e]** Conversation Graph architecture specified. `[CCNET-M13]`
- [x] **[AC-040f]** CAM and platform integrations documented. `[CCNET-M08, CCNET-M14]`
- [x] **[AC-040g]** Burt has blueprint for communication as platform-wide network. `[CCNET-BG, community-communication-network.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Messages → Conversations → Decisions → Missions → Outcomes → institutional memory deeper than any chat log*
