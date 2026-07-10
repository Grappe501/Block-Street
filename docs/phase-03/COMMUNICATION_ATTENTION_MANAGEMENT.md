# Communication & Attention Management System

**Document ID:** PHASE-003.10  
**Artifact:** `COMMUNICATION_ATTENTION_MANAGEMENT.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Earn attention. Never abuse it.**

This is not notification settings. It is **how people stay connected without becoming overwhelmed**. Attention is one of the platform's most valuable resources — we treat it respectfully.

**Builds On:** [Trust, Privacy & Digital Safety](TRUST_PRIVACY_DIGITAL_SAFETY.md) · [Personal Command Center](PERSONAL_COMMAND_CENTER.md) · [Project Constitution](../PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md) · [Core Principles](../build-steps/PHASE-001.3-CORE-PRINCIPLES.md)

**Live spec:** `data/registry/communication-attention-management.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CAM-M01 | Purpose |
| CAM-M02 | Guiding principle |
| CAM-M03 | Communication philosophy |
| CAM-M04 | Communication types |
| CAM-M05 | Delivery channels |
| CAM-M06 | Notification philosophy |
| CAM-M07 | Communication preferences |
| CAM-M08 | Smart digest |
| CAM-M09 | Community communication |
| CAM-M10 | Attention protection |
| CAM-M11 | Priority levels |
| CAM-M12 | Communication history |
| CAM-M13 | Attention Budget architecture |
| CAM-M14 | Morning Brief integration |
| CAM-M15 | Future intelligent communication |
| CAM-M16 | Trust Center integration |
| CAM-M17 | V1 scope |
| CAM-BG | Burt implementation guidance |
| AC-029 | Step 3.10 acceptance criteria |

---

## CAM-M01 — Purpose

**[CAM-M01]** This document defines how the platform **communicates with participants** while respecting their attention, preferences, and organizing priorities.

**[CAM-M01a]** The objective is to ensure participants receive the **right information at the right time** through the channels they choose.

**[CAM-M01b]** Communication should **strengthen relationships** rather than interrupt them [PRN-M02, RGE-M02].

**[CAM-M01c]** Terminology: **Communication & Attention Management System** (not "notification settings" alone).

---

## CAM-M02 — Guiding Principle

**[CAM-M02]**

> **Earn attention. Never abuse it.**

**[CAM-M02a]** Every message should have a **purpose**. If communication does not create value, it should not be sent.

**[CAM-M02b]** Constitutional alignment:

> **The platform exists to help people organize their lives, not compete for their attention.**

**[CAM-M02c]** Complementary principle from appreciation [CRA-M02]: respect builds trust; noise destroys it [SEC-001, TPS-M02].

---

## CAM-M03 — Communication Philosophy

**[CAM-M03]** The platform communicates to:

| Purpose | Example |
|---------|---------|
| **Inform** | County event this weekend |
| **Encourage** | Mission Board next step |
| **Coordinate** | Committee meeting reminder |
| **Teach** | Leadership lesson available |
| **Celebrate** | Community Gratitude received [CRA-M13] |
| **Support** | Mentor check-in |
| **Invite** | Personal referral [RGE-M11] |

**[CAM-M03a]** The platform should **never communicate simply because it can**.

**[CAM-M03b]** Every outbound message passes **Attention Budget** check [CAM-M13] before send.

---

## CAM-M04 — Communication Types

**[CAM-M04]** Different information deserves different treatment:

### Personal

Friend requests · Invitations · Mentorship · Direct messages · Personal reminders

*Default: in-platform + optional push; respects quiet hours*

### Community

Campus announcements · County updates · Committee news · Project updates · Volunteer opportunities

*Default: digest-eligible; participant subscribes per community*

### Platform

New features · Maintenance · Security · Training · Policy updates

*Default: email for security; in-platform for features*

### Emergency

Security notifications · Critical account issues · Urgent community alerts

*Bypasses quiet hours sparingly — max frequency capped [CAM-M10]*

**[CAM-M04a]** Type determines **default priority** [CAM-M11] and **Attention Budget cost** [CAM-M13].

---

## CAM-M05 — Delivery Channels

**[CAM-M05]** Participants choose preferred channels — **never forced** into unnecessary channels [TPS-M06]:

| Channel | V1 |
|---------|-----|
| In-platform | ✅ |
| Email | ✅ transactional |
| Text message (SMS) | future |
| Push notification | future |
| Calendar integration | future |
| Digest email | ✅ spec |
| Future messaging integrations | plugin architecture |

**[CAM-M05a]** Channel preferences stored separately from message content [CAM-BG].

**[CAM-M05b]** Registration: minimal email for account; marketing/updates **opt-in only**.

---

## CAM-M06 — Notification Philosophy

**[CAM-M06]** Every notification should answer:

1. **Why am I receiving this?**
2. **Why does it matter?**
3. **What action should I take?**

**[CAM-M06a]** Notifications **without clear value** should be avoided — blocked at Attention Budget layer [CAM-M13].

**[CAM-M06b]** Explainable notifications: `reason` field on every message — shown in UI and Trust Center history [CAM-M12].

**[CAM-M06c]** Cross-ref [OBE-001]: suggestions appear in Morning Brief / digest — not as interruptive push by default.

---

## CAM-M07 — Communication Preferences

**[CAM-M07]** Participants control in **Trust Center** [TPS-M16]:

| Preference | Default |
|------------|---------|
| Preferred channels | in-platform + email (security only) |
| Notification frequency | smart digest |
| Quiet hours | 10pm–8am local (configurable) |
| Digest options | Morning Brief on login |
| Community subscriptions | county + campus opted-in |
| Committee notifications | off until joined |
| Mentorship updates | on when mentoring edge exists |
| Volunteer reminders | off until volunteer signal |

**[CAM-M07a]** Preferences should be **understandable and easy to modify** — plain language, no jargon [TPS-M04].

**[CAM-M07b]** One-tap **"Pause all non-critical"** for overwhelm moments.

---

## CAM-M08 — Smart Digest

**[CAM-M08]** Instead of numerous individual notifications, support **summarized updates**:

| Digest | Cadence | Integration |
|--------|---------|-------------|
| **Morning Brief** | Each login | PCC-M17 [PCC-001] |
| Daily Digest | Once daily | email optional |
| Weekly Summary | Weekly | email optional |
| Monthly Impact Report | Monthly | passport highlights [CPP-001] |

**[CAM-M08a]** Participants choose cadence that works for them [CAM-M07].

**[CAM-M08b]** Morning Brief is **primary digest surface** — not a duplicate notification stream [PCC-M17b].

**[CAM-M08c]** Digest aggregator: `assembleDigest(participantId, cadence)` shares logic with `assembleMorningBrief()` [PCC-M17c].

---

## CAM-M09 — Community Communication

**[CAM-M09]** Communities communicate through **structured channels**:

- County announcements · Campus announcements · Committee updates · Project communications · Volunteer coordination

**[CAM-M09a]** Each participant decides **which communities they follow closely** — not auto-subscribed to all county noise.

**[CAM-M09b]** Community admins/moderators (Phase 4) send through platform — subject to Attention Budget for recipients.

**[CAM-M09c]** High-volume community → digest by default; critical-only immediate.

---

## CAM-M10 — Attention Protection

**[CAM-M10]** The platform should **avoid**:

| Anti-pattern | Protection |
|--------------|------------|
| Repeated reminders | Combine intelligently [CAM-M13] |
| Duplicate messages | Dedupe by `dedupeKey` |
| Notification overload | Attention Budget cap |
| Unnecessary urgency | Priority gating [CAM-M11] |
| Dark-pattern engagement | No streaks, no guilt copy [CRA-M12] |

**[CAM-M10a]** Respect for attention builds **long-term trust** [SEC-001, TPS-M02].

**[CAM-M10b]** Rate limits per sender, per community, per day — configurable in admin.

---

## CAM-M11 — Priority Levels

**[CAM-M11]** Every communication has defined **priority**:

| Priority | Key | Delivery default |
|----------|-----|------------------|
| Critical | `critical` | Immediate all channels (emergency only) |
| Important | `important` | In-platform + push if enabled |
| Informational | `informational` | In-platform; digest-eligible |
| Optional | `optional` | Digest only |
| Inspirational | `inspirational` | Morning Brief only |

**[CAM-M11a]** Participants customize delivery **by priority** [CAM-M07] — e.g. "only Critical breaks quiet hours."

**[CAM-M11b]** Schema: every `communication_event` includes `priority`, `type`, `reason`.

---

## CAM-M12 — Communication History

**[CAM-M12]** Participants access a **communication timeline** in Trust Center:

- Announcements · Messages · Notifications · Digests · Security notices

**[CAM-M12a]** Transparency reduces confusion — "Why did I get that?" always answerable [TPS-M12].

**[CAM-M12b]** Append-only audit; retention policy documented [KDG-M01].

**[CAM-M12c]** V1: in-platform notification list stub; full history v1.1.

---

## CAM-M13 — Attention Budget Architecture

**[CAM-M13]** Introduce the **Attention Budget** — innovative internal cap on communication volume.

> Each participant has a limited amount of communication the platform is willing to send before consolidating messages.

**[CAM-M13a]** Budget behavior examples:

| Without budget | With Attention Budget |
|----------------|----------------------|
| 3 small updates → 3 pings | 3 updates → 1 Morning Brief item |
| Several committee notices | 1 digest section |
| Repeated reminders | Intelligently combined |
| High-priority security alert | Still immediate — bypasses budget |

**[CAM-M13b]** Architecture:

```
AttentionBudget
├── dailySoftCap: number          # non-critical messages before consolidate
├── criticalBypass: true
├── consolidateInto: digest | morningBrief
├── orchestrator: applyAttentionBudget(participantId, message) → send | queue | merge
└── participantOverride: pauseAllNonCritical
```

**[CAM-M13c]** `applyAttentionBudget()` runs **before** any outbound delivery — single gate [CAM-BG].

**[CAM-M13d]** Participant experiences **less noise while staying fully informed** — sustainable as platform grows.

**[CAM-M13e]** V1: soft cap spec + Morning Brief as consolidator; full budget engine v1.1.

---

## CAM-M14 — Morning Brief Integration

**[CAM-M14]** Morning Brief [PCC-M17] is the **primary attention-respecting digest**:

| Brief item source | Budget treatment |
|-------------------|------------------|
| Gratitude received | inspirational priority |
| Invite accepted | informational |
| County volunteer need | optional → brief item |
| Journey milestone near | inspirational |
| Committee tomorrow | important → brief or immediate per prefs |

**[CAM-M14a]** Brief items **replace** would-be push notifications when budget consolidates [CAM-M13].

**[CAM-M14b]** Not a notification feed — meaningful summary [PCC-M17b, CAM-M08].

---

## CAM-M15 — Future Intelligent Communication

**[CAM-M15]** Future AI assists **attention management** — not noise [TPS-M15]:

- Summarize activity · Prioritize messages · Recommend follow-up
- Highlight important opportunities · Filter low-value notifications

**[CAM-M15a]** AI opt-in in Trust Center; never auto-enable [TPS-M15a].

**[CAM-M15b]** AI must **reduce** messages sent — Attention Budget enforced on AI suggestions too.

---

## CAM-M16 — Trust Center Integration

**[CAM-M16]** Communication preferences live in **Trust Center** [TPS-M16]:

| Section | CAM content |
|---------|-------------|
| Communication preferences | CAM-M07 full panel |
| Communication history | CAM-M12 timeline |
| AI assistance settings | CAM-M15 future |
| Quiet hours + pause | CAM-M10 |

**[CAM-M16a]** Command Center Communication widget [PCC-M14] shows **recent + digest preview** — link to Trust Center for full control.

**[CAM-M16b]** Cross-ref Step 5.7 messaging infrastructure [MSG-001] — CAM is **policy layer**; MSG is **transport layer**.

---

## CAM-M17 — V1 Scope

**[CAM-M17]** Design complete in Step 3.10; implementation post-V1 core:

| Deliverable | V1 |
|-------------|-----|
| Philosophy + Attention Budget spec | ✅ this document |
| Priority + type taxonomy | ✅ JSON |
| Morning Brief as primary digest | ✅ PCC-M17 |
| Trust Center prefs placeholder | section stub |
| Email transactional only | account + security |
| Full push/SMS/digest engine | v1.1+ |
| Communication history UI | v1.1 |

**[CAM-M17a]** Jul 12/14: **no notification spam** — transactional email only; in-platform Morning Brief on login.

---

## CAM-BG — Burt Implementation Guidance

**[CAM-BG]** Implementation should:

1. **Separate preferences from messaging infrastructure** — `communication_preferences` vs `messages` table [CAM-M16b]
2. **Support multiple delivery channels** — plugin adapters [CAM-M05]
3. **Design notifications to be explainable** — `reason` on every event [CAM-M06]
4. **Respect participant choices** — `applyAttentionBudget()` gate [CAM-M13]
5. **Optimize for mobile** — brief-first, not ping-first [PCC-M18]
6. **Allow future integrations** — SMS, push, Slack future as channel plugins

**[CAM-BG-a]** Recommended file structure:

```
src/lib/communication/applyAttentionBudget.ts
src/lib/communication/assembleDigest.ts
src/lib/communication/sendCommunication.ts
src/lib/communication/explainNotification.ts
data/registry/communication-attention-management.json
```

**[CAM-BG-b]** Database:

| Table | Purpose |
|-------|---------|
| `communication_preferences` | Participant channel + digest prefs |
| `communication_events` | Outbound audit + history |
| `communication_queue` | Budget-deferred messages for digest |

**[CAM-BG-c]** No feature ships bulk notifications without CAM review — production gate extension [TPS-M17a].

---

## AC-029 — Acceptance Criteria

Step 3.10 is complete when:

- [x] **[AC-029a]** Communication philosophy documented. `[CAM-M01, CAM-M03]`
- [x] **[AC-029b]** Notification and attention principles established. `[CAM-M02, CAM-M06, CAM-M10]`
- [x] **[AC-029c]** Participant-controlled preferences defined. `[CAM-M07]`
- [x] **[AC-029d]** Digest and priority concepts incorporated. `[CAM-M08, CAM-M11]`
- [x] **[AC-029e]** Attention Budget architecture specified. `[CAM-M13]`
- [x] **[AC-029f]** Morning Brief and Trust Center integration documented. `[CAM-M14, CAM-M16]`
- [x] **[AC-029g]** Burt has blueprint for respectful communication. `[CAM-BG, communication-attention-management.json]`

---

**Next Step:** 3.15 — Phase 3 Build Bible

*Trace: Attention Budget → Morning Brief → Trust Center prefs → less noise → sustained trust → invitations continue*
