# Trust, Privacy & Digital Safety Framework

**Document ID:** PHASE-003.7  
**Artifact:** `TRUST_PRIVACY_DIGITAL_SAFETY.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Trust is infrastructure.**

If people don't trust the platform, they won't invite their friends. If they don't invite their friends, relational organizing fails. Trust isn't a feature — it is **foundational system design**.

Privacy is only **one component** of trust. This framework covers trust, privacy, and digital safety together.

**Builds On:** [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) · [Platform Boundaries](../build-steps/PHASE-001.4-PLATFORM-BOUNDARIES.md) · [Core Principles](../build-steps/PHASE-001.3-CORE-PRINCIPLES.md) · [Knowledge Governance](../phase-02/KNOWLEDGE_DATA_GOVERNANCE_FRAMEWORK.md)

**Live spec:** `data/registry/trust-privacy-safety.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| TPS-M01 | Purpose |
| TPS-M02 | Guiding principle |
| TPS-M03 | Trust philosophy |
| TPS-M04 | Privacy philosophy |
| TPS-M05 | Data minimization |
| TPS-M06 | Participant control |
| TPS-M07 | Visibility levels |
| TPS-M08 | Consent |
| TPS-M09 | Youth safety |
| TPS-M10 | Community safety |
| TPS-M11 | Identity protection |
| TPS-M12 | Transparency |
| TPS-M13 | Trust signals |
| TPS-M14 | Ethical use of data |
| TPS-M15 | Future AI principles |
| TPS-M16 | Trust Center architecture |
| TPS-M17 | Cross-system integration |
| TPS-M18 | V1 scope |
| TPS-BG | Burt implementation guidance |
| AC-026 | Step 3.7 acceptance criteria |

---

## TPS-M01 — Purpose

**[TPS-M01]** This document establishes how participant **trust is earned, protected, and maintained** throughout ASYON.

**[TPS-M01a]** The platform should be designed so participants feel confident:

- Inviting friends · Sharing information · Organizing locally · Participating in civic life

**[TPS-M01b]** Trust is a **foundational system** — not an optional feature bolted on later [CP-007, DG-004].

**[TPS-M01c]** Terminology: **Trust, Privacy & Digital Safety Framework** (not "Privacy Settings" alone).

---

## TPS-M02 — Guiding Principle

**[TPS-M02]**

> **Participants should always understand what information they are sharing, who can see it, and why it is being used.**

**[TPS-M02a]** **Transparency builds trust. Trust strengthens relationships. Relationships strengthen communities.**

**[TPS-M02b]** Complementary chain from relational model:

```
Transparency → Trust → Invitations → Relationships → Communities
```

**[TPS-M02c]** If relational organizing fails at trust, the entire platform fails [RGE-M02, PRN-M01].

---

## TPS-M03 — Trust Philosophy

**[TPS-M03]** The platform earns trust through:

| Pillar | Implementation |
|--------|----------------|
| **Transparency** | Plain-language explanations [TPS-M12] |
| **Participant control** | Visibility + consent [TPS-M06, TPS-M07] |
| **Clear communication** | Trust Center [TPS-M16] |
| **Privacy by design** | Data minimization [TPS-M05, CP-007] |
| **Responsible stewardship** | Ethical use [TPS-M14] |
| **Respect for participants** | People not users [PEP-M01] |

**[TPS-M03a]** The platform should **never rely on confusing interfaces or hidden settings**.

**[TPS-M03b]** Trust Graph [PRN-M16] records collaboration history — **never** exposes private data without consent.

---

## TPS-M04 — Privacy Philosophy

**[TPS-M04]** **Participants own their information.**

**[TPS-M04a]** The platform receives permission to use information **only for clearly explained purposes**.

**[TPS-M04b]** Privacy settings should be **understandable without technical expertise** — no legal jargon in controls [TPS-M16].

**[TPS-M04c]** Maps to [PEP-M15] participant representation controls.

---

## TPS-M05 — Data Minimization

**[TPS-M05]** Collect only information that serves a **meaningful organizing purpose** [CP-007, DG-004].

**[TPS-M05a]** Before adding any field, ask:

| Question | If "no" → |
|----------|-----------|
| Why is this needed? | Do not collect |
| How does it help the participant? | Do not collect |
| Can the platform function without it? | Do not collect |
| Does the benefit justify collecting it? | Do not collect |

**[TPS-M05b]** V1 registration minimum [USR-001]: name, county, optional campus, mission — honor-system, no verification gate [PEP-M05c].

**[TPS-M05c]** Cross-ref [KDG-M01] four data classes — participant PII is **Controlled** data.

---

## TPS-M06 — Participant Control

**[TPS-M06]** Participants should control:

| Setting | V1 |
|---------|-----|
| Profile visibility | ✅ basic |
| Contact information | ✅ private default |
| Public biography | future |
| Mission statement visibility | ✅ |
| Community memberships visibility | partial |
| Messaging permissions | future |
| Notification preferences | cross-ref CAM-001 |
| Connection requests | future |

**[TPS-M06a]** The **participant—not the platform**—makes these choices whenever practical [PEP-M15].

**[TPS-M06b]** Controls live in **Trust Center** [TPS-M16] — not scattered across settings pages.

---

## TPS-M07 — Visibility Levels

**[TPS-M07]** Every major profile element supports **visibility controls**:

| Level | Key | Meaning |
|-------|-----|---------|
| Only Me | `only_me` | Participant only |
| My Connections | `connections` | PRN connected_to |
| My Campus | `campus` | Same institution |
| My County | `county` | Same county |
| Platform Members | `members` | All registered participants |
| Public | `public` | Unauthenticated (where appropriate) |

**[TPS-M07a]** Visibility should be **simple to understand and change** — one tap from Trust Center.

**[TPS-M07b]** Journey stage visibility follows [JRN-M13] — never expose for pressure or comparison.

**[TPS-M07c]** V1 defaults:

| Element | Default visibility |
|---------|-------------------|
| Display name | Platform Members |
| County | Platform Members |
| Campus | Platform Members |
| Mission | Connections |
| Contact info | Only Me |
| Journey stage | Only Me |
| Network size | Only Me |

**[TPS-M07d]** Schema: `visibility_settings` JSON on participant record or separate table.

---

## TPS-M08 — Consent

**[TPS-M08]** Consent should be:

| Property | Meaning |
|----------|---------|
| **Clear** | Plain language |
| **Specific** | Per purpose, not blanket |
| **Revocable** | Change anytime in Trust Center |
| **Documented** | Audit log of consent events |

**[TPS-M08a]** Participants should understand: **what** they agree to, **why**, and **how to change** their decision later.

**[TPS-M08b]** Registration consent: platform purpose + data use summary — not buried in ToS [PAGE-JOIN].

**[TPS-M08c]** Invitation landing [PAGE-SHARE]: inviter context shown only with inviter's visibility settings [RGE-M07].

---

## TPS-M09 — Youth Safety

**[TPS-M09]** Future versions involving minors require **additional protections** [DG-004] — designed **before** expanding to younger participants.

| Protection | Status |
|------------|--------|
| Age-appropriate experiences | future design |
| Guardian workflows (where legally required) | future |
| Additional moderation | future |
| Restricted public visibility | default for minors |
| Enhanced privacy defaults | default for minors |

**[TPS-M09a]** V1 target age 16–24 [USR-001] — conservative defaults apply to all; minor-specific flows deferred.

**[TPS-M09b]** Architecture must **anticipate** guardian consent without requiring V1 implementation.

---

## TPS-M10 — Community Safety

**[TPS-M10]** Participants should be able to:

| Action | V1 |
|--------|-----|
| Report concerns | placeholder + contact |
| Block unwanted interactions | future |
| Mute communications | future |
| Control invitations | ✅ (decline invite) |
| Leave communities | future |
| Manage connections | partial |

**[TPS-M10a]** Safety tools should be **easy to find** — prominent in Trust Center [TPS-M16].

**[TPS-M10b]** Reporting flows to admin moderation framework [Phase 4.6] — audit trail required.

---

## TPS-M11 — Identity Protection

**[TPS-M11]** Authentication and participant identity are **separate concepts** [PEP-M21, REL-M14].

**[TPS-M11a]** The platform protects:

| Asset | Protection |
|-------|------------|
| Account access | Auth credentials separate from profile |
| Personal identity | Visibility controls [TPS-M07] |
| Relationship history | Append-only; participant-owned [PRN-M05] |
| Community participation | Preserved on life changes [PEP-M16] |
| Historical contributions | Civic Passport never deleted [CPP-001] |

**[TPS-M11b]** Participants **retain ownership** of their organizing history — exportable via Trust Center [TPS-M16].

**[TPS-M11c]** Account deletion vs history: soft-delete account; preserve anonymized contribution graph per policy (future legal review).

---

## TPS-M12 — Transparency

**[TPS-M12]** The platform explains in **plain language**:

| Topic | Where |
|-------|-------|
| What information is stored | Trust Center · Data inventory |
| Why it is stored | Purpose statements per field |
| How it is used | Ethical use policy [TPS-M14] |
| Who can see it | Visibility preview |
| How to update or remove | Trust Center actions |

**[TPS-M12a]** Plain language preferred over technical jargon — every data field has a **"why we ask"** tooltip.

**[TPS-M12b]** Opportunity explanations [OBE-001]: "Suggested because you share a county" — never black box [TPS-M15].

---

## TPS-M13 — Trust Signals

**[TPS-M13]** The platform reinforces trust through:

| Signal | Implementation |
|--------|----------------|
| Clear privacy indicators | Lock icons + visibility labels on profile elements |
| Visible account security | Trust Center security section |
| Verification status | future — optional, never required for belonging |
| Explanation of recommendations | Transparent reasoning [TPS-M12b] |
| Community guidelines | Link from Trust Center |
| Consistent interface behavior | Same visibility rules everywhere |

**[TPS-M13a]** Participants should **never feel uncertain** about how the platform operates.

**[TPS-M13b]** Share landing [PAGE-SHARE] displays trust badge: "Your information is private until you choose to share."

---

## TPS-M14 — Ethical Use of Data

**[TPS-M14]** Participant information **should support**:

| Permitted use | Example |
|---------------|---------|
| Relationship building | PRN, RGE attribution |
| Community organizing | County/campus dashboards |
| Volunteer coordination | future |
| Leadership development | Journey, milestones |
| Platform improvement | Aggregated, anonymized analytics |

**[TPS-M14a]** **Should not** be used for:

- Selling data to third parties
- Surveillance or monitoring without consent
- Popularity rankings or public recruit leaderboards [PRN-M13b, RGE-M13]
- Political targeting outside platform mission
- Anything contradicting participant expectations [CP-007]

**[TPS-M14b]** Cross-ref [KDG-M01] governance — participant data is never **Open** class without explicit consent.

---

## TPS-M15 — Future AI Principles

**[TPS-M15]** When AI capabilities are introduced [Phase 6]:

| Principle | Rule |
|-----------|------|
| Disclosure | Participants know when AI is assisting |
| Control | Participants retain control over important decisions |
| Explainability | AI recommendations include reasoning |
| No silent modification | AI never silently modifies participant information |
| Human primary | Human judgment remains primary |

**[TPS-M15a]** AI settings live in Trust Center — off by default until participant opts in.

**[TPS-M15b]** Morning Brief [PCC-M17] AI-enhanced summaries require explicit opt-in when AI layer added.

---

## TPS-M16 — Trust Center Architecture

**[TPS-M16]** Introduce the **Trust Center** — a dedicated participant space, not scattered privacy settings.

> The goal is not just controls — it is **confidence**. Participants leave feeling the platform respects them, explains itself, and gives meaningful control.

**[TPS-M16a]** Trust Center sections:

| Section | Content |
|---------|---------|
| **Privacy settings** | Visibility per element [TPS-M07] |
| **Visibility controls** | Preview "who sees what" |
| **Connected communities** | County, campus, committees |
| **Connected devices** | Active sessions (future) |
| **Login history** | Recent sign-ins (future) |
| **Data download** | Export my data [TPS-M11b] |
| **Communication preferences** | cross-ref CAM-001 |
| **AI assistance settings** | future [TPS-M15] |
| **Security recommendations** | Password, 2FA future |
| **How we use your information** | Transparency inventory [TPS-M12] |

**[TPS-M16b]** Route: `[PAGE-TRUST]` at `/trust-center` — accessible from Command Center header, HQ settings, and registration consent flow.

**[TPS-M16c]** Architecture:

```
TrustCenter
├── assembleTrustCenter(participantId) → section payloads
├── visibilityEngine(element, viewer) → boolean
├── consentLog → append-only audit
└── dataInventory → field-level purpose statements
```

**[TPS-M16d]** **Visibility engine** is shared infrastructure — every widget, landing page, and recommendation checks `visibilityEngine()` before render [TPS-M07].

**[TPS-M16e]** V1: Trust Center shell + visibility defaults + data inventory page + consent on registration.

---

## TPS-M17 — Cross-System Integration

**[TPS-M17]** Trust infrastructure integrates across Phase 3:

| System | Trust integration |
|--------|---------------------|
| PHQ / PCC [PHQ-M16] | Privacy settings link; visibility on profile elements |
| PRN [PRN-M16] | Trust Graph respects visibility; no exposing private edges |
| RGE [RGE-M07] | Landing page respects inviter visibility settings |
| JRN [JRN-M13] | Journey stage visibility; no pressure via exposure |
| CPP [CPP-001] | Passport public view is privacy-filtered [PEP-M20] |
| Organizing Circles [RGE-M15] | Private to participant — never org-visible |

**[TPS-M17a]** **No feature ships without visibility review** — production code gate extension [TR-MOTTO].

**[TPS-M17b]** Trust Center linked from Command Center Quick Actions: "Privacy & Trust."

---

## TPS-M18 — V1 Scope

**[TPS-M18]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| Trust philosophy documented | ✅ this document |
| Visibility model + defaults | ✅ schema + defaults table |
| Data minimization | ✅ registration fields only |
| Trust Center shell | `/trust-center` basic page |
| Visibility settings | name, county, campus, mission |
| Registration consent | plain-language on join flow |
| Share landing trust signal | privacy badge on PAGE-SHARE |
| Safety placeholder | report contact link |
| Audit log schema | consent events append-only |

**[TPS-M18a]** Deferred: block/mute, guardian workflows, data export, login history, AI settings, full visibility engine.

---

## TPS-BG — Burt Implementation Guidance

**[TPS-BG]** Implementation should:

1. **Adopt privacy-by-design** — visibility check before every render [TPS-M16d]
2. **Separate authentication from profiles** — auth table ≠ participant graph [TPS-M11]
3. **Provide understandable privacy controls** — Trust Center, not scattered toggles [TPS-M16]
4. **Support configurable visibility levels** — enum + per-element override [TPS-M07]
5. **Maintain audit logs** — consent + visibility changes append-only [TPS-M08]
6. **Design safety as first-class** — report, block hooks in Trust Center [TPS-M10]

**[TPS-BG-a]** Recommended file structure:

```
src/app/(participant)/trust-center/page.tsx    # [PAGE-TRUST]
src/components/trust/TrustCenterShell.tsx
src/lib/trust/visibilityEngine.ts
src/lib/trust/assembleTrustCenter.ts
src/lib/trust/consentLog.ts
data/registry/trust-privacy-safety.json
data/registry/visibility-defaults.json         # V1 defaults
```

**[TPS-BG-b]** Database:

| Table / field | Purpose |
|---------------|---------|
| `users.visibility_settings` | JSON per-element visibility |
| `consent_events` | Append-only consent audit |
| `safety_reports` | Participant reports (future) |

**[TPS-BG-c]** Every API returning participant data must call `visibilityEngine()` — never return fields viewer cannot see.

---

## AC-026 — Acceptance Criteria

Step 3.7 is complete when:

- [x] **[AC-026a]** Trust philosophy documented — trust as infrastructure. `[TPS-M01, TPS-M03]`
- [x] **[AC-026b]** Privacy and visibility models established. `[TPS-M04, TPS-M07]`
- [x] **[AC-026c]** Data minimization principles defined. `[TPS-M05]`
- [x] **[AC-026d]** Safety and transparency expectations documented. `[TPS-M09, TPS-M10, TPS-M12]`
- [x] **[AC-026e]** Trust Center architecture specified. `[TPS-M16]`
- [x] **[AC-026f]** Ethical use and future AI principles documented. `[TPS-M14, TPS-M15]`
- [x] **[AC-026g]** Cross-system integration mapped. `[TPS-M17]`
- [x] **[AC-026h]** Burt has blueprint for trust as foundational infrastructure. `[TPS-BG, trust-privacy-safety.json]`

---

**Next Step:** 3.14 — Participant Experience

*Trace: Trust → Invitations [RGE] → Relationships [PRN] → Communities → CP-007 privacy by design*
