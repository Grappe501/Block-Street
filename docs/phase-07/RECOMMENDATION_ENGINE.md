# Recommendation Engine

**Document ID:** PHASE-007.2  
**Requirement:** REC-001 · **Build spec:** [RIE-001](RECOMMENDATION_INTELLIGENCE_ENGINE.md)  
**Status:** Canonical  
**Phase:** 7 — Intelligence Layer

> The platform's strategic advisor — continuously suggests, never decides.

**Builds on:** [Opportunity Belonging Engine OBE-001](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) · [Community Growth Intelligence CGIS-001](../phase-06/COMMUNITY_GROWTH_INTELLIGENCE_SYSTEM.md) · [NISS-001](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) · [SIS-001](STATEWIDE_INTELLIGENCE_SEARCH.md)  
**Live spec:** `data/registry/recommendation-intelligence-engine.json` · **API:** `/api/recommendations`

---

## Purpose

**[REC-M01]** The recommendation engine proactively surfaces opportunities instead of waiting for users to search. It becomes the platform's **strategic advisor** — always explainable, always overridable.

---

## Daily Recommendations

**[REC-M02]** Morning dashboard pattern:

```text
Good Morning Steve
Today's priorities
✓ Call Benton NAACP
✓ 3 volunteers inactive
✓ Jonesboro event needs promotion
✓ Petition drive behind target
✓ 4 donors awaiting follow-up
```

---

## Recommendation Categories

**[REC-M03]**

| Category | Examples |
|----------|----------|
| **Contact** | People to call, inactive volunteers, likely leaders, donors, media |
| **County** | Focus counties, improving/declining, opportunity, shortages |
| **Organization** | Likely partners, shared members, conflicts, cross-promotion |
| **Event** | Promotion needs, location changes, merge candidates, weather |

---

## Recommendation Confidence

**[REC-M04]** Every recommendation displays confidence and reasoning:

```text
Recommended — 92%
Because:
• Worked with you 14 times
• Lives nearby
• Similar volunteer history
• Responds within 24 hours
```

**[REC-M04a]** Never magic. Every `reason` field required [OBE-M06a · OIS-M16a].

---

## Intelligence Principles

**[REC-M05]** Explainable · Transparent · Auditable · Confidence scored · Human overridable

---

## Deliverable

**[REC-M06]** Platform proactively surfaces contact, county, organization, and event opportunities with confidence and evidence.

**Acceptance:** `AC-167`
