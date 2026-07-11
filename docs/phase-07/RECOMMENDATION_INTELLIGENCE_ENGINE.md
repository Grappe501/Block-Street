# Build 7.2 — Recommendation Intelligence Engine

**Document ID:** BUILD-007.2 · **RIE-001**  
**Artifact:** `RECOMMENDATION_INTELLIGENCE_ENGINE.md`  
**Status:** Canonical  
**Phase:** 7 — Intelligence Layer  
**Supersedes build detail for:** [REC-001](RECOMMENDATION_ENGINE.md)

> Never overwhelm the user with information. Surface the next best actions that are explainable, actionable, and measurable.

**Builds on:** [SIS-001](STATEWIDE_INTELLIGENCE_SEARCH.md) · [OBE-001](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) · [CGIS-001](../phase-06/COMMUNITY_GROWTH_INTELLIGENCE_SYSTEM.md) · [NISS-001](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md)  
**Live spec:** `data/registry/recommendation-intelligence-engine.json` · **API:** `/api/recommendations`

---

## Purpose

**[RIE-M01]** The Recommendation Intelligence Engine transforms CampaignOS from a passive information system into an **active strategic partner**. The platform continuously analyzes campaign state and surfaces highest-value actions.

**[RIE-M01a]** Recommendations are **advisory**. The platform recommends; people decide.

---

## Objectives

**[RIE-M02]** By the end of Build 7.2, the platform:

- Recommends highest-impact work per user
- Detects opportunities before they become problems
- Recommends people, organizations, events, and resources
- Prioritizes work based on campaign goals
- Explains every recommendation with evidence
- Learns from accepted and rejected recommendations
- Feeds the Mission Board (7.4) with intelligent priorities

---

## Recommendation Architecture

**[RIE-M03]** Consumes: Activity Engine · Relationship Engine · Analytics Engine · Live Campaign Data

**[RIE-M03a]** Produces recommendations for: People · Organizations · Counties · Events · Communications · Missions · Personalized Dashboard

---

## Recommendation Categories

**[RIE-M04]** Daily Priorities · Contact · County · Organization · Event · Communication · Leadership · Volunteer · Mission · Geographic Intelligence

---

## Explainable Intelligence

**[RIE-M05]** Every recommendation includes confidence, evidence bullets, and score breakdown. No unexplained scores.

---

## Recommendation Lifecycle

**[RIE-M06]** Data Changes → Signals → Opportunity → Generated → Confidence → Displayed → Accept/Defer/Dismiss → Learning Feedback

---

## Scoring Model

**[RIE-M07]**

```text
Recommendation Score =
  Campaign Priority (30%) + Impact (25%) + Urgency (15%) +
  Relationship Strength (10%) + Geographic Efficiency (10%) +
  Historical Success (5%) + User Preferences (5%)
```

Weights configurable by administrators.

---

## Feedback Loop

**[RIE-M08]** Users respond: Accept · Dismiss · Not Relevant · Already Done · Remind Later · Wrong Recommendation

---

## APIs

**[RIE-M09]** `GET /api/recommendations` · `/daily` · `/feedback` · `POST /api/recommendations/feedback` · category filters via query params

---

## Acceptance Criteria

**[RIE-M10]** Build 7.2 complete when:

- Personalized daily recommendations per role and context
- Recommendations across all major categories with explanations
- Feedback loop records outcomes
- Configurable scoring aligned with campaign goals
- APIs expose data for dashboards and Mission Board

**Acceptance:** `AC-173`
