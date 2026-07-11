# Mission Board (Live)

**Document ID:** PHASE-007.4  
**Requirement:** MBD-001  
**Status:** Canonical  
**Phase:** 7 — Intelligence Layer

> The operational heartbeat — missions, not tasks.

**Implements:** [OIS-M16](../phase-02/STATEWIDE_OUTREACH_INTELLIGENCE.md) · **Extends:** [OIS-001](../phase-02/STATEWIDE_OUTREACH_INTELLIGENCE.md) · [Action OS](../phase-05/ACTION_CONSTITUTION.md)  
**Live spec:** `data/registry/live-mission-board.json` · **Build:** [LIVE_MISSION_BOARD.md](LIVE_MISSION_BOARD.md) · **API:** `/api/missions`

---

## Purpose

**[MBD-M01]** The Mission Board becomes the **operational heartbeat** of the intelligence layer. Users see **missions** — prioritized, impact-scored opportunities — not disconnected task lists.

---

## Mission Categories

**[MBD-M02]** Today · This Week · Urgent · Campaign · County · Volunteer · Organization · Legislation · Personal

---

## Mission Cards

**[MBD-M03]** Card structure [OIS-M16]:

```text
Recruit 5 volunteers
★★★★☆ Impact — High
Estimated time: 35 minutes
```

Each card: `category` · `reason` · `actionLabel` · `priority` · `impact` · `estimatedTime` · `expiresAt?`

---

## Mission Intelligence

**[MBD-M04]** Automatically creates missions from: analytics · calendar · deadlines · relationships · events · email · SMS · volunteer shortages · county needs · goals

---

## Mission Prioritization

**[MBD-M05]** Impact · urgency · difficulty · deadline · dependencies · travel · availability

---

## Mission Completion Analytics

**[MBD-M06]** Success rate · completion time · leadership growth · volunteer growth · county impact

---

## Deliverable

**[MBD-M07]** AI-assisted operational mission system — live, intelligent, continuously prioritized.

**Acceptance:** `AC-169`
