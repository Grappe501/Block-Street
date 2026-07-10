# Personal Organizing Network

**Document ID:** PHASE-006.2  
**Artifact:** `PERSONAL_ORGANIZING_NETWORK.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** PON

> **Every participant has their own link. Every participant has their own QR code.**

This is the feature that first inspired the entire platform — and one of its **signature systems**.

**Not a referral program. Not affiliate marketing.** A participant's **living community network**.

**Requirement:** PON-001 · **Planned alias superseded:** PNS-001 · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** [Personal Relationship Network PRN-001](../phase-03/PERSONAL_RELATIONSHIP_NETWORK.md) · [Relationship Growth Engine RGE-001](../phase-03/RELATIONSHIP_GROWTH_ENGINE.md) · [Personal Command Center PCC-001](../phase-03/PERSONAL_COMMAND_CENTER.md) · [Invitation Impact Visibility GCN-M12](GROWTH_CONSTITUTION.md)

**Extends:** PRN-001 (relationship foundation) · NET-001 (invite link) · NET-002 (QR) · RGE-001 (growth mechanics)

**Live spec:** `data/registry/personal-organizing-network.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PON-M01 | Purpose |
| PON-M02 | Guiding principle |
| PON-M03 | Philosophy |
| PON-M04 | Personal invite identity |
| PON-M05 | Invitation methods |
| PON-M06 | Invitation journey |
| PON-M07 | My Network view |
| PON-M08 | Network tree |
| PON-M09 | Welcome workflow |
| PON-M10 | Mentorship |
| PON-M11 | Network timeline |
| PON-M12 | Impact view |
| PON-M13 | Privacy |
| PON-M14 | Recognition |
| PON-M15 | Community integration |
| PON-M16 | Impact Tree |
| PON-M17 | Future AI assistance |
| PON-M18 | Relationship to PRN & RGE |
| PON-M19 | V1 scope |
| PON-BG | Burt implementation guidance |
| AC-063 | Step 6.2 acceptance criteria |

---

## PON-M01 — Purpose

**[PON-M01]** The **Personal Organizing Network (PON)** gives every participant their own organizing space for **welcoming new participants, building relationships, mentoring others, and helping communities grow**.

**[PON-M01a]** The objective is **not recruiting for numbers**. The objective is helping participants build **authentic networks of people they know and trust** [GCN-M05a Relationship First].

**[PON-M01b]** Every participant becomes a **community builder** [JRN-001 journey, PGL-001 leadership].

**[PON-M01c]** PON operationalizes the **original platform vision** — statewide network grows through **relationships**, not campaigns [OM-L2, RGE-M01].

**[PON-M01d]** One of the features that makes the platform feel **fundamentally different** from referral programs and CRMs [PRN-M01 participant-owned].

---

## PON-M02 — Guiding Principle

**[PON-M02]**

> **Every participant has the ability to strengthen their community by inviting others into meaningful participation.**

**[PON-M02a]** Growth begins with **trusted relationships** [RGE-M02, GCN-M02].

---

## PON-M03 — Philosophy

**[PON-M03]** The Personal Organizing Network is **not about "my followers."**

**[PON-M03a]** It is about:

- People I **introduced** · People I **welcomed** · People I **mentored**
- People who became **part of our community**

**[PON-M03b]** The network reflects **relationships rather than popularity** [PRN-M05 personal network, not org CRM].

**[PON-M03c]** Complementary to [Growth Constitution GCN-M04] — **leadership over followers**.

---

## PON-M04 — Personal Invite Identity

**[PON-M04]** Every participant **automatically receives** upon registration [PRN-M04, NET-001]:

| Asset | Requirement | Description |
|-------|-------------|-------------|
| Unique invite link | NET-001 | `/s/[slug]` personalized landing |
| Permanent invite code | PON-M04a | Short memorable code for verbal sharing |
| Personal QR code | NET-002 | Portable organizing identity |
| Short share URL | NET-001 | Mobile-friendly share |
| Future NFC support | PON-M04b | Badge/card tap — v1.1+ |

**[PON-M04c]** The participant **always** has a simple way to invite others — day one, no setup [RGE-M04 automatic toolkit].

---

## PON-M05 — Invitation Methods

**[PON-M05]** Support effortless invitations [RGE-M05]:

- QR codes · share links · text message · email · social sharing
- Campus posters (QR) · printed cards · future badge scanning [NET-003]

**[PON-M05a]** Detailed mechanics and analytics in [Invitation & Connection System ICS-001 6.7] — PON owns **identity and relationship context**; ICS owns **invitation types and lifecycle**.

---

## PON-M06 — Invitation Journey

**[PON-M06]** Every invitation follows the same lifecycle:

```text
Invitation Sent
        ↓
Visited
        ↓
Registered
        ↓
Welcomed
        ↓
First Community
        ↓
First Mission
        ↓
First Volunteer Experience
        ↓
Long-Term Participation
```

**[PON-M06a]** The objective is **belonging rather than conversion** [GCN-M03, WBS-001 6.5].

**[PON-M06b]** Parallel to [Growth Lifecycle GCN-M06] and [Participant Journey JRN-001].

**[PON-M06c]** Attribution preserved at every stage [RGE-M08] — feeds **Impact Tree** [PON-M16].

---

## PON-M07 — My Network

**[PON-M07]** Every participant receives a **personal network view** — route: `/network` or PCC widget [PCC-001, PHQ-001].

**[PON-M07a]** Displays:

- People invited · relationships · communities represented
- Shared missions · mentorship connections
- Growth timeline · community stories

**[PON-M07b]** The network emphasizes **people rather than statistics** [GCN-M07 numbers alone never define success].

**[PON-M07c]** **Not** a leaderboard · **not** invite-count ranking [GCN-M08 ethics].

---

## PON-M08 — Network Tree

**[PON-M08]** Participants can **optionally** view a relationship tree [PRN-M09 dashboard, Trust Graph context]:

```text
You
├── Sarah
│   ├── Jordan
│   └── Emma
├── Alex
│   ├── Chris
│   └── Taylor
└── Morgan
```

**[PON-M08a]** Visualization **celebrates relationships — not competition** [CRA-001 not gamification].

**[PON-M08b]** Tree depth and visibility **permission-scoped** [PON-M13, TPS-001].

**[PON-M08c]** Structural view; **Impact Tree** [PON-M16] shows **outcomes** along branches.

---

## PON-M09 — Welcome Workflow

**[PON-M09]** When someone joins through an invitation, the inviter is **encouraged** (never required) to:

- Welcome them · answer questions · introduce them to a community
- Suggest opportunities · help them feel they belong [OBE-001]

**[PON-M09a]** Invitations become the **beginning of relationships** — not transaction completion [RGE-M06].

**[PON-M09b]** Welcome prompts surface in [Personal Command Center PCC-001] · [Morning Brief EOS-M17 stack].

**[PON-M09c]** Connects to [Welcome & Belonging System WBS-001 6.5] welcome stage.

---

## PON-M10 — Mentorship

**[PON-M10]** Participants may naturally become **mentors** [PGL-001, VDS-001 journey].

**[PON-M10a]** The platform helps them:

- Support new members · answer questions · recommend communities
- Encourage participation · share experiences

**[PON-M10b]** Mentorship grows **organically** — not assigned by algorithm without consent [PGL-M mentorship matching advisory].

**[PON-M10c]** Mentorship connections visible in My Network [PON-M07] and **Impact Tree** [PON-M16].

---

## PON-M11 — Network Timeline

**[PON-M11]** Participants see how their network **evolved** [CJT-001 parallel, PRN-M12 timeline]:

- First invitation · first volunteer · new mentor
- First community launched · new statewide collaboration

**[PON-M11a]** The timeline tells the **story of their organizing journey** — append-only narrative [CJT-M03].

**[PON-M11b]** Feeds [Civic Passport CPP-001] and [Personal Digital Twin PDT-001].

---

## PON-M12 — Impact View

**[PON-M12]** Rather than showing only invite counts, show **ripple effects** [GCN-M12 Invitation Impact Visibility]:

- People welcomed · communities strengthened · projects joined
- Volunteer experiences created · leaders developed · stories collected

**[PON-M12a]** Emphasis remains on **community impact** [CIIS-001 outcomes, CST-001 stories].

**[PON-M12b]** Implemented primarily through **Impact Tree** [PON-M16] — not vanity metrics dashboard.

---

## PON-M13 — Privacy

**[PON-M13]** Participants **control what is visible** [TPS-001, KDG-001].

**[PON-M13a]** Protect personal information while enabling **relationship-based organizing**.

**[PON-M13b]** Network visibility respects **privacy preferences and permissions** at every layer [SEC-001].

**[PON-M13c]** Inviter can see **impact story** of their invites; invitee controls **their** profile visibility [PRN-M05 participant-owned data].

---

## PON-M14 — Recognition

**[PON-M14]** Recognition emphasizes **contribution** [CRA-001, CCR-001 6.8]:

- Welcoming new participants · mentoring · helping communities launch
- Supporting volunteer experiences · strengthening relationships

**[PON-M14a]** Recognition **reinforces culture — not competition** [GCN-M08, no invite leaderboards].

---

## PON-M15 — Community Integration

**[PON-M15]** PON connects directly to:

| System | Integration |
|--------|-------------|
| Personal Command Center | Network widget, welcome prompts [PCC-001] |
| Community Command Centers | Community growth from personal invites [CCC-001] |
| Volunteer Passport | Service story of network [VDS-M17] |
| Civic Passport | Journey milestones [CPP-001] |
| Opportunity Exchange | Needs matched to new participants [OEX-001] |
| Growth Operating System | Healthy growth signals [GOS-001] |
| Community Brain | Stories and lessons from network [CKLS-001] |
| Living Network Graph | Structural + impact edges [GOS-M16] |

**[PON-M15a]** The participant's network becomes part of the **larger statewide ecosystem** [SCN-001] — never siloed.

---

## PON-M16 — Impact Tree

**[PON-M16]** The **Impact Tree** is the **signature feature** of PON — the most emotionally meaningful growth view on the platform.

**[PON-M16a]** Instead of:

> **You invited 18 people.**

The platform shows:

```text
You
│
├── Invited Alex
│      │
│      ├── Started Campus Service Team
│      │
│      ├── Mentored 9 Volunteers
│      │
│      └── Organized Annual Welcome Week
│
├── Invited Sarah
│      │
│      ├── Joined County Community
│      │
│      ├── Led Food Drive
│      │
│      └── Created Community Garden
│
└── Invited Jordan
       │
       ├── Started Debate Watch Group
       │
       └── Mentored Future Organizer
```

**[PON-M16b]** Zoom out five years — a participant sees that welcoming a few people led to:

- New volunteer teams · community traditions · hundreds of service opportunities
- New leaders · cross-campus partnerships · statewide initiatives

**[PON-M16c]** Tells something profound:

> **"Because you welcomed a few people into this community, all of this became possible."**

**[PON-M16d]** Implements [Invitation Impact Visibility CP-016 · GCN-M12] — **story, not status** [GCN-M12a not competition].

**[PON-M16e]** Route: `/network/impact` · orchestrator: `getImpactTree(participantId, depth?, permissions)`.

**[PON-M16f]** Data sources: Relationship Graph · Impact Chain [CIIS-M16] · Mission outcomes · Volunteer Passport · Story Atlas [CST-M16] · Improvement Graph [LIS-M16].

**[PON-M16g]** **Not** measuring influence for status — helping people see **long-term ripple effects** of investing in relationships [PEL-M13].

**[PON-M16h]** Complements [Network Tree PON-M08] (who) with **Impact Tree** (what became possible).

---

## PON-M17 — Future AI Assistance

**[PON-M17]** Future AI may **assist relationship-building without automating it** [GCN-M13, ACN-M06]:

- Recommend introductions · suggest mentors · identify welcoming opportunities
- Recommend nearby communities · highlight participants needing support
- Suggest follow-up after invitations

**[PON-M17a]** AI **never sends invitations on behalf of participants** without explicit consent [RGE-M13, GCN-M08].

---

## PON-M18 — Relationship to PRN & RGE

**[PON-M18a]** **PRN-001** (Phase 3.4) established participant-owned relationship network, Trust Graph, auto-provision — **PON-001 operationalizes** into full organizing network with Impact Tree.

**[PON-M18b]** **RGE-001** (Phase 3.5) established invitation lifecycle, attribution, healthy growth — **PON-001** is the **Growth OS home** for those mechanics under [GCN-001 governance].

**[PON-M18c]** Terminology: use **Personal Organizing Network (PON)** in Phase 6+ docs; **Personal Relationship Network (PRN)** remains Phase 3 foundation reference.

---

## PON-M19 — V1 Scope

| Deliverable | Status |
|-------------|--------|
| PON philosophy documented | ✅ |
| Personal invite identity spec | ✅ |
| Invitation journey + welcome workflow | ✅ |
| My Network + Network Tree architecture | ✅ |
| Impact Tree architecture | ✅ |
| Privacy + recognition principles | ✅ |
| Community integration map | ✅ |
| Live invite link + QR | Partial [NET-001/002] |
| Live Impact Tree aggregation | v1.1 |
| NFC badge scanning | future |

---

## PON-BG — Burt Implementation Guidance

**[PON-BG-a]** Implementation should:

- Treat PON as a **first-class platform entity** — not a marketing plugin
- **Separate invitation mechanics** [ICS-001] from **relationship management** [PRN-001 graph]
- **Generate QR codes and invite links automatically** on registration [PRN-M04]
- Maintain **relationship history** and **impact chain attribution**
- Preserve **participant privacy** [PON-M13]
- Support **future invitation methods** without redesign [PON-M05]

**[PON-BG-b]** Files:

```
src/lib/pon/getPersonalOrganizingNetwork.ts
src/lib/pon/getImpactTree.ts
src/lib/pon/getNetworkTree.ts
src/lib/pon/getNetworkTimeline.ts
src/components/network/MyNetwork.tsx
src/components/network/ImpactTree.tsx
src/components/network/NetworkTree.tsx
data/registry/personal-organizing-network.json
```

**[PON-BG-c]** Database: `DB-PON` · tables: `invite_identities`, `invitation_journey_events`, `impact_tree_nodes`, `network_timeline_events`.

---

## AC-063 — Acceptance Criteria

Step 6.2 is complete when:

- [x] **[AC-063a]** Personal Organizing Network philosophy documented. `[PON-M01, PON-M02, PON-M03]`
- [x] **[AC-063b]** Invitation identity and relationship workflows established. `[PON-M04, PON-M05, PON-M06, PON-M07]`
- [x] **[AC-063c]** Mentorship and welcome processes defined. `[PON-M09, PON-M10]`
- [x] **[AC-063d]** Privacy and recognition principles incorporated. `[PON-M13, PON-M14]`
- [x] **[AC-063e]** Impact Tree architecture specified. `[PON-M16, GCN-M12]`
- [x] **[AC-063f]** Burt has blueprint for participant-centered relational organizing. `[PON-BG, personal-organizing-network.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Personal invite identity → thoughtful invitation → welcome → belonging → participation → impact ripples visible in Impact Tree → mentor → legacy → next invitation*
