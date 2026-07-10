# Build Step 1.7 — Launch Success Definition

**Document ID:** PHASE-001.7  
**Status:** Canonical  
**Priority:** Critical  
**Master Build Plan Sequence:** Phase 001 — Foundational Constitution (extended)  

> **How do we know Version 1 is ready to launch?**  
> The North Star may take years. This step defines the **minimum viable statewide organizing platform** — complete enough to attract users and begin learning.

**Builds On:** PHASE-001.2 [NS-002] · PHASE-001.6 [GM-V1] · PHASE-001.5 [OM-005]

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| LS-001 | Purpose |
| LS-002 | Version 1 mission (three questions) |
| LS-003 | Launch objective |
| LS-P1 | Pillar 1 — Every county exists |
| LS-P2 | Pillar 2 — Every college and university exists |
| LS-P3 | Pillar 3 — Every participant has a home |
| LS-P4 | Pillar 4 — Organizing works |
| LS-P5 | Pillar 5 — Mobile experience |
| LS-P6 | Pillar 6 — Administration |
| LS-P7 | Pillar 7 — Outreach visibility |
| LS-PE | Participant experience flow |
| LS-PX | Platform experience qualities |
| LS-EN | Engineering success criteria |
| LS-OR | Organizational success criteria |
| LS-CHK | Launch readiness checklist |
| LS-DEF | What V1 deliberately does NOT require |
| LS-010 | Burt implementation guidance |
| AC-007 | Step 1.7 acceptance criteria |

---

## LS-001 — Purpose

**[LS-001]** This document establishes the objective criteria for declaring **Version 1 Launch Ready**.

**[LS-001a]** Version 1 is not intended to contain every envisioned capability.

**[LS-001b]** Version 1 is successful when it delivers a complete, stable, and useful organizing experience that participants can immediately understand and begin using.

**[LS-001c]** Every launch decision should be measured against these criteria.

*Distinct from North Star [NS-002]: North Star = years. Launch Success = July 14, 2026.*

---

## LS-002 — Version 1 Mission (Three Questions)

**[LS-002]** Version 1 should answer three questions for every visitor:

| # | Question | Maps To |
|---|----------|---------|
| Q1 | **Where do I belong?** | County hub, institution hub, join flow [OH-001, OH-002] |
| Q2 | **How do I get involved?** | Registration, interests, welcome [OM-L1] |
| Q3 | **How do I invite others?** | Share link, QR code, network board [OM-L2] |

**[LS-002a]** If those three questions are answered clearly, the platform has achieved its primary purpose for V1.

---

## LS-003 — Launch Objective

**[LS-003]** Launch a statewide platform where every Arkansas college student and every young adult has an organizing home, even if many advanced features remain under development.

*Target date: July 14, 2026 launch call. Leader testing: July 12, 2026.*

---

## Launch Pillars

### LS-P1 — Pillar 1: Every County Exists

**[LS-P1]** The platform includes all **75 Arkansas counties**.

Each county has:

- County page
- Basic information
- Organizing status
- Youth organizing hub
- Join option
- Representation status

**[LS-P1a]** No county is left blank.

*V1 status: ✅ Pages exist. ⏳ Representation status live when DB connected.*

---

### LS-P2 — Pillar 2: Every College and University Exists

**[LS-P2]** Every Arkansas college and university is represented.

Each institution has:

- Institution page
- City
- County
- Institution type
- Enrollment estimate
- Founding information
- Brief history
- Public reference links
- Independent platform disclaimer [DG-001, DG-002]
- Join button

**[LS-P2a]** Future institutions (community colleges, trade schools, high schools) added through later versions [GM-P7].

*V1 status: 🔄 23 universities seeded. Expand registry in Phase 2.*

---

### LS-P3 — Pillar 3: Every Participant Has a Home

**[LS-P3]** Immediately after registration, every participant receives:

- Personal profile
- Personal dashboard
- Personal network
- Share link
- QR code
- Activity timeline (basic)
- Welcome experience

**[LS-P3a]** No participant should reach a dead end.

*V1 status: ⏳ Build for July 12–14.*

---

### LS-P4 — Pillar 4: Organizing Works

**[LS-P4]** Participants can:

- Join
- Invite
- Recruit
- View their network
- Join a campus or county (honor system) [OM-L3]
- Update their profile

**[LS-P4a]** These core workflows should function reliably.

*V1 status: ⏳ Requires Netlify DB + signup flow.*

---

### LS-P5 — Pillar 5: Mobile Experience

**[LS-P5]** The platform should feel natural on:

- Phones (primary)
- Tablets
- Desktop browsers

**[LS-P5a]** Mobile is the primary experience. [CP-008]

*V1 status: 🔄 Mobile-first CSS. Test on devices before Jul 14.*

---

### LS-P6 — Pillar 6: Administration

**[LS-P6]** Administrators can:

- Manage institutions
- Manage counties
- Manage participants
- Review registrations
- Update institution information
- View basic growth statistics

*V1 status: 🔄 Director workbench exists. Participant management ⏳ with DB.*

---

### LS-P7 — Pillar 7: Outreach Visibility

**[LS-P7]** The platform clearly shows:

- Represented campuses
- Unrepresented campuses
- Represented counties
- Counties needing outreach

**[LS-P7a]** The statewide map should communicate where organizing is happening and where help is needed. [CP-011, GM-P1]

*V1 status: 🔄 Map + stats partial. Live counts ⏳ with DB.*

---

## LS-PE — Participant Experience

**[LS-PE]** A first-time visitor should be able to:

```
Arrive
  → Understand the mission (WHY)
  → Choose their organizing home (county → school OR county-only)
  → Register
  → Receive their personal network (link + QR)
  → Invite a friend
  → Return later without confusion
```

**[LS-PEa]** The default post-login view is **My Network** — not a blank page or error.

---

## LS-PX — Platform Experience

**[LS-PX]** The software should feel:

| Quality | Meaning |
|---------|---------|
| **Simple** | Three questions answered without training |
| **Welcoming** | Ages 16–24, in school or not |
| **Local** | "This is my campus / my county" [CP-012] |
| **Hopeful** | WHY call-to-action on first visit |
| **Purpose-driven** | Organizing mission visible, not buried |
| **Fast** | Works on phone, low friction |

**[LS-PXa]** The technology should never overwhelm the organizing mission. [NS-010]

---

## LS-EN — Engineering Success

**[LS-EN]** Version 1 should be:

- Stable
- Responsive
- Secure
- Well documented
- Modular [GM-P10]
- Deployable through GitHub and Netlify
- Backed by a well-structured SQL database (Netlify DB)
- Ready for future versioning [GM-P3]

---

## LS-OR — Organizational Success

**[LS-OR]** The platform is successful if it enables organizers to:

- Recruit new participants
- Build campus communities
- Build county communities
- Identify outreach gaps
- Begin statewide relationship building

*Measured by relationships and participation — not signup count alone [NS-004].*

---

## LS-CHK — Launch Readiness Checklist

**[LS-CHK]** Version 1 is **launch ready** when ALL items are checked:

| # | Criterion | ID | V1 Status |
|---|-----------|-----|-----------|
| 1 | All 75 county pages exist | LS-P1 | ✅ |
| 2 | Every AR college/university has a profile | LS-P2 | 🔄 23/complete set TBD |
| 3 | Registration is operational | LS-P4 | ⏳ |
| 4 | Personal network boards generated automatically | LS-P3 | ⏳ |
| 5 | Referral links and QR codes function | LS-P3 | ⏳ |
| 6 | Campus and county assignment works (honor system) | LS-P4 | ⏳ |
| 7 | Statewide directory is searchable | LS-P2 | 🔄 |
| 8 | Basic administrative tools operational | LS-P6 | 🔄 |
| 9 | Mobile experience complete | LS-P5 | 🔄 |
| 10 | Documentation supports ongoing development | LS-EN | ✅ |

**Launch ready = 10/10 checked.** Current: **3/10 complete, 4/10 in progress, 3/10 pending.**

*Leader testing (Jul 12): minimum items 3, 4, 5, 6 must work.*

---

## LS-DEF — What Version 1 Deliberately Does NOT Require

**[LS-DEF]** The following must **not** delay launch if core organizing is complete:

- Committee management (v1.1)
- Advanced event management (v1.2)
- Rich messaging (v1.3)
- Volunteer hour tracking (v1.5)
- Mentorship matching (future)
- AI-powered recommendations (never V1)
- Advanced analytics (v1.1+)
- Native mobile applications (future)
- Expanded institution types beyond initial registry (staged [GM-P7])
- Public APIs (future)

**[LS-DEFa]** Implement architectural hooks only; defer full capability [GM-010, LS-010].

---

## LS-010 — Burt Implementation Guidance

**[LS-010]** When making implementation decisions, ask:

> **Does this improve the launch experience, or is it a future enhancement?**

**[LS-010a]** If future enhancement → implement hooks only, defer full capability.

**[LS-010b]** July 12 priority order:

1. Registration + campus/county assignment
2. Share link + QR code
3. Personal network board (basic)
4. Referral attribution
5. Everything else

*Aligns with:* [GM-V1] · [ED-001] · [NS-013] (North Star filter for V1 scope)

---

## AC-007 — Acceptance Criteria

Step 1.7 is complete when:

- [x] **[AC-007a]** Launch success defined in measurable terms. `[LS-CHK]`
- [x] **[AC-007b]** Minimum viable statewide platform described. `[LS-P1–P7]`
- [x] **[AC-007c]** Engineering, organizational, and participant success documented. `[LS-EN, LS-OR, LS-PE]`
- [x] **[AC-007d]** Future enhancements separated from V1. `[LS-DEF]`
- [x] **[AC-007e]** Burt has objective launch checklist. `[LS-CHK, LS-010]`

---

## Document Authority

| Field | Value |
|-------|-------|
| Document ID | PHASE-001.7 |
| Status | Canonical |
| Next Step | PHASE-001.8 — Implementation Doctrine |
| Phase 1 closes | After 1.8 + consolidated Build Bible |

---

*Three questions. Seven pillars. Ten checklist items.*  
*Launch ready = participants can belong, join, and invite — on their phone — statewide.*
