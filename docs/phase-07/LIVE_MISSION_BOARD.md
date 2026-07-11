# Build 7.4 — Live Mission Board (OIS-M16)

**Document ID:** BUILD-007.4 · **MBD-001**  
**Artifact:** `LIVE_MISSION_BOARD.md`  
**Status:** Canonical  
**Phase:** 7 — Intelligence Layer  
**Supersedes build detail for:** [MBD-001](MISSION_BOARD_LIVE.md)

> What is the most important thing I should do next?

**Builds on:** [RIE-001](RECOMMENDATION_INTELLIGENCE_ENGINE.md) · [ANL-001](CAMPAIGN_ANALYTICS_INTELLIGENCE_PLATFORM.md) · [OIS-001](../phase-02/STATEWIDE_OUTREACH_INTELLIGENCE.md) · [Action OS](../phase-05/ACTION_CONSTITUTION.md)  
**Live spec:** `data/registry/live-mission-board.json` · **API:** `/api/missions`

---

## Purpose

**[MBD-M01]** The Mission Board is the **operational heart** of CampaignOS. CRM stores information. Calendar schedules time. Analytics measure performance. Recommendations suggest opportunities. **The Mission Board is where work actually happens.**

**[MBD-M01a]** Every user opens CampaignOS and immediately knows: *What is the most important thing I should do next?*

---

## Core Philosophy

**[MBD-M02]** Campaigns are managed through **missions**, not task lists. A mission has purpose, desired outcome, priority, owner, timeline, impact, dependencies, and success criteria. Tasks are steps inside a mission.

---

## Mission Architecture

**[MBD-M03]** Intelligence Layer (Recommendations · Analytics · Calendar · CRM · Relationships · Organizations · Events · Communications · County Workbench · Volunteer System) → Mission Generator → Priority & Scoring Engine → **Live Mission Board (OIS-M16)** → My / Team / County / Organization / Campaign / Statewide Missions

---

## Mission Hierarchy

**[MBD-M04]** Campaign → Strategic Objective → Program → Mission → Milestone → Task → Checklist → Activity Log. Nothing exists without context.

---

## Mission Types

**[MBD-M05]** Personal · Team · County · Organization · Campaign · Executive

---

## Mission Card (OIS-M16)

**[MBD-M06]** Standardized card: title · priority stars · impact · county · owner · estimated time · due date · progress · health

---

## Mission Lifecycle

**[MBD-M07]** Created → Assigned → Accepted → In Progress → Blocked → Review → Completed → Archived → Lessons Learned. History is permanent.

---

## Mission Sources

**[MBD-M08]** Recommendation Engine · Analytics alerts · Calendar deadlines · Manual creation · Executive assignment · Volunteer/county/organization requests · AI suggestions · System automation

---

## Intelligent Mission Creation

**[MBD-M09]** Analytics detects volunteer decline → RIE identifies opportunity → Mission created → County Chair notified → Mission Board updates automatically.

---

## Prioritization Engine

**[MBD-M10]** Priority = Campaign Impact + Urgency + Deadline + Dependencies + County Need + Leadership Priority + Resource Availability. Priority changes automatically.

---

## Mission Dashboard

**[MBD-M11]** Today's Missions · High Priority · Waiting · Completed Today · Upcoming Deadlines · Mission Health

---

## Integrations

**[MBD-M12]** Consumes RIE-001, ANL-001, Calendar, CRM, County Workbench, Volunteer System, Organization Registry, Communications. Produces data for Analytics, Executive Dashboard, Mobile App, Leadership Dashboard.

---

## APIs

**[MBD-M13]** `GET /api/missions` · `/today` · `/assigned` · `/recommended` · `/templates` · `POST /api/missions` · `PATCH /api/missions/{id}` · `POST /api/missions/{id}/assign` · `/complete` · `GET /api/missions/{id}/timeline` · `/analytics`

---

## Acceptance Criteria

**[MBD-M14]** Build 7.4 is complete when:

- Every operational work item is represented as a mission within a unified hierarchy
- Missions created manually or auto-generated from recommendations, analytics, deadlines, or system events
- Dynamic prioritization engine recalculates importance using configurable scoring
- Mission cards provide standardized views with progress, impact, health, dependencies, owners, timelines
- Missions integrate with calendars, CRM, organizations, counties, communications, analytics, geography
- Collaboration through discussions, files, updates, and decision logs with audit history
- Mobile workflows support field execution with one-touch actions
- Mission templates, analytics, notifications, and gamification reinforce consistent execution

**Acceptance:** `AC-175`
