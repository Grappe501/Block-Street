# Living History Engine

**Document ID:** LHE-001  
**Artifact:** `LIVING_HISTORY_ENGINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [Event & Timeline Architecture](EVENT_TIMELINE_ARCHITECTURE.md) [ENG-009 · ENG-ET25]

**Live spec:** `data/registry/living-history-engine.json`

> Continuously assembles events into **meaningful narratives** — not just chronological lists.

---

## LHE-M01 — Purpose

**[LHE-M01]** The **Living History Engine (LHE)** transforms raw domain events into **readable histories** that strengthen institutional memory.

**[LHE-M01a]** Users see **coherent stories** about how people, communities, and initiatives evolved — with **full drill-down** to underlying events for transparency [TPS-M12].

**[LHE-M01b]** Aligns with [CLS-001](../phase-04/COMMUNITY_LEGACY_SYSTEM.md) Arkansas Living History · [CJT-001](../phase-03/CIVIC_JOURNEY_TIMELINE.md) civic journey narratives.

---

## LHE-M02 — Guiding Principle

**[LHE-M02]**

> **History should be approachable without sacrificing completeness.**

**[LHE-M02a]** Summaries are **projections** — events remain canonical truth [ENG-ET18].

---

## LHE-M03 — Milestone Detection

**[LHE-M03]** LHE understands **sequences and milestones** from event patterns:

| Entity | Example milestones |
|--------|-------------------|
| **Community** | Founded · first Welcome Week · 100 participants · first regional partnership · first neighboring campus · alumni mentor network · annual service tradition |
| **Participant** | Joined via invitation · first volunteer experience · committee organizer · mentored five participants · launched county community · alumni mentor after graduation |
| **Mission** | Proposed · approved · first volunteer · completed · lesson captured · playbook derived |
| **County** | First community · institution partnership · statewide initiative participation |

**[LHE-M03a]** Milestone rules configurable in DCL `history_milestones` [DCL-001].

---

## LHE-M04 — Narrative Assembly

**[LHE-M04a]** Output structure:

```typescript
interface HistoryNarrative {
  entityType: string;
  entityId: string;
  title: string;                    // e.g. "Fayetteville Community — First Year"
  summary: string;                  // human-readable paragraph
  milestones: MilestoneHighlight[];
  eventRange: { from: string; to: string };
  evidenceEventIds: string[];     // drill-down links
  generatedAt: string;
  version: number;
}
```

**[LHE-M04b]** Every sentence in `summary` maps to **evidence event IDs** — explainable like PRE [PRE-001].

---

## LHE-M05 — Processing Pipeline

**[LHE-M05]**

```text
domain_events (new batch)
        ↓
Milestone rule evaluation
        ↓
Narrative segment update (incremental)
        ↓
history_narratives table / cache
        ↓
UI · Twin · AI consumption
```

**[LHE-M05a]** Runs **incrementally** on event publish — not full recompute on every read.

**[LHE-M05b]** Full rebuild available for admin · migration · drift correction.

---

## LHE-M06 — Storage Pattern

```sql
platform.history_narratives (
  id uuid PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  narrative_type text NOT NULL,   -- summary, anniversary, annual_report
  content jsonb NOT NULL,         -- HistoryNarrative shape
  evidence_event_ids uuid[] NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);
```

**[LHE-M06a]** Narratives are **derived** — safe to regenerate from events.

---

## LHE-M07 — Views & Surfaces

| Surface | Narrative type |
|---------|----------------|
| **Community dashboard** | Community living history |
| **Civic Passport** [CJT-001] | Participant journey summary |
| **Community Legacy** [CLS-001] | Anniversaries · traditions |
| **Annual reports** | AI-assisted · human approved |
| **Digital Twin** [LDT-001] | Timeline summary dimension |

---

## LHE-M08 — AI Role

**[LHE-M08a]** AI may **draft** narrative prose from milestone + event evidence.

**[LHE-M08b]** Human or community admin **approves** before publication to legacy surfaces [AIB-001 · CLS-001].

**[LHE-M08c]** AI **never deletes or modifies** source events [ENG-ET27].

---

## LHE-M09 — V1 Scope

**[LHE-M09a]** V1: chronological timeline view + **3 hardcoded milestone rules** (community launch, 100 members, first mission complete).

**[LHE-M09b]** Full LHE narrative generation · DCL milestone config · AI drafts — v1.1+.

**Kernel path:** `src/lib/kernel/history/`

---

## AC-096 — Acceptance Criteria

- [x] **[AC-096a]** LHE purpose and milestone detection documented. `[LHE-M01, M03]`
- [x] **[AC-096b]** Narrative assembly and pipeline specified. `[LHE-M04, M05]`
- [x] **[AC-096c]** Storage, surfaces, AI boundaries, and V1 scope defined. `[LHE-M06–M09]`

---

**End of Living History Engine.**
