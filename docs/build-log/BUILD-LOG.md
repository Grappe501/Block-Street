# Build Log

> Chronological record of every build step. Newest entries at top.

---

## 2026-07-10 — PHASE-001.7 Launch Success Definition

**Document ID:** PHASE-001.7  
**Requirement IDs:** LS-P1–P7, LS-CHK, AC-007  
**Launch checklist:** 2/10 done · NOT launch ready · Jul 12 minimum: items 3–6

---

**PHASE-001.6 Growth Model** closes Phase 1.

Six canonical documents define why ASYON exists, what it stands for, how it organizes people, what boundaries it respects, and how it evolves.

**Phase 2 begins:** Arkansas Organizing Registry.

---

**Document ID:** PHASE-001.5  
**Requirement IDs:** OM-001 through OM-010, OM-L1–L5, AC-005  
**Status:** Complete — Canonical — Database Foundation

### Key Insight

Most platforms organize around **organizations**. ASYON organizes around **people**. Communities are built from individuals.

### Constitutional Layer Complete

Steps 1.1–1.5 complete the constitutional layer. Next: PHASE-001.6 Growth Model (V1 roadmap).

---

**Document ID:** PHASE-001.4  
**Requirement IDs:** DG-001 through DG-015, BG-001, ED-001, AC-004  
**Status:** Complete — Canonical — Mandatory Guardrails

### Standing Engineering Doctrine [ED-001]

> Design First · Build Second · Validate Third · Iterate Fourth

### Deliverables

- `docs/build-steps/PHASE-001.4-PLATFORM-BOUNDARIES.md` — 15 boundaries + conflict protocol
- DG, BG, ED categories in ID convention
- Admin dashboard: new **Guardrails** tab at `/admin`
- Conflict resolution: redesign or constitutional change — never silent drift

### Next Step

PHASE-001.5 — Organizing Model

---

**Document ID:** PHASE-001.3  
**Requirement IDs:** CP-001 through CP-015, CT-001, AC-003  
**Status:** Complete — Canonical — Immutable Doctrine

### Deliverables

- `docs/build-steps/PHASE-001.3-CORE-PRINCIPLES.md` — 15 principles + constitutional test
- CP and CT categories added to ID convention
- Admin dashboard: new **Constitution** tab at `/admin`
- Change protocol documented — principles require user approval to modify

### Next Step

PHASE-001.4 — Platform Boundaries (Design Guardrails)

---

**Document ID:** PHASE-001.2  
**Requirement IDs:** NS-001 through NS-014, AC-002  
**Status:** Complete — Canonical

### The One Question

> Does this help us reach the North Star? If no — it doesn't belong in V1.

### Deliverables

- `docs/build-steps/PHASE-001.2-NORTH-STAR-OUTCOME.md`
- Five North Star Questions [NS-013] as feature filter
- Admin dashboard: new **North Star** tab at `/admin`
- NS category added to ID convention

### Next Step

PHASE-001.3 — Core Principles (immutable doctrine, 10–15 principles)

---

**Document ID:** PHASE-001.1  
**Requirement IDs:** PI-001 through ER-001, AC-001  
**Status:** Complete — Canonical

### Deliverables

- `docs/build-steps/PHASE-001.1-PLATFORM-IDENTITY.md` — first document Burt reads
- `docs/build-steps/00-ID-CONVENTION.md` — requirement ID naming system
- `docs/build-steps/README.md` — Burt start-here index
- Platform working name: **ASYON** (final branding TBD)
- Motto: *Connect Locally. Organize Statewide. Lead Together.*
- Site updated to configurable `PLATFORM` object in `src/lib/data.ts`

### Next Step

PHASE-001.2 — North Star Outcome

---

**Commit:** Gather Arkansas rebrand + constitution  
**Phase:** 1 — Project Constitution & Mission Doctrine  
**Deploy:** https://block-street.netlify.app/

### What Was Built

- **Platform name:** Gather Arkansas (neutral, nonpartisan)
- **Constitution:** `docs/PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md` — Burt reads this first
- **Master build sequence:** `docs/master/MASTER-BUILD-SEQUENCE.md` (30 modules)
- **Phase 1 design:** `docs/phases/PHASE-01-CONSTITUTION.md` (9 steps, all complete)
- **Leadership council removed** — all schools equal standing
- **Arkansas Organizing Registry:** 75 counties + 23 colleges/universities
- **New pages:** `/map`, `/schools`, `/schools/[slug]` with personalized color-inspired design
- **County-first signup:** honor system, county → school OR county-only for non-students 16-24
- **WHY call-to-action:** Golden Circle teaching on homepage
- **Netlify live:** block-street.netlify.app

### Key Decisions Locked

- Honor system affiliation (county → school)
- No privileged campuses or founding council
- Collective voice + voting block power (student-determined)
- Election: November 3, 2026 | Launch call: July 14 | Leader test: July 12

### Next Steps

1. Phase 2: Complete registry (SVG map, remaining schools)
2. Phase 3: Signup + share link + QR + network board (Jul 12-14)
3. Connect Netlify DB

---

**Commit:** Initial project scaffold  
**Phase:** 1 — Mission + Structure  
**Deploy:** Pending first GitHub push → Netlify

### What Was Built

- Complete documentation system (`docs/`)
  - Mission, principles, north star, audience paths
  - Architecture: overview, data model, organizing philosophy, network tree, nonpartisan rules
  - 6 build phases documented with step checklists
  - Version roadmap (v1.1–v1.8)
  - Founding council + 75 counties reference
- Data files (`data/`)
  - `build-progress.json` — powers admin dashboard
  - `campuses.json` — founding council seed data
  - `counties.json` — all 75 Arkansas counties
- Next.js 15 application scaffold
  - Public home page (mission v0)
  - Join page stub (campus vs county paths)
  - Campus hub pages (dynamic)
  - County hub pages (dynamic)
  - Admin Director Workbench with tabs
- H: drive only configuration (`.npmrc`)
- Netlify deployment config (`netlify.toml`)
- GitHub repository initialized

### Next Steps

1. Push to GitHub
2. User connects Netlify
3. Begin Phase 2 — Netlify DB connection
4. Complete Phase 3 public pages (council, FAQ, contact)

---

## Template for Future Entries

```
## YYYY-MM-DD — [Title]

**Commit:** [hash/message]
**Phase:** [N] — [Name]
**Deploy:** [Netlify URL or status]

### What Was Built
- ...

### Next Steps
- ...
```
