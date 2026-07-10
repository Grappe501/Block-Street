# Community Identity & Personalization System

**Document ID:** PHASE-002.7  
**Artifact:** `COMMUNITY_IDENTITY_PERSONALIZATION_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry

> **How do we make a student from UCA feel like this is *their* platform, while making a student from Arkansas Tech feel exactly the same?**

The answer isn't branding. It's **identity**.

We are not trying to imitate universities. We are trying to **celebrate their communities**.

**Builds On:** [PHASE-002.3 Institution Model](INSTITUTION_REGISTRY_MODEL.md) · [PHASE-002.2 County Model](COUNTY_REGISTRY_MODEL.md) · [PHASE-002.6 Outreach Intelligence](STATEWIDE_OUTREACH_INTELLIGENCE.md) · [DG-002](../build-steps/PHASE-001.4-PLATFORM-BOUNDARIES.md)

**Live spec:** `data/registry/community-identity.json` · `data/registry/schemas/community-dna.schema.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CID-M01 | Purpose |
| CID-M02 | Guiding principle |
| CID-M03 | Identity philosophy |
| CID-M04 | Community layers |
| CID-M05 | County personalization |
| CID-M06 | Campus personalization |
| CID-M07 | Personalization boundaries |
| CID-M08 | Visual identity system |
| CID-M09 | Community welcome experience |
| CID-M10 | Living communities |
| CID-M11 | Shared platform elements |
| CID-M12 | Discovery through identity |
| CID-M13 | Community DNA architecture |
| CID-M14 | DNA category schema |
| CID-M15 | Entity type inheritance |
| CID-M16 | Rendering system |
| CID-M17 | Committee & personal identity |
| CID-M18 | V1 scope |
| CID-BG | Burt implementation guidance |
| AC-016 | Step 2.7 acceptance criteria |

---

## CID-M01 — Purpose

**[CID-M01]** This document establishes how every organizing community develops its own unique identity while remaining part of one statewide platform.

**[CID-M01a]** The objective: participants immediately feel:

> **"This is my community."**

**[CID-M01b]** Without violating intellectual property rights or creating confusion about official affiliation [DG-002, INST-M09].

**[CID-M01c]** Scope extends beyond campus pages to a complete **Community Identity System** — counties, schools, committees, and eventually personal profiles share the same philosophy.

---

## CID-M02 — Guiding Principle

**[CID-M02]**

> **One Platform. Hundreds of Communities. One Unique Experience for Each.**

**[CID-M02a]** Every county. Every campus. Every committee. Every participant. Should feel **recognized**.

**[CID-M02b]** Same platform shell — distinctive community experience inside.

---

## CID-M03 — Identity Philosophy

**[CID-M03]** We are not building websites. We are building **digital communities**.

**[CID-M03a]** Communities develop identity through:

| Element | Examples |
|---------|----------|
| History | Founding stories, milestones |
| People | Organizers, mentors, participants |
| Place | County seat, campus setting, landmarks |
| Culture | Traditions, character, student life |
| Stories | Leadership narratives, community wins |
| Traditions | Publicly documented campus/county customs |
| Projects | Volunteer work, civic engagement |
| Shared experiences | Events, committees, milestones |

**[CID-M03b]** The software should **celebrate** those elements — not replicate institutional marketing.

---

## CID-M04 — Community Layers

**[CID-M04]** Every community has multiple identity layers. Content maps to **Community DNA** categories [CID-M13].

### Geographic Identity

County · City · Region · Landscape · Local landmarks · Community character

*Applies to:* County pages, institution location context

### Educational Identity

Institution history · Campus traditions · Academic strengths · Student life · Campus setting · Founding story · Enrollment

*Applies to:* Institution pages

### Organizing Identity

Current projects · Volunteer work · Committees · Events · Community milestones · Leadership stories

*Applies to:* All community types — grows from operational DB

### Human Identity

People · Relationships · Shared accomplishments

*Applies to:* Personal profiles (future), featured participants on community pages

**[CID-M04a]** The community becomes recognizable because of its **participants** — not because of copied logos.

---

## CID-M05 — County Personalization

**[CID-M05]** Each county page may include [CNTY-M13]:

| Content | DNA category |
|---------|--------------|
| County history | `history` |
| County seat | `geography` |
| Population | `geography` |
| Major industries | `geography` |
| Geography / landscape | `geography` |
| Interesting facts | `culture` |
| Educational institutions | `geography` (links) |
| Community projects | `organizing` |
| Local photography (licensed) | `media` |
| Original illustrations | `media` |
| Community timeline | `milestones` |

**[CID-M05a]** Participant reaction target:

> **"This feels like my county."**

**Route:** `/county/[slug]`

---

## CID-M06 — Campus Personalization

**[CID-M06]** Each institution page may include [INST-M11]:

| Content | DNA category |
|---------|--------------|
| Institution history | `history` |
| Founding year | `history` |
| Enrollment | `geography` / profile |
| Campus setting | `geography` |
| Publicly documented traditions | `traditions` |
| Academic overview | `culture` |
| Student life summary | `studentLife` |
| Interesting facts | `culture` |
| Location / community context | `geography` |
| Original or licensed imagery | `media` |

**[CID-M06a]** Emphasize the **student organizing community** — not institutional marketing [INST-M09].

**[CID-M06b]** UCA and Arkansas Tech should feel equally **theirs** — same structure, different content, different accent colors.

**Route:** `/schools/[slug]`

---

## CID-M07 — Personalization Boundaries

**[CID-M07]** The platform must **avoid** [DG-002]:

| Prohibited | Reason |
|------------|--------|
| Unauthorized logos | Trademark |
| Protected mascots | Trademark |
| Official seals | Implies affiliation |
| Institutional branding that implies affiliation | Legal / confusion |
| Marketing language copied from official sources | Authenticity / IP |

**[CID-M07a]** **Preferred:** Original layouts · Original illustrations · Licensed photography · Accent colors *inspired by* publicly associated colors — not reproductions [INST-M12].

**[CID-M07b]** Required **disclaimer** on every institution page [INST-M09]:

> An independent student organizing network. Not affiliated with or endorsed by the institution.

**[CID-M07c]** When in doubt: **recognition over imitation**.

---

## CID-M08 — Visual Identity System

**[CID-M08]** Each community receives a unique visual identity within platform constraints.

| Element | Approach |
|---------|----------|
| Accent colors | Inspired by geography or publicly associated colors |
| Iconography | Original — never mascots |
| Imagery | Landscape-inspired, licensed, or original |
| Illustrations | Custom per community where available |
| Typography | Shared platform hierarchy [CID-M11] |
| Photography | Community-sourced (future) or licensed |

**[CID-M08a]** Stored in DNA `visualIdentity` block — separate from content [CID-BG].

**[CID-M08b]** V1: `colors.primary` + `colors.secondary` on registry records. V1.1: theme tokens per community.

---

## CID-M09 — Community Welcome Experience

**[CID-M09]** Every community greets new participants — **never an empty page** [LS-P3].

| Section | Content |
|---------|---------|
| Welcome message | Community-specific greeting |
| Community introduction | DNA `history` + `culture` summary |
| Current opportunities | Mission Board cards [OIS-M16] |
| Recent accomplishments | Organizing milestones |
| Upcoming events | Future module |
| Suggested first steps | Clear CTA (join, invite, volunteer) |

**[CID-M09a]** Welcome blocks render from DNA + status + opportunities — same component, different data.

---

## CID-M10 — Living Communities

**[CID-M10]** Community pages **evolve** over time.

| Future addition | Source |
|-----------------|--------|
| Timeline | Status timeline [STS-M16] |
| Major milestones | DNA `milestones` + organizing data |
| Volunteer achievements | Operational DB |
| Community stories | DNA `stories` |
| Photo galleries | DNA `media` |
| Featured projects | Graph edges |
| Recognition | OIS-M14 milestones |

**[CID-M10a]** Canonical DNA (history, geography) changes rarely. Organizing layer updates frequently.

---

## CID-M11 — Shared Platform Elements

**[CID-M11]** While communities are unique, participants always recognize:

- Navigation · Buttons · Menus · Dashboard structure
- Interaction patterns · Accessibility [ED-MF]

**[CID-M11a]** **Content varies. Shell is consistent.**

| Layer | Varies by community | Platform-wide |
|-------|---------------------|---------------|
| Copy & facts | ✅ | |
| Accent colors | ✅ | |
| Layout structure | | ✅ |
| Navigation | | ✅ |
| CTAs & forms | | ✅ |

---

## CID-M12 — Discovery Through Identity

**[CID-M12]** Identity should encourage **curiosity** and exploration.

| Discovery prompt | Example |
|------------------|---------|
| Nearby campuses | Graph: institutions in adjacent counties |
| Neighboring counties | `neighboringCounties` on county record |
| Interesting facts | DNA `culture` highlights |
| Regional organizing | Region-based grouping |
| Featured projects | Organizing layer |
| Volunteer opportunities | Mission Board [OIS-M11] |

**[CID-M12a]** Discovery modules reuse Community DNA renderer — no custom page types per entity.

---

## CID-M13 — Community DNA Architecture

**[CID-M13]** **Signature feature:** **Community DNA** — structured identity profile every community inherits.

Instead of storing scattered facts, every county, campus, committee, and (future) high school shares one **flexible schema**. Burt builds **one rendering system** that adapts to available content.

**[CID-M13a]** DNA is **content**. Visual theme is **presentation**. Status is **operational**. All three separate [CID-BG, STS-M03].

```
Community Record (Registry node)
    ├── identity (slug, name, type)
    ├── dna (Community DNA — this document)
    ├── visualIdentity (colors, imagery refs)
    ├── status (organizing lifecycle)
    └── relationships (graph edges)
```

**[CID-M13b]** Empty DNA categories **hide gracefully** — page renders what's available, never shows blank sections.

---

## CID-M14 — DNA Category Schema

**[CID-M14]** Standard DNA categories:

| Category | Key | Description |
|----------|-----|-------------|
| History | `history` | Founding, milestones, narrative |
| Geography | `geography` | Place, landscape, demographics, location |
| Culture | `culture` | Character, facts, community life |
| Traditions | `traditions` | Publicly documented customs |
| Student / Community Life | `studentLife` | Life on campus or in county |
| Civic Opportunities | `civicOpportunities` | Ways to engage locally |
| Organizing Milestones | `milestones` | Platform-tracked achievements |
| Stories | `stories` | Narrative content |
| Media | `media` | Photos, illustrations (licensed) |
| FAQ | `faq` | Common questions |
| Community Content | `communityGenerated` | User-submitted (future, moderated) |

**[CID-M14a]** Each category: `{ summary?, items?, sources?, lastUpdated? }`

**[CID-M14b]** Live schema: `data/registry/schemas/community-dna.schema.json`

---

## CID-M15 — Entity Type Inheritance

**[CID-M15]** All community types inherit DNA — with type-specific emphasis:

| Entity | Required categories (V1) | Optional |
|--------|--------------------------|----------|
| **County** | geography, history | culture, milestones, media, faq |
| **Institution** | history, geography, studentLife | traditions, culture, civicOpportunities, media, faq |
| **Committee** (future) | organizing, stories | history, media |
| **Personal** (future) | human identity subset | organizing contributions |

**[CID-M15a]** Same renderer. Type config determines section order and labels (e.g. `studentLife` → "Community Life" on county pages).

**[CID-M15b]** Community colleges, trade schools, high schools: **same profile structure**, minor type variations [INST-M04, REG-D13].

---

## CID-M16 — Rendering System

**[CID-M16]** One flexible **CommunityPage** renderer:

```
1. Load registry node + DNA + status
2. Apply visualIdentity theme tokens
3. Render welcome block [CID-M09]
4. For each DNA category (in type order):
     if category.hasContent → render section
5. Render opportunities [OIS-M16]
6. Render discovery prompts [CID-M12]
7. Render disclaimer (institution)
8. Render suggested next step [OIS-M15]
```

**[CID-M16a]** **No institution-specific hard coding** [CID-BG]. UCA and Arkansas Tech differ only in data.

**[CID-M16b]** V1: Static pages with bootstrap JSON fields. V1.1: Full DNA migration in Step 2.9.

---

## CID-M17 — Committee & Personal Identity

**[CID-M17]** Same philosophy extends beyond counties and campuses:

| Entity | Identity focus |
|--------|----------------|
| **Committee** | Purpose, members, projects, meeting rhythm |
| **Personal profile** | Network, contributions, milestones, suggested actions |

**[CID-M17a]** Personal profiles celebrate **human identity** [OM-L1] — relationships and accomplishments, not vanity metrics.

**[CID-M17b]** Future — documented now for architectural consistency.

---

## CID-M18 — V1 Scope

**[CID-M18]** Version 1 delivers:

| Deliverable | Status |
|-------------|--------|
| Community Identity philosophy | ✅ This document |
| Community DNA schema | ✅ JSON schema + catalog |
| County/campus personalization guidelines | ✅ |
| IP boundaries | ✅ |
| Platform consistency rules | ✅ |
| Institution pages with culture + colors | Partial (bootstrap JSON) |
| Full DNA migration | Step 2.9 seed plan |
| Welcome experience blocks | Design only — implementation Phase 3 |
| Living timeline / galleries | Future |

---

## CID-BG — Burt Implementation Guidance

**[CID-BG]** Implementation should:

| # | Rule |
|---|------|
| 1 | **Separate content from presentation** — DNA vs visualIdentity vs status |
| 2 | **Configurable identity themes** — accent colors, section order per entity type |
| 3 | **Original design assets** — no logos, seals, mascots |
| 4 | **No institution-specific hard coding** — one renderer, many communities |
| 5 | **Graceful degradation** — hide empty DNA sections |
| 6 | **Identity enhancements without page redesign** — add DNA categories, renderer adapts |
| 7 | **Mobile-first** community pages [ED-MF] |
| 8 | **Disclaimer always visible** on institution pages |

---

## AC-016 — Acceptance Criteria

Step 2.7 is complete when:

- [x] **[AC-016a]** Community identity philosophy documented. `[CID-M01, CID-M03]`
- [x] **[AC-016b]** County and institution personalization guidelines established. `[CID-M05, CID-M06]`
- [x] **[AC-016c]** Intellectual property boundaries respected. `[CID-M07]`
- [x] **[AC-016d]** Shared platform consistency maintained. `[CID-M11]`
- [x] **[AC-016e]** Community DNA architecture specified. `[CID-M13, CID-M14]`
- [x] **[AC-016f]** Burt has framework for community-specific experiences. `[CID-BG, community-identity.json]`

---

**Next Step:** 2.9 — Registry Seed Data Plan

*Trace: INST-M11 → CID-M06 → community-dna.schema.json → CommunityPage renderer [CID-M16]*
