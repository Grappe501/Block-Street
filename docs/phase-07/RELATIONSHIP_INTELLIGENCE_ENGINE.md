# Build 7.5 — Relationship Intelligence Engine

**Document ID:** BUILD-007.5 · **RLI-001**  
**Artifact:** `RELATIONSHIP_INTELLIGENCE_ENGINE.md`  
**Status:** Canonical  
**Phase:** 7 — Intelligence Layer  
**Supersedes build detail for:** [RLI-001](RELATIONSHIP_INTELLIGENCE.md)

> Who should we strengthen, who connects communities, who is drifting away, and where are the relationships that will move this campaign forward?

**Builds on:** [LMB-001](LIVE_MISSION_BOARD.md) · [ANL-001](CAMPAIGN_ANALYTICS_INTELLIGENCE_PLATFORM.md) · [PRN-001](../phase-03/PERSONAL_RELATIONSHIP_NETWORK.md) · [NISS-M17](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md)  
**Live spec:** `data/registry/relationship-intelligence-engine.json` · **API:** `/api/relationships`

---

## Purpose

**[RLI-M01]** Campaigns are won through relationships. The Relationship Intelligence Engine turns CampaignOS into a **living map** of human relationships, organizational influence, trust, collaboration, and community networks.

**[RLI-M01a]** This is the **social nervous system** of the platform.

---

## Guiding Principles

**[RLI-M02]** Relationships are earned, dynamic, multi-dimensional, explainable, human-centered, and permission-aware. The platform never assigns moral value — it measures observable activity.

---

## Relationship Graph

**[RLI-M03]** Every person and organization is a node. Every interaction is an edge. Relationships are living connections, not address book entries.

---

## Relationship Profile

**[RLI-M04]** Each relationship stores: people, organizations, type, strength, trust, influence, interactions, shared missions/events/orgs, communication frequency, geography, tags, notes, history, permissions.

---

## Strength, Trust, Influence

**[RLI-M05]** Strength from meetings, events, missions, volunteer work, communication, introductions. Trust from follow-through, attendance, reliability. Influence from recruitment, introductions, cross-community participation.

---

## Health & Alerts

**[RLI-M06]** Health states: Healthy · Growing · Stable · Needs Attention · Dormant · Inactive. Alerts feed RIE-001 and Mission Board.

---

## Network Analysis

**[RLI-M07]** Connectors · bridge builders · isolated volunteers · bottlenecks · coalition overlap · introduction intelligence.

---

## APIs

**[RLI-M08]** `GET /api/relationships` · `/graph` · `/network` · `/connectors` · `/health` · `/recommendations` · `POST /introduction`

---

## Acceptance Criteria

**[RLI-M09]** Build 7.5 is complete when permission-aware graph, historical timelines, transparent scoring, connector detection, alerts feeding RIE/Mission Board, geographic/network analysis, organizational memory, and full API surface are operational.

**Acceptance:** `AC-176`
