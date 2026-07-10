# Attention Management Engine

**Document ID:** AME-001  
**Artifact:** `ATTENTION_MANAGEMENT_ENGINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [Communication Architecture](COMMUNICATION_ARCHITECTURE.md) [ENG-012 · ENG-CM23]

**Phase alignment:** [Communication & Attention Management](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) [CAM-001 · CAM-M13 Attention Budget]  
**Live spec:** `data/registry/attention-management-engine.json`

> Protect participant attention — not maximize interruptions.

---

## AME-M01 — Purpose

**[AME-M01]** The **Attention Management Engine (AME)** responsibility is **protecting participant attention** — not simply sending messages.

**[AME-M01a]** Continuously considers context before any notification leaves the Notification Engine [ENG-CM06].

**[AME-M01b]** Implements [CAM-001](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) Attention Budget at runtime — engineering companion to phase policy.

---

## AME-M02 — Guiding Principle

**[AME-M02]**

> **Is this the right time and the right way to communicate this?**

**Not:** *Should we send this notification?*

---

## AME-M03 — Input Signals

**[AME-M03]** AME evaluates:

| Signal | Source |
|--------|--------|
| **Current activity** | Session · last action |
| **Calendar commitments** | Experience Service · future integration |
| **Notification history** | Recent volume · fatigue score |
| **Community responsibilities** | Roles · leadership · open actions |
| **Message urgency** | Priority [ENG-CM11] |
| **Preferred communication style** | Preferences [ENG-CM13] |
| **Existing workload** | Open tasks · commitments [CFS-001] |
| **Time of day** | Timezone · quiet hours [ENG-CM14] |

---

## AME-M04 — Decision Outcomes

**[AME-M04]** AME returns one of:

| Outcome | Meaning |
|---------|---------|
| `deliver_now` | Immediate — critical/important + not quiet |
| `deliver_in_app_only` | No email/push — lower intrusion |
| `defer_to_digest` | Batch with related items |
| `defer_until` | Specific datetime (after event, after quiet hours) |
| `suppress` | Already acted · duplicate · fatigue cap |
| `collapse_group` | Merge into existing group summary |

---

## AME-M05 — Example Behaviors

**[AME-M05a]** Combine multiple **low-priority updates** into daily digest.

**[AME-M05b]** Delay **optional suggestions** [DGE-001] until after event concludes.

**[AME-M05c]** **Immediately surface** urgent leadership or security issues.

**[AME-M05d]** Highlight **one volunteer opportunity** instead of ten similar ones.

**[AME-M05e]** **Reduce repeated reminders** when participant already acted [CFS-001 follow-through].

---

## AME-M06 — Fatigue Model

**[AME-M06a]** Simple V1 fatigue score per participant:

```text
fatigue = notifications_last_24h * weight + emails_last_24h * weight2
```

**[AME-M06b]** Above threshold → informational becomes digest-only · optional suppressed until next day [CAM-M13].

**[AME-M06c]** Never suppress **critical** — only channel selection may adjust (e.g. in-app only during quiet with critical override flag).

---

## AME-M07 — Pipeline Integration

```text
domain_event
        ↓
Notification Engine (who, what, priority draft)
        ↓
AME.evaluate(participant, notification, signals)
        ↓
Outcome → deliver | defer | group | suppress
        ↓
Outbox → channel adapters
        ↓
Digest scheduler (batch deferred items)
```

**Path:** `src/lib/kernel/notifications/attention.ts`

---

## AME-M08 — Explainability

**[AME-M08]** Every deferred/suppressed notification logs **reason code**:

`QUIET_HOURS` · `FATIGUE_CAP` · `ALREADY_ACTED` · `GROUPED` · `DIGEST_SCHEDULED` · `DUPLICATE`

**[AME-M08a]** Participant may view *"Why didn't I get this immediately?"* in notification detail [ENG-CM21].

---

## AME-M09 — V1 Scope

**[AME-M09a]** V1 AME rules:

- Quiet hours defer (non-critical)
- Digest batch for informational
- Suppress duplicate same `(type, aggregate_id)` within 24h
- Group volunteer reminders by mission

**[AME-M09b]** Calendar awareness · ML fatigue · workload scoring — v1.1+.

---

## AME-M10 — AI Role

**[AME-M10a]** AI may **draft digest summaries** · suggest optimal send time — human/system rules approve.

**[AME-M10b]** AI **never overrides** critical security delivery or participant explicit channel preferences [CAM-M15].

---

## AC-102 — Acceptance Criteria

- [x] **[AC-102a]** AME purpose and guiding question documented. `[AME-M01, M02]`
- [x] **[AC-102b]** Input signals and decision outcomes specified. `[AME-M03, M04]`
- [x] **[AC-102c]** Behaviors, fatigue model, pipeline, and V1 scope defined. `[AME-M05–M09]`

---

**End of Attention Management Engine.**
