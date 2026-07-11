# Analytics Engine

**Document ID:** PHASE-007.3  
**Requirement:** ANL-001  
**Status:** Canonical  
**Phase:** 7 — Intelligence Layer

> Campaign intelligence dashboard — enterprise analytics for statewide organizing.

**Builds on:** [Operational Intelligence OPIS-001](../phase-05/OPERATIONAL_INTELLIGENCE_SYSTEM.md) · [Community Impact Intelligence CIIS-001](../phase-05/COMMUNITY_IMPACT_INTELLIGENCE_SYSTEM.md) · [OIG PSI-012](../volume-05/OBSERVABILITY_ARCHITECTURE.md)  
**Live spec:** `data/registry/campaign-analytics-intelligence-platform.json` · **Build:** [CAMPAIGN_ANALYTICS_INTELLIGENCE_PLATFORM.md](CAMPAIGN_ANALYTICS_INTELLIGENCE_PLATFORM.md) · **API:** `/api/analytics`

---

## Purpose

**[ANL-M01]** Deliver **campaign intelligence** — executive dashboards, geographic analytics, trend analysis, funnel metrics, predictive forecasting, and scheduled reports.

---

## Executive Dashboard

**[ANL-M02]** Campaign health at a glance:

```text
Campaign Health        ██████████ 91%
Volunteer Growth       +18%
County Progress        63 / 75
Events                 142
New Contacts           2,814
Leadership Pipeline    476
```

---

## Geographic Analytics

**[ANL-M03]** Heat maps · turnout maps · volunteer maps · donor maps · issue maps · petition maps · organization density · travel maps

---

## Trend & Funnel Analysis

**[ANL-M04]** Growth · decline · volunteer retention · fundraising · events · engagement · media · public interest

**[ANL-M04a]** Leadership funnel: Viewed → Registered → Volunteer → Leader → Organizer → County Chair → Campaign Staff

---

## Predictive Analytics

**[ANL-M05]** Forecast: volunteer growth · fundraising · attendance · petition completion · county readiness · election readiness · coalition expansion

**[ANL-M05a]** Predictions display confidence intervals and contributing factors — never presented as certainty.

---

## Executive Reports

**[ANL-M06]** Weekly · monthly · quarterly — campaign · county · volunteer · leadership · financial · media

---

## Deliverable

**[ANL-M07]** Enterprise analytics platform with geographic intelligence, trends, funnels, forecasting, and executive reporting.

**Acceptance:** `AC-168`
