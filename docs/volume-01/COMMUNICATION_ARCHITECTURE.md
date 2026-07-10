# Build Volume 1.12 — Notification & Communication Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.12 · **ENG-012**  
**Artifact:** `COMMUNICATION_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Attention Management Engine](ATTENTION_MANAGEMENT_ENGINE.md) [AME-001]  
**Builds on:** [1.9 Events & Timelines](EVENT_TIMELINE_ARCHITECTURE.md) [ENG-009] · [1.6 Authorization](AUTHORIZATION_ARCHITECTURE.md) [ENG-006] · [Communication Service](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-DS19]  
**Phase alignment:** [Communication & Attention Management](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) [CAM-001] · [Community Communication Network](../phase-04/COMMUNITY_COMMUNICATION_NETWORK.md) [CCNET-001]  
**Live spec:** `data/registry/communication-architecture.json`

---

## ENG-CM01 — Purpose

**[ENG-CM01]** The Notification & Communication Architecture defines how **information moves** through the Community Operating System.

**[ENG-CM01a]** Objective is **not** to send more notifications — it is to deliver the **right information, to the right people, at the right time, through the right channel**, while minimizing distraction and respecting preferences [CAM-001].

**[ENG-CM01b]** Communication should **strengthen relationships** rather than compete for attention [CP-016 · GCN-M03].

---

## ENG-CM02 — Guiding Principle

**[ENG-CM02]**

> **Communication should create clarity, not noise.**

**[ENG-CM02a]** Every message should have a **purpose**.

---

## ENG-CM03 — Philosophy

**[ENG-CM03]** Most platforms measure success by messages sent.

**The COS measures success by:**

| Outcome | Meaning |
|---------|---------|
| Messages **understood** | Clear actionable content |
| Opportunities **discovered** | DGE + comms alignment |
| Communities **strengthened** | Relationship-centered |
| People **connected** | PRN · invitations |
| Action **taken** | Conversion without pressure |

**[ENG-CM03a]** Communication exists to **support community life** — not maximize engagement metrics [GCN-M03 · CAM-M13 Attention Budget].

---

## ENG-CM04 — Communication Architecture

**[ENG-CM04]** Five distinct layers:

```text
Events
      ↓
Notification Engine
      ↓
Communication Rules
      ↓
Delivery Channels
      ↓
Participant Experience
```

**[ENG-CM04a]** Each layer has a **distinct responsibility** — no layer skips another [CAM-001 policy vs transport separation].

---

## ENG-CM05 — Layer 1 — Platform Events

**[ENG-CM05]** Notifications originate from **meaningful platform events** [ENG-009 · ENG-ET23]:

Community joined · mission assigned · volunteer opportunity posted · event reminder · story published · leadership assignment · mentorship request · community announcement

**[ENG-CM05a]** Notifications are **always event-driven** — never ad-hoc polling loops from UI.

**Source:** `platform.domain_events` → notification pipeline

---

## ENG-CM06 — Layer 2 — Notification Engine

**[ENG-CM06]** The **Notification Engine** determines:

Who receives · whether notification is appropriate · priority · delivery timing · grouping · escalation

**[ENG-CM06a]** Engine **prevents unnecessary communication** — default is defer/digest unless urgency warrants immediate delivery.

**Kernel path:** `src/lib/kernel/notifications/engine.ts`

**Companion:** [Attention Management Engine](ATTENTION_MANAGEMENT_ENGINE.md) [AME-001] evaluates *when* and *how* — not just *whether*.

---

## ENG-CM07 — Layer 3 — Communication Rules

**[ENG-CM07]** Rules evaluate:

Permissions [PRE-001] · community membership · participant preferences · quiet hours · time zone · role · current activity · notification fatigue

**[ENG-CM07a]** Communication becomes **personalized** — rules in DCL `communication_rules` [DCL-001] · overridable per community charter [CCN-001].

---

## ENG-CM08 — Layer 4 — Delivery Channels

**[ENG-CM08]** Supported channels — **interchangeable modules**:

| Channel | V1 | Future |
|---------|-----|--------|
| In-app notifications | ✅ | — |
| Email | ✅ | — |
| Push notifications | Planned | — |
| SMS | — | ✅ |
| Calendar integration | — | ✅ |
| Webhooks | — | ✅ |
| Third-party tools (Slack, etc.) | — | ✅ |

**[ENG-CM08a]** Platform chooses **most appropriate channel** per priority + preferences — not blast-all-channels.

**Path:** `src/lib/kernel/notifications/channels/{in_app,email,push}/`

---

## ENG-CM09 — Layer 5 — Participant Experience

**[ENG-CM09]** Participants experience:

Notification Center · daily digest · weekly digest · urgent alerts · announcements · reminders · mentions · invitations

**[ENG-CM09a]** Communication feels **organized** — PHQ integration [PHQ-001 · UXB-001].

---

## ENG-CM10 — Communication Categories

**[ENG-CM10]** Categories for preference control:

Community · mission · volunteer · leadership · mentorship · knowledge · story · growth · partnership · administrative · system

**[ENG-CM10a]** Maps to `event_category` where applicable [ENG-ET16] · extensible via DCL.

---

## ENG-CM11 — Notification Priorities

**[ENG-CM11]** Every notification has priority:

| Priority | Examples | Default delivery |
|----------|----------|------------------|
| **Critical** | Security · account protection · immediate operational issues | Immediate · all enabled channels |
| **Important** | Leadership assignments · volunteer commitments · mentorship · community announcements | Immediate in-app + email if enabled |
| **Informational** | Stories · recognition · updates · new resources | In-app · digest-eligible |
| **Optional** | Suggested opportunities · recommendations · discovery [DGE-001] | Digest only · participant opt-in |

**[ENG-CM11a]** Participants **control optional** communication entirely [CAM-M13].

---

## ENG-CM12 — Notification Center

**[ENG-CM12]** Unified hub per participant:

Unread · read · pinned · archived · search · filter by category · action history

**Storage:** `platform.notifications` · `identity.notification_read_state`

**[ENG-CM12a]** Notification Center is the participant's **communication hub** — not scattered badges across app.

---

## ENG-CM13 — Communication Preferences

**[ENG-CM13]** Participants control:

Delivery channels · categories · digest frequency · quiet hours · community-specific settings · mentorship · leadership notifications

**Storage:** `identity.communication_preferences`

**[ENG-CM13a]** Preferences remain **simple and understandable** [TPS-M06 · CAM-M08].

---

## ENG-CM14 — Quiet Hours

**[ENG-CM14]** Participants define:

Quiet hours · weekend preferences · vacation mode · temporary pauses · emergency exceptions (critical only)

**[ENG-CM14a]** Platform **respects personal time** — AME defers non-critical during quiet hours [AME-001].

---

## ENG-CM15 — Digest Engine

**[ENG-CM15]** Intelligently **combine related information** [CAM-M13 Attention Budget]:

Today's volunteer opportunities · upcoming events · community announcements · leadership reminders · mentorship activity · knowledge updates

**[ENG-CM15a]** Digests **reduce fatigue** — one email/day default for informational · configurable.

**Path:** `src/lib/kernel/notifications/digest.ts`

---

## ENG-CM16 — Smart Grouping

**[ENG-CM16]** Related notifications **grouped**:

Five volunteer reminders → **one volunteer summary**

**[ENG-CM16a]** Grouping keys: `(participant_id, category, aggregate_id, time_window)` · AME decides window [AME-001].

---

## ENG-CM17 — Actionable Notifications

**[ENG-CM17]** Every notification answers:

What happened? · Why does it matter? · What can I do? · Where do I go?

**[ENG-CM17a]** Payload includes `action_url` · `action_label` · deep link to relevant surface [UXB-001].

---

## ENG-CM18 — Community Announcements

**[ENG-CM18]** Communities publish [CCNET-001]:

Meeting announcements · volunteer requests · upcoming events · recognition · stories · emergency updates

**[ENG-CM18a]** Visibility respects **community boundaries** · PRE on publish and delivery [ENG-AU09].

---

## ENG-CM19 — Communication Timeline

**[ENG-CM19]** Per-participant communication history:

Messages received · announcements · invitations · responses · read status · preference changes

**[ENG-CM19a]** Improves **transparency** — aligns with participant timeline [ENG-ET07 · CJT-001].

**Storage:** append-only `platform.communication_log`

---

## ENG-CM20 — Delivery Reliability

**[ENG-CM20]** Architecture supports:

Retries · delivery confirmation · failure logging · fallback channels · queue processing

**[ENG-CM20a]** Reliable communication builds **trust** [OLB-001 · ENG-ET24 event bus prep].

**V1:** Postgres outbox table · background worker · v1.1+ external queue.

```sql
platform.notification_outbox (
  id uuid PRIMARY KEY,
  notification_id uuid NOT NULL,
  channel text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz,
  delivered_at timestamptz,
  error text
);
```

---

## ENG-CM21 — Explainability

**[ENG-CM21]** Participants understand:

Why they received it · which community triggered it · how to change preferences · why prioritized

**[ENG-CM21a]** `explanation` field on every notification — mirrors PRE pattern [PRE-001 · TPS-M12].

---

## ENG-CM22 — Privacy

**[ENG-CM22]** Communication respects:

Permissions · visibility · community membership · blocked participants · sensitive information · communication preferences

**[ENG-CM22a]** **Privacy always precedes convenience** [TPS-001 · DG-004] — never leak via notification preview text.

---

## ENG-CM23 — Attention Management Engine

**[ENG-CM23]** Notifications alone are too narrow — **[Attention Management Engine](ATTENTION_MANAGEMENT_ENGINE.md) [AME-001]** protects participant attention.

**[ENG-CM23a]** Asks: *Is this the right time and the right way to communicate this?* — not merely *Should we send?*

**[ENG-CM23b]** Extends [CAM-001](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) at engineering implementation layer.

---

## ENG-CM24 — Future AI Assistance

**[ENG-CM24]** AI may:

Summarize notifications · prioritize important items · suggest follow-up · draft responses · recommend timing · generate digest summaries

**[ENG-CM24a]** AI **assists** — does not replace participant choice [AIB-001 · CAM-M15 · ENG-ET27 never rewrite history].

---

## ENG-CM25 — Burt Implementation Guidance

**[ENG-CM25]** Implementation should:

- **Separate** notification generation from delivery [ENG-CM04]
- Build **centralized Notification Engine** + **AME** [ENG-CM06 · AME-001]
- Support **configurable communication rules** [DCL-001]
- **Respect preferences** at every stage [ENG-CM07]
- Design channels as **interchangeable modules** [ENG-CM08]
- Prepare for **future providers** without architectural change
- Publish from domain events only [ENG-CM05]
- CCNET content → CAM/AME policy → transport [CCNET-001]

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [ENG-009 Events](EVENT_TIMELINE_ARCHITECTURE.md) | Event-driven source |
| [ENG-DS19](DOMAIN_SERVICE_ARCHITECTURE.md) | Communication Service ownership |
| [CAM-001](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) | Attention budget philosophy |
| [CCNET-001](../phase-04/COMMUNITY_COMMUNICATION_NETWORK.md) | Community messaging content |
| [DGE-001](DISCOVERY_ENGINE.md) | Optional-priority discovery cards |
| [AME-001](ATTENTION_MANAGEMENT_ENGINE.md) | Attention protection |

---

## AC-101 — Acceptance Criteria

Volume 1.12 is complete when:

- [x] **[AC-101a]** Communication philosophy documented. `[ENG-CM02, ENG-CM03]`
- [x] **[AC-101b]** Notification architecture established (5 layers). `[ENG-CM04–ENG-CM09]`
- [x] **[AC-101c]** Priorities, preferences, digests, and delivery rules defined. `[ENG-CM11–ENG-CM16, ENG-CM20]`
- [x] **[AC-101d]** Privacy and explainability incorporated. `[ENG-CM21, ENG-CM22]`
- [x] **[AC-101e]** Attention Management Engine specified. `[ENG-CM23, AME-001]`
- [x] **[AC-101f]** Burt has blueprint for communication. `[communication-architecture.json]`

---

**Note:** Step **1.5 API** [ENG-005] remains pending.

**Next recommended step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005] *(Volume 1 sequence gap)*

**End of Volume 1.12 — Notification & Communication Architecture.**
