# Statewide Search

**Document ID:** PHASE-007.1  
**Requirement:** SRCH-001  
**Status:** Canonical  
**Phase:** 7 — Intelligence Layer

> Search everything. One search box.

**Builds on:** [Search Architecture PSI-007](../volume-05/SEARCH_ARCHITECTURE.md) · [Knowledge Retrieval Fabric](../volume-05/SEARCH_ARCHITECTURE.md) · [KDG-001](../phase-03/KNOWLEDGE_DATA_GOVERNANCE.md)  
**Live spec:** `data/registry/statewide-search.json`

---

## Purpose

**[SRCH-M01]** Replace fragmented searches with **one universal statewide index** spanning people, organizations, events, tasks, communications, legislation, media, counties, volunteers, projects, campaigns, documents, and resources.

**[SRCH-M01a]** Instead of users hunting across modules, the platform provides a single entry point that understands names, partial matches, nicknames, metadata, OCR, transcripts, and semantic meaning.

---

## Universal Search Scope

**[SRCH-M02]** Indexed entity types:

People · Organizations · Events · Tasks · Emails · Notes · Conversations · Legislation · Media · Counties · Volunteers · Voters · Projects · Campaigns · Documents · Resources · News

---

## Search Dimensions

**[SRCH-M03]** Query against: names · partial names · nicknames · email · phone · organization · tag · issue · keyword · location · date · metadata · OCR text · transcripts · audio · video · PDF contents

---

## Intelligent (Semantic) Search

**[SRCH-M04]** Beyond literal matches, the engine understands conceptual equivalence:

```text
food pantry → Arkansas Hunger Relief → Food Bank → Community Kitchen → nutrition program
```

**[SRCH-M04a]** Semantic retrieval governed by [KDG-001] provenance and confidence scoring. Results cite matching strategy (literal vs semantic).

---

## Filters

**[SRCH-M05]** People · Organizations · Region · County · Date · Issue · Campaign · Activity · Volunteer · Media · Documents · Relationships · Confidence · Tags · Status

---

## Search Ranking

**[SRCH-M06]** Rank using: recent activity · relationship strength · campaign priority · frequency · geographic proximity · user preferences · organization relevance

**[SRCH-M06a]** Ranking weights are **explainable** — each result may show why it ranked highly.

---

## Saved Searches

**[SRCH-M07]** Examples: "My volunteers" · "Hot counties" · "New supporters" · "Unanswered emails" · "Media contacts" · "Potential donors"

---

## Deliverable

**[SRCH-M08]** Universal statewide indexed search with semantic capability, filters, ranking explainability, and saved searches.

**Acceptance:** `AC-166`
