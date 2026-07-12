# County & Institution Workspace Upgrade

**Document ID:** PHASE-004.3.1  
**Artifact:** `COUNTY_INSTITUTION_WORKSPACE_UPGRADE.md`  
**Requirement:** CIWS-001  
**Release:** `0.7.1-ciws` (County & Institution Workspace System — Phase 0)  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System

> **Every county and every campus deserves a living workspace — not a brochure page.**

**Builds On:** [Community Command Center](COMMUNITY_COMMAND_CENTER.md) · [County Registry Model](../phase-02/COUNTY_REGISTRY_MODEL.md) · [Workspace Architecture](../volume-04/WORKSPACE_ARCHITECTURE.md) · [Team & Working Group System](TEAM_WORKING_GROUP_SYSTEM.md)

**Live spec:** `data/registry/county-institution-workspace.json`  
**Seeded data:** `data/communities/workspace-seeds.json`  
**Engine:** `src/lib/community-workspace/`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CIWS-M01 | Purpose |
| CIWS-M02 | Guiding principle |
| CIWS-M03 | Two-layer page model |
| CIWS-M04 | Home-community membership gate |
| CIWS-M05 | Functional leadership lattice |
| CIWS-M06 | Registration & vote goals |
| CIWS-M07 | Social meetup hub |
| CIWS-M08 | Functional lanes |
| CIWS-M09 | People directory (member-only) |
| CIWS-M10 | Community Pulse |
| CIWS-M11 | Unified renderer |
| CIWS-M12 | Community ID scheme |
| CIWS-M13 | Phase 0 scope |
| CIWS-M14 | Phase 1+ roadmap |
| CIWS-BG | Implementation guidance |

---

## CIWS-M01 — Purpose

**[CIWS-M01]** This document defines the **County & Institution Workspace System (CIWS)** — the upgrade path from static county and education-institution pages to operational community workspaces.

**[CIWS-M01a]** CIWS applies to:

- All 75 Arkansas county hubs (`county:[slug]`)
- Post-secondary institutions (`school:[slug]`)
- Public high schools (`high_school:[slug]`)
- Private and charter schools (`private_charter:[slug]`)

**[CIWS-M01b]** CIWS implements Phase 0 of the Community Command Center [CCC-001] on public routes — with seeded operational data until live membership APIs connect in Phase 1.

---

## CIWS-M02 — Guiding Principle

**[CIWS-M02]**

> **You build your network in the community where you belong.**

**[CIWS-M02a]** Social meetups are the **organizing spine** — the Social Lead role is first among equals operationally. Registration, canvass, phone bank, and postcard work activate **through** in-person gatherings.

**[CIWS-M02b]** Leadership is **service, not authority** [CLD-001]. Vacant roles are recruitment opportunities, not failures.

---

## CIWS-M03 — Two-Layer Page Model

**[CIWS-M03]** Every county and institution page has two layers:

| Layer | Audience | Contents |
|-------|----------|----------|
| **Public front door** | Anyone | Pulse teaser, goal progress, leadership roster (names or open roles), next social meetup, signup |
| **Member workspace** | Verified home-community members | People search, connect/intro, shift signup, full meetup details |

**[CIWS-M03a]** Phase 0 ships the public layer with member gates. Phase 1 unlocks the member layer behind identity + home-community verification.

---

## CIWS-M04 — Home-Community Membership Gate

**[CIWS-M04]** Participants have one **home community** where they build their network.

**[CIWS-M04a]** People search and connect are scoped to `participant.home_community_id` only.

**[CIWS-M04b]** Participants may **browse** other communities read-only. They may not search or connect across communities without an explicit cross-community invitation (future).

**[CIWS-M04c]** Home community is set at join from signup path (`/join?county=&school=`) and confirmed during onboarding.

---

## CIWS-M05 — Functional Leadership Lattice

**[CIWS-M05]** Every county and institution workspace displays seven functional roles:

| Role ID | County label | Institution label |
|---------|--------------|-------------------|
| `community_lead` | County Lead | College Lead |
| `social_lead` | Social Lead | Social Lead |
| `event_lead` | Event Lead | Event Lead |
| `registration_lead` | Registration Lead | Registration Lead |
| `canvass_lead` | Canvass Lead | Canvass Lead |
| `phone_bank_lead` | Phone Bank Lead | Phone Bank Lead |
| `postcard_lead` | Postcard Lead | Postcard Lead |

**[CIWS-M05a]** Role status: `open` · `interim` · `active`.

**[CIWS-M05b]** Vacant roles show **Volunteer for this role** — routing to join flow with role context.

---

## CIWS-M06 — Registration & Vote Goals

**[CIWS-M06]** Every workspace tracks two community-scoped goals:

| Goal kind | Purpose | Public display |
|-----------|---------|----------------|
| `registration` | New voter registrations attributed to community | Progress bar + deadline |
| `vote_participation` | Ballot plan / civic participation milestones | Progress bar (nonpartisan framing) |

**[CIWS-M06a]** Goals roll up: institution → county → statewide [ANL-001, kpi-registration-goal].

**[CIWS-M06b]** No partisan candidate endorsement on goal widgets [NONPARTISAN-RULES].

---

## CIWS-M07 — Social Meetup Hub

**[CIWS-M07]** Every workspace includes a **Social Meetup Hub** owned by the Social Lead.

**[CIWS-M07a]** Public view: next meetup date, theme, public location label, RSVP count.

**[CIWS-M07b]** Empty state: *Social Lead needed to schedule our first meetup* — not a dead zone.

**[CIWS-M07c]** Meetups are recurring series when configured (`rhythm` field).

---

## CIWS-M08 — Functional Lanes

**[CIWS-M08]** Six operational lanes surface volunteer entry points:

Social · Events · Registration · Canvass · Phone Bank · Postcards

**[CIWS-M08a]** Each lane links to its functional lead (or open-role CTA) and next scheduled activation.

---

## CIWS-M09 — People Directory (Member-Only)

**[CIWS-M09]** Phase 0: gated card with sign-in CTA and explanation of home-community rule.

**[CIWS-M09a]** Phase 1: search by name, interest, role; filters for new members and availability.

**[CIWS-M09b]** Phase 2: intro requests and suggested connections from shared meetups.

---

## CIWS-M10 — Community Pulse

**[CIWS-M10]** Workspace opens with 2–5 rule-based Pulse items [CCC-M20]:

- Open leadership roles count
- Registration goal progress milestone
- Next social meetup timing
- Representation status change
- New member welcome (when live data exists)

**[CIWS-M10a]** Orchestrator: `assembleCommunityWorkspace(communityId)` → includes `pulseItems[]`.

---

## CIWS-M11 — Unified Renderer

**[CIWS-M11]** One React layout serves all community kinds:

`CommunityWorkspace` → Header · Pulse · Goals · Leadership · Meetups · Lanes · People Gate · Signup

**[CIWS-M11a]** County pages append school directories below the workspace shell.

**[CIWS-M11b]** Institution pages retain school-color header gradient; workspace fills the operational body.

---

## CIWS-M12 — Community ID Scheme

**[CIWS-M12]**

| Kind | ID format | Example |
|------|-----------|---------|
| County | `county:{slug}` | `county:pulaski` |
| Post-secondary | `school:{slug}` | `school:uca` |
| High school | `high_school:{slug}` | `high_school:central-high` |
| Private/charter | `private_charter:{slug}` | `private_charter:episcopal-collegiate` |

---

## CIWS-M13 — Phase 0 Scope (0.7.1-ciws)

| Deliverable | Status |
|-------------|--------|
| Spec + registry JSON | ✓ |
| Workspace engine + seeded data | ✓ |
| Unified UI components | ✓ |
| County + all school page integration | ✓ |
| API `GET /api/v1/community-workspace` | ✓ |
| Live membership / people search | Deferred Phase 1 |
| Live goal tracking from civic APIs | Deferred Phase 2 |

---

## CIWS-M14 — Roadmap

### Phase 1 — Member workspace (4–6 weeks)

- Home community on participant profile
- Role nomination and confirmation
- People directory API scoped by `community_id`
- Connect / intro request flow

### Phase 2 — Social-first operations (Fall 2026)

- Live registration goal tracking
- Recurring social meetup series
- Shift boards (canvass, phone, postcard)
- Mission boards per functional lane

### Phase 3 — Intelligence

- Community health widget
- Leadership succession signals
- Cross-county collaboration discovery (read-only)

---

## CIWS-BG — Implementation Guidance

**[CIWS-BG]** Burt should:

1. Use `assembleCommunityWorkspace()` for all county and institution pages — never duplicate layout logic.
2. Merge `workspace-seeds.json` overrides with computed defaults from registry enrollment/demographics.
3. Keep public/member boundary explicit in UI copy and API authorization (Phase 1+).
4. Treat Social Lead vacancy as the primary health signal for early communities.
5. Register CIWS-001 in requirements traceability when promoting to Phase 1.
