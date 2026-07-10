# Discovery Engine

**Document ID:** DGE-001  
**Artifact:** `DISCOVERY_ENGINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [Search & Discovery Architecture](SEARCH_ARCHITECTURE.md) [ENG-010 · ENG-SR24]

**Live spec:** `data/registry/discovery-engine.json`

> **Proactive discovery** — surface meaningful opportunities before the participant searches.

---

## DGE-M01 — Purpose

**[DGE-M01]** The **Discovery Engine** continuously surfaces meaningful connections based on **context** — search is one input, not the only path.

**[DGE-M01a]** Shifts the platform from *"you must know what to look for"* to *"here is what might matter now"* — while respecting privacy, permissions, and **participant choice** [TPS-001 · PCN-M12a].

**[DGE-M01b]** Draws on: **CKG** [ENG-008] · **Community Brain** [CKLS-001] · **Personal Organizing Network** [PRN-001] · **Living Digital Twin** [LDT-001] · **Intelligence Service** [ENG-DS20].

---

## DGE-M02 — Guiding Principle

**[DGE-M02]**

> **Suggest — never decide. Explain — never obscure.**

**[DGE-M02a]** Every surfaced item is **dismissible** · **snoozeable** · **never auto-commits** the participant to action.

---

## DGE-M03 — Discovery Surfaces

**[DGE-M03]** Engine feeds curated cards to:

| Surface | Context |
|---------|---------|
| **Personal HQ dashboard** [PHQ-001] | Participant twin · interests · history |
| **Community home** | Community twin · local needs |
| **County organizing** [CNTY-001] | County twin · regional gaps |
| **Mission planning** | Related playbooks · past missions |
| **Empty search** | Discovery pages [ENG-SR19] |
| **Welcome journey** [WBS-001] | Next belonging step |

---

## DGE-M04 — Example Highlights

**[DGE-M04]** When a participant opens their dashboard, the engine may highlight:

- Volunteer opportunity matching interests · skills [Capacity · Opportunity]
- Nearby community event [Experience · Geographic]
- New playbook related to planned mission [Knowledge · CKG]
- Mentor with relevant experience [Leadership graph · PRN]
- Story from campus tackling similar challenge [Story · CKG]
- County requesting support aligned with skills [County twin · Growth]

**[DGE-M04a]** Each card includes **explanation** + **evidence path** [ENG-KG19 · PRE-001].

---

## DGE-M05 — Processing Pipeline

```text
Participant context (twin · session · community scope)
        ↓
Candidate generation (CKG · search index · intelligence)
        ↓
PRE filter (permissions · visibility)
        ↓
Ranking (ENG-SR17 factors + freshness + diversity)
        ↓
Explainability layer
        ↓
Surface cards (max N per session · no spam)
        ↓
Feedback (dismiss · save · acted_on) → ranking tune
```

**[DGE-M05a]** Runs on **dashboard load** + **daily digest** optional · not realtime push unless opted in [Communication Service].

---

## DGE-M06 — Discovery Card Contract

```typescript
interface DiscoveryCard {
  id: string;
  type: "opportunity" | "event" | "story" | "playbook" | "mentor" | "community" | "knowledge";
  title: string;
  summary: string;
  targetEntity: { type: string; id: string };
  explanation: {
    factors: string[];
    relationshipPath?: GraphEdge[];
  };
  priority: number;
  expiresAt?: string;
  actions: ("view" | "save" | "dismiss" | "snooze")[];
}
```

---

## DGE-M07 — Diversity & Safety

**[DGE-M07a]** **Diversity rules** — avoid filter bubbles · cap same-type cards · rotate communities.

**[DGE-M07b]** **No engagement traps** [GCN-M03] — no infinite scroll of suggestions · finite curated set.

**[DGE-M07c]** **Youth safety** [TPS-M09] — stricter PRE policies on people-discovery for minors.

---

## DGE-M08 — V1 Scope

**[DGE-M08a]** V1: **3 card types** on PHQ — volunteer opportunity · nearby event · related story (rule-based, not ML).

**[DGE-M08b]** Full ranking · intelligence integration · AI query generation — v1.1+ [AIB-001].

**Path:** `src/lib/kernel/discovery/` · consumed by Search Service [ENG-DS21]

---

## DGE-M09 — Feedback Loop

**[DGE-M09]** Track dismissals and actions (not clicks for engagement) — improve relevance · never sell data [TPS-M14].

**Storage:** `identity.discovery_feedback` · aggregate anonymized for intelligence [ENG-DS20].

---

## AC-098 — Acceptance Criteria

- [x] **[AC-098a]** DGE purpose and surfaces documented. `[DGE-M01, M03]`
- [x] **[AC-098b]** Pipeline and card contract specified. `[DGE-M05, M06]`
- [x] **[AC-098c]** Safety, V1 scope, and feedback defined. `[DGE-M07, M08, M09]`

---

**End of Discovery Engine.**
