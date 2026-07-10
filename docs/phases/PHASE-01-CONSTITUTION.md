# Phase 1 — Project Constitution & Mission Doctrine

**Status:** In Progress  
**Goal:** Create the governing document that tells Burt exactly what this platform is, what it is not, and what every later build must protect.

**Deliverable:** `docs/PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md`

---

## Steps

| Step | Name | Status | Output |
|------|------|--------|--------|
| 1.1 | Platform Identity | ✅ Done | Name, mission, audience, scope |
| 1.2 | North Star Outcome | ✅ Done | End-state definition |
| 1.3 | Core Principles | ✅ Done | Locked principles list |
| 1.4 | Platform Boundaries | ✅ Done | Must-not-do list |
| 1.5 | Organizing Model | ✅ Done | Campus + county + personal network |
| 1.6 | Growth Model | ✅ Done | Staged institution expansion |
| 1.7 | Success Definition | ✅ Done | Launch-ready criteria + dates |
| 1.8 | Cursor/Burt Build Doctrine | ✅ Done | Implementation rules |
| 1.9 | Phase 1 Closeout Artifact | ✅ Done | Constitution document compiled |

---

## Step 1.1 — Platform Identity

### Platform Name

**Gather Arkansas**

- Neutral — no partisan signal
- Action-oriented — students gather, organize, build power
- Statewide — Arkansas-first, expandable later
- Deploy URL (current): https://block-street.netlify.app/
- Codebase repo: `Grappe501/Block-Street` (rename optional later)

### One-Sentence Mission

> **Gather Arkansas gives every young Arkansan ages 16–24 an organizing home — through their school, their county, or their personal network — to build collective voice and voting power.**

### Core Audience

| Segment | Ages | Entry Path |
|---------|------|------------|
| College & university students | 16–24 | County → School |
| Working youth not in school | 16–24 | County only |
| Trade school / jr college (later) | 16–24 | County → School |
| High school (future) | 16–18 | County → School (self-register) |

**Primary target:** Working-class youth 16–24, in school or not.

### Nonpartisan Purpose

The platform provides **tools and teaching** — not political direction. Students determine who and what they support. The platform helps them organize that decision collectively into a **voting block**.

### Scope

Statewide Arkansas — 75 counties, all educational institutions (staged).

---

## Step 1.2 — North Star Outcome

> **Every young Arkansan can find an organizing home through their school, their county, or their personal network — and together build a collective voice strong enough to matter in every election.**

By **November 3, 2026**, students across Arkansas should be able to:
- Find their campus or county hub
- Recruit through personal share links and QR codes
- See statewide representation gaps and fill them
- Organize toward voter registration when school starts
- Speak with collective voice — **they** decide the direction

---

## Step 1.3 — Core Principles

1. **Youth-led** — Students run moderation, rules, and committees. Platform guides; they decide.
2. **Nonpartisan infrastructure** — No endorsed candidates, no party direction.
3. **Equal standing** — Every campus, county, and person starts with identical capabilities. No privileged schools.
4. **Relational organizing first** — Every person gets a network, share link, QR code.
5. **No school impersonation** — Independent organizing spaces; clear disclaimers.
6. **Privacy-first** — Honor-system affiliation; minimal data collection.
7. **Mobile-first** — Most students will use phones.
8. **Teaching built in** — Golden Circle: WHY → HOW → WHAT. They don't know what to do yet — we teach.
9. **Expandable by design** — Registry grows as institutions onboard.
10. **Distributed leadership** — Leaders emerge through participation, not appointment.

---

## Step 1.4 — Platform Boundaries

| Must NOT | Reason |
|----------|--------|
| Endorse candidates or parties | Students decide |
| Claim official school affiliation | Legal protection |
| Use unauthorized logos/trademarks | IP protection — color inspiration only |
| Create hidden hierarchy or founding privileges | Equal standing principle |
| Force political positions | Nonpartisan infrastructure |
| Collect unsafe youth data | Privacy protection |
| Rank organizers solely by recruit count | Quality over quantity |

---

## Step 1.5 — Organizing Model

### Three Organizing Homes

```
Gather Arkansas
├── Campus Hubs — students connected to a school
├── County Hubs — youth not in school + geographic anchor for all
└── Personal Network Boards — every user's recruitment tree
```

### Signup Flow (Honor System)

**Students:**
1. Pick your county (where your school is)
2. Pick your college/university
3. Create profile + interests
4. Get share link + QR code

**Non-students (16–24):**
1. Pick your county
2. Create profile + interests
3. Get share link + QR code

---

## Step 1.6 — Growth Model

| Stage | Institutions | When |
|-------|-------------|------|
| V1 | 4-year colleges & universities (~25) | July 2026 launch |
| V1.5 | Community colleges | As organizers onboard |
| V2 | Trade schools, technical institutes | Fall 2026 |
| V3 | High schools (self-registration) | 2027 |
| Ongoing | Any Arkansas educational institution | As requested |

---

## Step 1.7 — Success Definition

### Launch-Ready (July 14, 2026)

- [x] Constitution document complete
- [ ] 75 county pages exist
- [ ] College/university registry live
- [ ] Personalized campus pages
- [ ] County-first signup flow
- [ ] Share link + QR per user
- [ ] Basic network board
- [ ] Outreach gap dashboard visible
- [ ] WHY call-to-action on homepage
- [ ] Moderation framework documented
- [ ] Leader testing complete (July 12)

### School-Start Ready (Fall 2026)

- Voter registration push tools
- Campus recruitment dashboards
- Active networks at 10+ schools

### Election Ready (November 3, 2026)

- Collective voice tools (surveys)
- Statewide participation visible
- Student-determined positions documented

---

## Step 1.8 — Cursor/Burt Build Doctrine

1. **GitHub-first** — commit + push every step
2. **Netlify deploy** — live at block-street.netlify.app
3. **SQL via Netlify DB** — Postgres, relational
4. **H: drive only** — no C: writes
5. **No overbuilding V1** — ship July 14, iterate after
6. **Version upward** — every feature supports future layers
7. **Mobile-first** — design for phone screens first
8. **Registry-first** — Arkansas Organizing Registry before features
9. **One step at a time** — user uploads step to Cursor
10. **Director workbench** — `/admin` updated every step

---

## Step 1.9 — Closeout

Phase 1 complete when `PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md` exists and Burt has read it before any code changes.

**Next Phase:** Phase 2 — Arkansas Organizing Registry (institutions + map data)
