# Invitation & Connection System

**Document ID:** PHASE-006.7  
**Artifact:** `INVITATION_CONNECTION_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** ICS

> **Every invitation is an invitation into a community—not just a platform.**

From the beginning: every participant has a QR code, every participant has a personal share link, growth happens through trusted relationships. Step 6.7 is not just an invitation system — it is the **front door to the entire platform**. The invitation is only the beginning; the goal is the **relationship that follows**.

**Requirement:** ICS-001 · **Planned alias superseded:** INV-001 · **Extends:** [Relationship Growth Engine RGE-001](../phase-03/RELATIONSHIP_GROWTH_ENGINE.md) · [Share Link & Invitation NET-002](../phase-03/) · [Personal Organizing Network PON-001](PERSONAL_ORGANIZING_NETWORK.md) · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** RGE-001 · NET-001 · NET-002 · PON-001 · [Welcome & Belonging WBS-001](WELCOME_BELONGING_SYSTEM.md) · [Community Growth & Outreach CGO-001](COMMUNITY_GROWTH_OUTREACH_SYSTEM.md) · [Trust & Privacy SEC-001](../phase-03/TRUST_PRIVACY_DIGITAL_SAFETY.md)

**Live spec:** `data/registry/invitation-connection-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| ICS-M01 | Purpose |
| ICS-M02 | Guiding principle |
| ICS-M03 | Philosophy |
| ICS-M04 | Invitation Types |
| ICS-M05 | Invitation Identity |
| ICS-M06 | Invitation Landing Pages |
| ICS-M07 | QR Code System |
| ICS-M08 | Share Center |
| ICS-M09 | Invitation Tracking |
| ICS-M10 | Welcome Integration |
| ICS-M11 | Community Campaigns |
| ICS-M12 | Privacy |
| ICS-M13 | Future AI assistance |
| ICS-M14 | Relationship to RGE and PON |
| ICS-M15 | Universal Invitation Builder |
| ICS-M16 | Dynamic QR Codes |
| ICS-M17 | V1 scope |
| ICS-BG | Burt implementation guidance |
| AC-068 | Step 6.7 acceptance criteria |

---

## ICS-M01 — Purpose

**[ICS-M01]** The **Invitation & Connection System (ICS)** provides every participant and every community with simple, **relationship-centered** ways to welcome new people into the network.

**[ICS-M01a]** Every invitation is designed to **begin a conversation, build trust, and help the invited participant find a place where they belong** [WBS-001, GCN-M02].

**[ICS-M01b]** The objective is **meaningful connection rather than mass recruitment** [GCN-M08 Growth Ethics, RGE-M03].

**[ICS-M01c]** ICS is the **platform front door** — where trusted relationships enter the statewide network [PON-001 original vision operationalized at full scope].

---

## ICS-M02 — Guiding Principle

**[ICS-M02]**

> **Every invitation is an invitation into a community—not just a platform.**

**[ICS-M02a]** The invitation should communicate **purpose, belonging, and opportunity** [WBS-M05 Personalized Welcome].

**[ICS-M02b]** Complements [Impact Tree PON-M16] — invitations are the first link in the ripple chain [CP-016].

---

## ICS-M03 — Philosophy

**[ICS-M03]** Invitations are **personal** [RGE-M02 Relationship First].

**[ICS-M03a]** Every invitation should answer:

| Question | ICS mechanism |
|----------|---------------|
| Who invited me? | Attribution [RGE-M08] |
| Why am I being invited? | Landing page context [ICS-M06] |
| What community will I join? | Community invitation type [ICS-M04] |
| What opportunities exist? | Mission/event/committee types |
| What happens after I register? | Welcome integration [ICS-M10] |

**[ICS-M03b]** Every invitation should **reduce uncertainty** [WBS-M03a].

---

## ICS-M04 — Invitation Types

**[ICS-M04]** Support **multiple invitation types** — first-class entities, not one-size-fits-all links.

### Personal Invitation [ICS-M04a]

One participant invites another. **Relationship-centered** [PON-001, PRN-001].

### Community Invitation [ICS-M04b]

Campus or county invites participants. Examples: Join UCA Community · Join Pulaski County Community [CCC-001].

### Event Invitation [ICS-M04c]

Invitation directly into volunteer day, Welcome Week, meeting, leadership workshop, community service project. Participant can **join through the event** [EEOS-001].

### Mission Invitation [ICS-M04d]

Invite someone directly into a mission — Food Drive, Campus Cleanup, Mentorship Program, Volunteer Fair [MPS-001, EOS-001].

### Committee Invitation [ICS-M04e]

Invite to Communications Team, Technology Team, Volunteer Team, Leadership Team, Research Team [TWG-001].

### Organization Invitation [ICS-M04f]

**Future:** student organizations, community organizations, partner organizations, faith communities (where appropriate), professional associations [IPS-001 6.10].

**[ICS-M04g]** Orchestrator: `createInvitation(type, context, inviterId)`.

---

## ICS-M05 — Invitation Identity

**[ICS-M05]** Every invitation contains:

| Field | Purpose |
|-------|---------|
| Community identity | Where they belong |
| Mission / event / committee | What they're joining |
| Organizer | Who sent it |
| QR code | Physical sharing [ICS-M07] |
| Share link | Digital sharing |
| Invitation code | Manual entry |
| Expiration (optional) | Time-bound campaigns |
| Invitation type | Routing and landing [ICS-M04] |

**[ICS-M05a]** Makes invitations **flexible and reusable** [Universal Invitation Builder ICS-M15].

**[ICS-M05b]** Extends [PON-M04 Personal Invite Identity] and [NET-002] with full type system.

---

## ICS-M06 — Invitation Landing Pages

**[ICS-M06]** Each invitation opens a **tailored landing page**:

- Campus-specific · county-specific · mission · event · committee · organization (future)

**[ICS-M06a]** Landing pages immediately answer:

- *What is this?* · *Why should I care?* · *Who will I meet?* · *What happens next?*

**[ICS-M06b]** Route pattern: `/i/{invitationCode}` · community variants: `/join/{communitySlug}?ref={code}`.

**[ICS-M06c]** Generated automatically by [Universal Invitation Builder ICS-M15].

**[ICS-M06d]** Mobile-first, accessible, fast [Phase 9 UX foundations].

---

## ICS-M07 — QR Code System

**[ICS-M07]** Every participant and every community **automatically receives QR codes** [NET-002, PON-M04].

**[ICS-M07a]** QR codes may point to:

- Personal profile · community · mission · event · committee · volunteer opportunity · campaign materials (future)

**[ICS-M07b]** QR codes should remain **permanent whenever practical** — especially with [Dynamic QR ICS-M16].

**[ICS-M07c]** Printable for posters, table tents, business cards, stickers, banners [Share Center ICS-M08].

---

## ICS-M08 — Share Center

**[ICS-M08]** Participants share through:

- Text message · email · social media
- Printable flyers · posters · business cards · digital badges
- **Future NFC** [PON-M04]

**[ICS-M08a]** Sharing should take **only a few seconds** — one tap from [Personal HQ PHQ-001] or [Universal Invitation Builder ICS-M15].

**[ICS-M08b]** Route: `/share` · orchestrator: `getShareCenter(participantId | communityId)`.

**[ICS-M08c]** Suggested invitation language generated — editable, never spammy [GCN-M08].

---

## ICS-M09 — Invitation Tracking

**[ICS-M09]** Participants can view:

- Invitations sent · accepted · pending
- Communities joined · first volunteer experiences · relationships formed

**[ICS-M09a]** Tracking focuses on **community building rather than competition** [CP-016 story not leaderboard, PON-M12].

**[ICS-M09b]** Feeds [Impact Tree PON-M16] and [Community Growth Intelligence CGIS-M04] — invitation patterns, not vanity counts.

**[ICS-M09c]** Route: `/network/invitations` · extends PON My Network view.

---

## ICS-M10 — Welcome Integration

**[ICS-M10]** Once someone accepts, invitation **naturally transitions into participation**:

| Step | System |
|------|--------|
| Welcome Guide assigned | WBS-M06 |
| Community introduced | WBS-M08 |
| Personal Organizing Network updated | PON-001 |
| Belonging Journey begins | WBS-M16 First 30 Days |
| Invitation history preserved | RGE-M08 attribution |

**[ICS-M10a]** **Separate invitation mechanics from belonging** [WBS-BG, ICS-BG] — ICS opens the door; WBS welcomes through it.

**[ICS-M10b]** Orchestrator: `onInvitationAccepted(invitationId, participantId)`.

---

## ICS-M11 — Community Campaigns

**[ICS-M11]** Communities may create **invitation campaigns** coordinating many invitations around one purpose [CGO-M08 Growth Campaigns]:

- Welcome Week · Volunteer Recruitment · Leadership Interest · Mentorship Month · Community Service Day

**[ICS-M11a]** Campaign links share branding, landing page, and optional expiration [ICS-M05].

**[ICS-M11b]** Integrates [Universal Invitation Builder ICS-M15] at community scope.

---

## ICS-M12 — Privacy

**[ICS-M12]** Participants control [SEC-001]:

- Who may invite them · what invitation history is visible · what relationship information is shared

**[ICS-M12a]** Privacy settings remain **simple and transparent** [SEC-M04 consent model].

**[ICS-M12b]** No public invite leaderboards [GCN-M08, PON-M14].

---

## ICS-M13 — Future AI Assistance

**[ICS-M13]** Future AI may **support** authentic invitation — never automated mass outreach [RGE-M13, GCN-M08].

**[ICS-M13a]** May:

- Suggest who to follow up with · recommend invitation wording
- Identify communities needing invitations · recommend mentors
- Highlight successful invitation strategies [CGIS-M08]

**[ICS-M13b]** AI encourages **authentic communication** — suggested language is editable; never sent without human action.

---

## ICS-M14 — Relationship to RGE and PON

**[ICS-M14a]** **RGE-001** (Phase 3.5) established relationship growth mechanics — invitation lifecycle, attribution, Organizing Circles, healthy growth ethics.

**[ICS-M14b]** **PON-001** (Phase 6.2) operationalized **personal organizing network** — invite link, QR, Impact Tree, welcome workflow.

**[ICS-M14c]** **ICS-001** (Phase 6.7) unifies into **full Invitation & Connection System** — all invitation types, landing pages, campaigns, Universal Builder, Dynamic QR.

**[ICS-M14d]** Planned **Invitation System INV-001** superseded — scope expanded to front door + connection, not links alone.

**[ICS-M14e]** RGE/PON ask *"How do personal invites work?"* · ICS asks *"How does every type of invitation open the platform through trusted relationships?"*

---

## ICS-M15 — Universal Invitation Builder

**[ICS-M15]** The **Universal Invitation Builder (UIB)** is the **signature tool** of ICS — one of the most frequently used tools in the platform.

**[ICS-M15a]** Instead of manually creating different invitations, every participant and community accesses a **guided builder**:

**Who are you inviting?**

- One person · a group · student organization · class · county community

**What are you inviting them to?**

- Join my community · attend an event · volunteer · join a committee · support a mission · explore the platform

**How will you share it?**

- QR code · text · email · printable flyer · social media graphic · digital card

**[ICS-M15b]** System automatically generates:

- Personalized landing page · branded QR code · short share link
- Suggested invitation language · follow-up reminders (optional, opt-in)

**[ICS-M15c]** Route: `/invite/build` · orchestrator: `buildInvitation(wizardInput)`.

**[ICS-M15d]** Primary entry from [Personal HQ PHQ-001], [Community Command Center CCC-001], and mission/event pages.

**[ICS-M15e]** Not a form factory — **conversation starter** that reflects [ICS-M03] philosophy.

---

## ICS-M16 — Dynamic QR Codes

**[ICS-M16]** **Dynamic QR Codes (DQR)** make the QR system practical for **long-term organizing** while preserving relational philosophy.

**[ICS-M16a]** QR codes are **dynamic rather than permanently tied to a single destination**:

- Printed business card or campus poster uses the **same QR code**
- **Destination changes over time** behind the scenes

**[ICS-M16b]** Example lifecycle:

| Period | Destination |
|--------|-------------|
| Today | Welcome Week |
| Next month | Volunteer Fair |
| Later | Community Cleanup |
| Default | Participant's Personal Organizing Network [PON-001] |

**[ICS-M16c]** Organizers print posters, stickers, table tents, business cards, and banners **once** — update destination throughout the year.

**[ICS-M16d]** Every participant and every community becomes a **persistent gateway** into the statewide network [NET-002 permanent QR + mutable routing table].

**[ICS-M16e]** Orchestrator: `setDynamicQrDestination(qrId, destination, effectiveFrom?)` · audit log for transparency [SEC-001].

**[ICS-M16f]** Fallback destination always defined — never dead QR [reliability requirement].

**[ICS-M16g]** Complements [Universal Invitation Builder ICS-M15] — builder creates; DQR maintains physical materials.

---

## ICS-M17 — V1 Scope

| Deliverable | Status |
|-------------|--------|
| ICS philosophy documented | ✅ |
| All invitation types specified | ✅ |
| Invitation identity + landing pages | ✅ |
| QR + Share Center + tracking | ✅ |
| Welcome integration + campaigns + privacy | ✅ |
| Universal Invitation Builder architecture | ✅ |
| Dynamic QR architecture | ✅ |
| Live builder + DQR routing | v1.1 |
| Organization invitations | v1.2 |

---

## ICS-BG — Burt Implementation Guidance

**[ICS-BG-a]** Implementation should:

- Treat invitations as **first-class entities** — typed, attributed, auditable
- **Separate invitation mechanics from belonging** [WBS-001 welcome flow]
- Support **permanent QR codes** with dynamic routing [ICS-M16]
- Maintain **relationship history** [RGE-M08, PRN-001]
- Integrate [PON-001], [WBS-001], [CGO-001], [CGIS-001]
- Prepare for **future invitation channels** [NFC, organization invites]

**[ICS-BG-b]** Files:

```
src/lib/ics/createInvitation.ts
src/lib/ics/buildInvitation.ts
src/lib/ics/onInvitationAccepted.ts
src/lib/ics/setDynamicQrDestination.ts
src/lib/ics/getShareCenter.ts
src/components/invite/UniversalInvitationBuilder.tsx
src/components/invite/InvitationLandingPage.tsx
src/components/invite/DynamicQrManager.tsx
data/registry/invitation-connection-system.json
```

**[ICS-BG-c]** Database: `DB-ICS` · tables: `invitations`, `invitation_campaigns`, `invitation_acceptances`, `dynamic_qr_codes`, `dynamic_qr_destinations`, `share_assets`.

---

## AC-068 — Acceptance Criteria

Step 6.7 is complete when:

- [x] **[AC-068a]** Invitation & Connection philosophy documented. `[ICS-M01, ICS-M02, ICS-M03]`
- [x] **[AC-068b]** Invitation types established. `[ICS-M04, ICS-M05]`
- [x] **[AC-068c]** Landing pages and QR workflows defined. `[ICS-M06, ICS-M07, ICS-M16]`
- [x] **[AC-068d]** Welcome integration and privacy incorporated. `[ICS-M10, ICS-M12]`
- [x] **[AC-068e]** Universal Invitation Builder specified. `[ICS-M15]`
- [x] **[AC-068f]** Burt has blueprint for relationship-centered invitations. `[ICS-BG, invitation-connection-system.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Build invitation → share through trusted channel → landing page answers questions → accept → welcome → belong → relationship grows → Impact Tree ripples*
