# Master Build Sequence

> **Arkansas youth organizing infrastructure** — not a website, a statewide platform.

## Living Systems Architecture (Current)

The master plan is organized around **living systems**, not software modules.

→ **[LIVING-SYSTEMS-ARCHITECTURE.md](LIVING-SYSTEMS-ARCHITECTURE.md)** — canonical phase map (Phases 1–9)  
→ **[Participant Journey](../phase-03/PARTICIPANT_JOURNEY.md)** — every feature helps someone move one step forward

| Phase | Name | Question | Status |
|-------|------|----------|--------|
| 1 | Constitution | Why? | ✅ |
| 2 | Digital Arkansas | What exists? | ✅ |
| 3 | People | Who participates? | 🚀 Active |
| 4–9 | Communities → Growth | See Living Systems doc | Pending |

*This document preserves the original **30-module index** below for traceability.*

---

# Master Build Sequence (Module Index)

> Long-range blueprint. Launch phases (V1) are a subset marked with 🚀.

---

## How to Read This Document

| Level | Purpose |
|-------|---------|
| **Master Build Sequence** (this doc) | Everything that should exist over the next several years |
| **Launch Phases** (docs/phases/) | Minimum needed for each release — V1 targets July 14, 2026 |
| **Build Steps** | Individual implementable units — one step at a time for Burt |

**Election anchor:** November 3, 2026  
**Launch call:** Tuesday, July 14, 2026 (~50 students)  
**Leader testing:** Saturday, July 12, 2026  
**Voter registration push:** When school starts (Fall 2026)

---

## Foundation Layer
*Defines what we're building.*

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 001 | Vision & Mission | Why the platform exists, core principles, nonpartisan doctrine | 🚀 |
| 002 | Governance | Community standards, moderation framework, student-determined rules | 🚀 |
| 003 | Information Architecture | Navigation, public vs auth, campus/county/user hierarchy | 🚀 |
| 004 | Design System | Brand, typography, colors, mobile, accessibility | 🚀 |
| 005 | Data Architecture | SQL schema, registry, users, networks, future tables | 🚀 |

---

## Geographic Layer
*Arkansas map + every organizing home.*

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 006 | Arkansas Master Map | Interactive state, 75 counties, education overlay, outreach gaps | 🚀 |
| 007 | County Framework | 75 county pages, youth hubs, statistics, gap visibility | 🚀 |
| 008 | Institution Framework | College/university registry, personalized pages, self-registration (later) | 🚀 |

---

## Identity Layer
*Every person is an organizer.*

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 009 | User Identity | Profiles, interests, age bracket, honor-system affiliation | 🚀 |
| 010 | Relational Organizing | Share links, QR codes, referral tree | 🚀 |
| 011 | Network Boards | Personal dashboard — my network, growth, invites | 🚀 |

---

## Organizing Layer
*Campus and county action.*

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 012 | Campus Networks | Campus homepage, members, recruitment | 🚀 |
| 013 | County Networks | County homepage, youth organizers, non-student path | 🚀 |
| 014 | Committees | Create, join, local + cross-campus | v1.1 |
| 015 | Events | Calendar, RSVP, attendance | v1.2 |
| 016 | Outreach | Canvassing, tabling, relationship mapping | v1.3 |

---

## Communications Layer

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 017 | Messaging | Announcements, campus/county/committee messages | v1.3 |
| 018 | Knowledge Center | **Teaching system** — WHY/HOW/WHAT, Roberts Rules, organizing guides | 🚀 |
| 019 | Resource Library | Flyers, templates, downloads | v1.4 |

---

## Civic Engagement Layer

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 020 | Issues | Student-created issues, discussion | v1.4 |
| 021 | Surveys | Campus/county/statewide polls — collective voice | v1.4 |
| 022 | Volunteer System | Hours, skills, recognition | v1.5 |
| 022b | Voter Registration | Registration tracking, school-start push | 🚀 (Fall 2026) |

---

## Intelligence Layer

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 023 | Analytics | Growth, participation, network health, heat maps | 🚀 |
| 024 | Dashboards | Personal, campus, county, state, director workbench | 🚀 |

---

## Administrative Layer

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 025 | Admin Console | Users, institutions, counties, moderation tools | 🚀 |
| 026 | Content Management | Articles, announcements, training content | v1.2 |

---

## Platform Layer

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 027 | Authentication | Email signup (honor system), future SSO | 🚀 |
| 028 | API Layer | REST, import/export | 🚀 |
| 029 | Deployment | GitHub, Netlify, Netlify DB, CI/CD | 🚀 |

---

## Growth Layer

| ID | Module | Description | V1 |
|----|--------|-------------|-----|
| 030 | Expansion | Trade schools, jr colleges, high schools as onboarded | Staged |

---

## V1 Launch Definition

When V1 launches (July 14, 2026), a student should say:

> "Every county already exists. Every major college already has a home. I can find my campus, invite friends, and start building my network — and I understand **why** we're doing this."

### V1 Must-Haves

- [ ] Platform name + mission (Gather Arkansas)
- [ ] 75 county pages live
- [ ] College/university registry with personalized pages
- [ ] County-first signup (honor system): county → school OR county-only
- [ ] Non-student path for ages 16–24 working youth
- [ ] Share link + QR for every user
- [ ] Basic network board
- [ ] Outreach gap dashboard (who's represented, who needs organizers)
- [ ] WHY call-to-action (Golden Circle teaching — emotional + psychological)
- [ ] Moderation framework (students determine rules; platform guides)
- [ ] Director workbench with build progress
- [ ] Live on Netlify: https://block-street.netlify.app/

### V1 Explicitly Does NOT Include

- Permanent leadership council or privileged campuses
- Official school logos or trademarked branding
- Partisan direction or endorsed candidates
- Committees, events, messaging (v1.1+)
- Full Roberts Rules tooling (framework + guides first)

---

## Canonical Dataset: Arkansas Organizing Registry

The **registry** is the constitution of the platform data layer:

```
data/registry/
├── counties.json      — 75 counties
├── institutions.json — colleges/universities (v1), + trade/jr/high later
└── README.md          — schema + representation status rules
```

Every page, map, dashboard, and search feature builds on this registry.

### Representation Status

| Status | Meaning |
|--------|---------|
| `needs_organizer` | No active student network yet — outreach target |
| `building` | Organizers joining, not yet active |
| `active` | Student network recruiting and growing |

---

## Implementation Protocol (For Burt)

1. Read `PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md` first
2. One build step at a time — user uploads step to Cursor
3. Every step: update `build-progress.json` + `BUILD-LOG.md`
4. Every step: commit + push → Netlify auto-deploys
5. Director workbench (`/admin`) reflects live progress
6. All files on **H: drive only**
7. No overbuilding — each step must version upward cleanly
8. Feedback from Burt → Version 2 planning

---

## Version Timeline

| Version | Target | Focus |
|---------|--------|-------|
| 0.2.0 | Jul 10–11 | Constitution + master plan + registry |
| 0.3.0 | Jul 12 | Leader testing build |
| 1.0.0 | Jul 14 | Launch call — signup + network + map |
| 1.1.0 | Aug 2026 | Committees + moderation tools |
| 1.2.0 | Aug–Sep | Events + voter registration push |
| 1.3.0 | Sep–Oct | Messaging + outreach |
| 1.4.0 | Oct 2026 | Surveys + collective voice tools |
| 2.0.0 | Post-election | Full teaching system + expansion |

---

## Next Document

→ [PHASE-01-CONSTITUTION.md](phases/PHASE-01-CONSTITUTION.md) — Phase 1 step-by-step design  
→ [PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md](PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md) — Phase 1 deliverable
