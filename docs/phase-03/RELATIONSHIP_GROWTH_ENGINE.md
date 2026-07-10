# Relationship Growth Engine

**Document ID:** PHASE-003.5  
**Artifact:** `RELATIONSHIP_GROWTH_ENGINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Communities grow one trusted relationship at a time.**

This is where the platform becomes **self-expanding** — not through campaigns, but through **relationships**. The software does not ask "How do we acquire more users?" It asks **"How do we help participants invite people they already trust?"**

**Builds On:** [Personal Relationship Network](PERSONAL_RELATIONSHIP_NETWORK.md) · [Personal Headquarters](PARTICIPANT_PROFILE_SYSTEM.md) · [Participant Journey](PARTICIPANT_JOURNEY.md) · [Growth Model](../build-steps/PHASE-001.6-GROWTH-MODEL.md)

**Live spec:** `data/registry/relationship-growth-engine.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| RGE-M01 | Purpose |
| RGE-M02 | Guiding principle |
| RGE-M03 | Philosophy |
| RGE-M04 | Automatic invitation toolkit |
| RGE-M05 | Multiple invitation methods |
| RGE-M06 | Invitation experience |
| RGE-M07 | Personalized landing experience |
| RGE-M08 | Referral attribution |
| RGE-M09 | Invitation lifecycle |
| RGE-M10 | Community growth |
| RGE-M11 | Relationship growth analytics |
| RGE-M12 | Smart recommendations |
| RGE-M13 | Healthy growth principles |
| RGE-M14 | Growth milestones |
| RGE-M15 | Organizing Circles architecture |
| RGE-M16 | PRN & HQ integration |
| RGE-M17 | V1 scope |
| RGE-BG | Burt implementation guidance |
| AC-024 | Step 3.5 acceptance criteria |

---

## RGE-M01 — Purpose

**[RGE-M01]** This document defines the **Relationship Growth Engine** — the system that helps participants invite others, expand their network, strengthen communities, and develop future organizers.

**[RGE-M01a]** Growth occurs through **relationships** rather than mass marketing [CP-008, OM-L2].

**[RGE-M01b]** Terminology: use **Relationship Growth Engine** (not "Recruitment Engine"). Recruitment is one **outcome**; the real goal is **healthy community growth through trusted human connections**.

**[RGE-M01c]** The engine makes the platform **self-expanding** — every participant is a growth node with tools ready on day one [PRN-M04].

---

## RGE-M02 — Guiding Principle

**[RGE-M02]**

> **Communities grow one trusted relationship at a time.**

**[RGE-M02a]** Every invitation should **strengthen a real-world connection** [PRN-M03b].

**[RGE-M02b]** The platform exists to make inviting others **simple, welcoming, and meaningful** — not to optimize vanity metrics.

---

## RGE-M03 — Philosophy

**[RGE-M03]** The objective is **not viral growth**.

**[RGE-M03a]** The objective is **healthy growth**.

**[RGE-M03b]** The strongest communities develop through:

| Foundation | Platform encouragement |
|------------|------------------------|
| **Trust** | Trust Graph context [PRN-M16] |
| **Friendship** | Personal invitation copy [RGE-M06] |
| **Shared purpose** | Mission on landing page [RGE-M07] |
| **Service** | Volunteer invite prompts (future) |
| **Collaboration** | Committee/project invites (future) |

**[RGE-M03c]** Anti-patterns:

| Avoid | Prefer |
|-------|--------|
| "Acquire users" | Help invite people you trust |
| Campaign blast mindset | One relationship at a time |
| Viral loops / spam incentives | Welcoming, mentoring, serving |
| Generic signup pages | Personalized introductions [RGE-M07] |

---

## RGE-M04 — Automatic Invitation Toolkit

**[RGE-M04]** Every participant automatically receives [PRN-M04]:

| Asset | Requirement | V1 |
|-------|-------------|-----|
| Personal Invite URL | NET-002 | ✅ |
| QR Code | NET-003 | ✅ |
| Share Card | RGE-M04 | basic preview |
| Digital Business Card | future | — |
| Printable Materials | future | — |

**[RGE-M04a]** **Everything necessary to begin inviting others immediately** — zero configuration [PEP-M11].

**[RGE-M04b]** Toolkit surfaced in HQ Quick Actions + My Network [PHQ-M08, PHQ-M14].

---

## RGE-M05 — Multiple Invitation Methods

**[RGE-M05]** Participants may invite through:

| Method | V1 |
|--------|-----|
| QR Code | ✅ |
| Direct Link | ✅ |
| In-Person Events | ✅ (show QR) |
| Printed Materials | future |
| Email | future |
| Text Message | future |
| Social Sharing | future |
| NFC cards | future |

**[RGE-M05a]** The invitation experience should **adapt to different organizing styles** — tabling, dorm visits, class announcements, family conversations.

**[RGE-M05b]** All methods resolve to the same **personalized landing** [RGE-M07] with attribution preserved [RGE-M08].

---

## RGE-M06 — Invitation Experience

**[RGE-M06]** The invitation process should feel **personal** [PRN-M11]:

| Tone | Example copy |
|------|--------------|
| Network | "Join my organizing network." |
| Campus | "Let's strengthen our campus." |
| County | "Help build our county." |
| Together | "Come organize with us." |

**[RGE-M06a]** Language emphasizes **belonging rather than marketing** [PRN-M03d].

**[RGE-M06b]** Suggested copy is **editable** — participant voice, not platform template.

**[RGE-M06c]** Share Card preview shows inviter name + mission snippet before sending.

---

## RGE-M07 — Personalized Landing Experience

**[RGE-M07]** When someone follows an invitation (`/s/{slug}` [PAGE-SHARE]), they see an **introduction**, not a generic registration page:

| Element | Privacy control |
|---------|-----------------|
| Inviter's first name | Always (or display name) |
| Campus or county | Public affiliation |
| Personal Mission | Optional — inviter chooses |
| Why they joined | Optional snippet |
| How they hope to help | Optional snippet |
| Shared community | County/campus context |

**[RGE-M07a]** Every invitation feels like **an introduction from a trusted person**.

**[RGE-M07b]** CTA: "Join [Name]'s network" → registration flow with `referrer` pre-filled [USR-001].

**[RGE-M07c]** V1 minimum: inviter name + county/campus + join CTA.

---

## RGE-M08 — Referral Attribution

**[RGE-M08]** The platform records — **always visible** to participants:

| Field | Storage |
|-------|---------|
| Who invited whom | `invited_by` edge [REL-M13] |
| When | `relationship_events` timestamp |
| How | `invite_method` metadata (qr, link, print…) |
| Invitation status | lifecycle state [RGE-M09] |
| Future campaign attribution | `campaign_id` optional metadata |

**[RGE-M08a]** Attribution creates **Trust Graph signal** [PRN-M16] — never hidden from inviter or invitee.

**[RGE-M08b]** Table: `referrals` [DB-REFERRALS] — audit trail separate from graph edges.

**[RGE-M08c]** On registration: `createReferralAttribution(inviterId, inviteeId, method)` → `invited_by` edge + timeline event [PRN-M12].

---

## RGE-M09 — Invitation Lifecycle

**[RGE-M09]** Canonical lifecycle — supports analytics **without becoming intrusive**:

```
Invitation Created
      ↓
   Shared
      ↓
   Viewed
      ↓
  Registered
      ↓
  Verified (future)
      ↓
  Connected
      ↓
Community Member
      ↓
Future Organizer
```

| State | Meaning | V1 |
|-------|---------|-----|
| `created` | Invite URL/QR generated | ✅ implicit |
| `shared` | Participant copied/shared link | optional track |
| `viewed` | Landing page hit | ✅ |
| `registered` | Invitee completed signup | ✅ |
| `verified` | Optional identity check | future |
| `connected` | Both active on platform | ✅ |
| `community_member` | Engaged in county/campus | journey signal |
| `future_organizer` | Contributor+ stage | journey signal |

**[RGE-M09a]** State transitions append to `invitation_events` — never overwrite [KDG-M07].

**[RGE-M09b]** Participants see lifecycle for **their invitations** — not others' private funnels.

---

## RGE-M10 — Community Growth

**[RGE-M10]** Every invitation strengthens **multiple communities simultaneously**:

```
Participant invite
      │
      ├──► Personal Network (inviter's PRN)
      ├──► Campus Network (if shared institution)
      ├──► County Network (shared county)
      └──► Statewide Growth (Arkansas graph)
```

**[RGE-M10a]** One trusted invitation can activate **personal, local, and statewide** layers [REL-M09].

**[RGE-M10b]** County and campus dashboards (Phase 4) aggregate invitation-derived growth — never individual leaderboard [OIS-M14].

---

## RGE-M11 — Relationship Growth Analytics

**[RGE-M11]** Participants see in My Network / Growth views:

| Metric | Emphasis |
|--------|----------|
| New connections | Recent joins |
| Active relationships | Engaged this month |
| Communities growing | County/campus contribution |
| Invitation success | Viewed → registered rate (private) |
| Mentorship opportunities | future |
| Suggested follow-up | "Check in with Jordan" |

**[RGE-M11a]** Analytics should **encourage thoughtful engagement** — not spam optimization.

**[RGE-M11b]** **Private to participant** — no public recruit rankings [PRN-M13b, PEP-M13].

**[RGE-M11c]** V1: connections count + recent invites list + simple viewed/registered counts.

---

## RGE-M12 — Smart Recommendations

**[RGE-M12]** Future versions may recommend (Step 3.13):

- People who share interests · Nearby participants
- Committees needing help · Events · Volunteer opportunities
- Potential mentors · Relationship opportunities

**[RGE-M12a]** Recommendations **always respect participant privacy** [SEC-001, Step 3.7].

**[RGE-M12b]** Organizing Circles [RGE-M15] enable contextual questions without mass messaging.

---

## RGE-M13 — Healthy Growth Principles

**[RGE-M13]** The platform should **reward**:

| Behavior | Recognition |
|----------|-------------|
| Welcoming people | Growth milestone [RGE-M14] |
| Helping people | Impact section [PHQ-M12] |
| Mentoring people | Journey stage signal [JRN-M05] |
| Supporting communities | County/campus contribution |
| Building lasting relationships | Trust Graph depth [PRN-M16] |

**[RGE-M13a]** The platform should **avoid incentives** that encourage spam or low-quality invitations:

- No points for raw invite count alone
- No public leaderboards by recruits
- No automated bulk messaging (future channels require opt-in)

---

## RGE-M14 — Growth Milestones

**[RGE-M14]** Milestones celebrate **contribution, not competition** [JRN-M07, OIS-M14]:

| Milestone | Trigger |
|-----------|---------|
| First invitation | Share link copied or QR shown |
| First new participant | First `registered` lifecycle |
| Five connected friends | 5 `connected` relationships |
| First committee formed | future |
| First volunteer recruited | future |
| First mentorship | future |
| County milestone | future — community level |
| Campus milestone | future — community level |

**[RGE-M14a]** Milestones append to **Civic Passport** [CPP-001] — narrative stamps, not badges to compete over.

**[RGE-M14b]** V1: `first_invitation`, `first_invite_accepted` (cross-ref JRN-M07 `first_invite_accepted`).

---

## RGE-M15 — Organizing Circles Architecture

**[RGE-M15]** Introduce **Organizing Circles** — a signature feature for intuitive, real-life network organization.

> Instead of a flat contact list, participants organize their network into **Circles** that reflect real life.

**[RGE-M15a]** Example circles (participant-defined, private):

| Circle | Use case |
|--------|----------|
| Friends | General outreach |
| Classmates | "Who from Biology hasn't joined?" |
| Dorm | Residential organizing |
| Student Organization | Club members |
| Church | Faith community |
| Coworkers | Workplace connections |
| Family | Personal invites |
| Volunteer Team | Service network |
| Debate Club · Intramural · Environmental Group | Interest-based |

**[RGE-M15b]** Circles are **private to the participant** — not visible to org admins or other users without explicit share.

**[RGE-M15c]** Circle membership is **organizational metadata** on relationships — not a separate social graph:

```
Circle
├── id: CIR-{uuid}
├── ownerParticipantId
├── label: "Biology Class"
├── members: RelationshipRecord[] (references, not copies)
└── metadata: { course, semester, notes }
```

**[RGE-M15d]** Future platform questions circles enable:

- "Who from my Biology class hasn't joined yet?"
- "Which volunteer friends are interested in this project?"
- "Who in my church circle is already active?"

**[RGE-M15e]** This is **not surveillance or mass messaging** — it helps participants **organize outreach for relationships they already have** [RGE-M02].

**[RGE-M15f]** V1: schema + UI placeholder; manual circle creation in v1.1. Seed with suggested circle templates on first visit.

---

## RGE-M16 — PRN & HQ Integration

**[RGE-M16]** Relationship Growth Engine integrates with:

| System | Integration |
|--------|-------------|
| Personal Relationship Network [PRN-M04] | Toolkit assets, attribution edges |
| Personal Headquarters [PHQ-M08] | My Network + Quick Actions |
| Trust Graph [PRN-M16] | Attribution + shared activity signals |
| Journey [JRN-M07] | Connector stage on first successful invite |
| Civic Passport [CPP-001] | Growth milestones as timeline stamps |

**[RGE-M16a]** Aggregator: `assembleGrowthSection(participantId)` — called by `assembleNetworkSection()` and HQ [PHQ-M18c].

**[RGE-M16b]** Registration hook chain:

```
register(participant)
  → createPersonalNetwork()      [PRN-M04]
  → createInvitationToolkit()    [RGE-M04]
  → attributeReferral(referrer)  [RGE-M08]
  → recordLifecycleEvent()       [RGE-M09]
  → checkGrowthMilestones()      [RGE-M14]
```

---

## RGE-M17 — V1 Scope

**[RGE-M17]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| Invitation toolkit | URL + QR + copy link |
| Personalized landing | Inviter name + county/campus + CTA |
| Referral attribution | `invited_by` + `referrals` audit |
| Lifecycle tracking | viewed + registered |
| Growth analytics | Connection count, recent invites |
| Healthy growth guardrails | No leaderboards documented + enforced |
| Growth milestones | first invitation + first accepted |
| Organizing Circles | Schema spec; templates placeholder |

**[RGE-M17a]** Deferred: email/SMS/social channels, share cards download, verified state, full circle UI, smart recommendations.

---

## RGE-BG — Burt Implementation Guidance

**[RGE-BG]** Implementation should:

1. **Generate invitation assets automatically** on network creation [RGE-M04]
2. **Support permanent invite URLs** — slug immutable [NET-002]
3. **Generate QR codes dynamically** from share URL [NET-003]
4. **Track invitation relationships** — edges + lifecycle events [RGE-M08, RGE-M09]
5. **Separate invitation data from participant identity** — `referrals` table vs `users` [REL-M14]
6. **Design for future communication channels** — email, SMS, social as plugins [RGE-M05]

**[RGE-BG-a]** Recommended file structure:

```
src/lib/growth/createInvitationToolkit.ts
src/lib/growth/attributeReferral.ts
src/lib/growth/trackInvitationLifecycle.ts
src/lib/growth/assembleGrowthSection.ts
src/lib/circles/                          # Organizing Circles (v1.1)
src/app/s/[slug]/page.tsx                 # Personalized landing [PAGE-SHARE]
src/components/hq/sections/NetworkSection.tsx
data/registry/relationship-growth-engine.json
```

**[RGE-BG-b]** API endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/network/[slug]` | Resolve inviter for landing [API-NETWORK-001] |
| `POST /api/network/invite` | Track share event [API-NETWORK-002] |
| `POST /api/users/register` | Attribution on signup [API-USERS-001] |

**[RGE-BG-c]** Avoid gamifying recruitment — enforce RGE-M13 guardrails in UI copy and analytics design.

---

## AC-024 — Acceptance Criteria

Step 3.5 is complete when:

- [x] **[AC-024a]** Relationship Growth Engine philosophy documented. `[RGE-M01, RGE-M03]`
- [x] **[AC-024b]** Invitation methods and lifecycle defined. `[RGE-M05, RGE-M09]`
- [x] **[AC-024c]** Personalized invitation experiences incorporated. `[RGE-M06, RGE-M07]`
- [x] **[AC-024d]** Referral attribution and healthy growth principles established. `[RGE-M08, RGE-M13]`
- [x] **[AC-024e]** Organizing Circles architecture specified. `[RGE-M15]`
- [x] **[AC-024f]** Growth milestones and community growth model documented. `[RGE-M10, RGE-M14]`
- [x] **[AC-024g]** Burt has blueprint for relationship-driven expansion. `[RGE-BG, relationship-growth-engine.json]`

---

**Next Step:** 3.6 — Network Board (depth widgets within My Network)

*Trace: PRN auto-network → RGE toolkit → personalized landing → invited_by → Trust Graph → journey Connector stage → Civic Passport milestone*
