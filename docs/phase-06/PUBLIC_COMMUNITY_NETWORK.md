# Public Community Network

**Document ID:** PHASE-006.12  
**Artifact:** `PUBLIC_COMMUNITY_NETWORK.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** PCN

> **Every community deserves a public home that reflects its identity and welcomes new people.**

Step 6.12 is where the platform distinguishes itself from a traditional website. This is **not** a passive public page — it is a **living window** into community activity: discover communities, explore their work, learn their mission, and find meaningful ways to get involved.

**Requirement:** PCN-001 · **Planned alias superseded:** PPS-001 · **Extends:** [Community Storytelling CST-001](../phase-05/COMMUNITY_STORYTELLING_SYSTEM.md) · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** CST-001 · [Opportunity Exchange OEX-001](../phase-04/OPPORTUNITY_EXCHANGE.md) · [Community Growth & Outreach CGO-001](COMMUNITY_GROWTH_OUTREACH_SYSTEM.md) · [Invitation & Connection ICS-001](INVITATION_CONNECTION_SYSTEM.md) · [Welcome & Belonging WBS-001](WELCOME_BELONGING_SYSTEM.md) · [Institution Registry INST-001](../phase-02/INSTITUTION_REGISTRY_MODEL.md) · [County Registry CNTY-001](../phase-02/COUNTY_REGISTRY.md) · [Knowledge & Data Governance KDG-001](../phase-03/KNOWLEDGE_DATA_GOVERNANCE.md)

**Live spec:** `data/registry/public-community-network.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PCN-M01 | Purpose |
| PCN-M02 | Guiding principle |
| PCN-M03 | Philosophy |
| PCN-M04 | Public Community Profiles |
| PCN-M05 | Educational Institution Profiles |
| PCN-M06 | County Community Profiles |
| PCN-M07 | Community Activity Feed |
| PCN-M08 | Public Calendar |
| PCN-M09 | Opportunity Explorer |
| PCN-M10 | Story Showcase |
| PCN-M11 | Community Map |
| PCN-M12 | Search & Discovery |
| PCN-M13 | Join Pathways |
| PCN-M14 | Privacy |
| PCN-M15 | Future AI assistance |
| PCN-M16 | Arkansas Community Explorer |
| PCN-M17 | Community Personality |
| PCN-M18 | V1 scope |
| PCN-BG | Burt implementation guidance |
| AC-073 | Step 6.12 acceptance criteria |

---

## PCN-M01 — Purpose

**[PCN-M01]** The **Public Community Network (PCN)** provides every community with a **dynamic public presence** where students, young adults, families, partners, and prospective participants can discover communities, explore activities, learn missions, and find meaningful ways to get involved.

**[PCN-M01a]** Public experience should inspire **confidence, curiosity, and participation** while protecting private community information [KDG-001, SEC-001].

**[PCN-M01b]** Every campus, county, committee, and initiative deserves a **beautiful public-facing home that feels alive** — not a static brochure [CST-001 living stories].

---

## PCN-M02 — Guiding Principle

**[PCN-M02]**

> **Every community deserves a public home that reflects its identity and welcomes new people.**

**[PCN-M02a]** Public pages should **invite people into community life** [ICS-001 front door, WBS-001 welcome path].

**[PCN-M02b]** Complements [Community Personality PCN-M17] — shared architecture, local identity.

---

## PCN-M03 — Philosophy

**[PCN-M03]** The public network is **not a brochure** — it is a **living window into community activity**.

**[PCN-M03a]** Visitors should quickly understand:

| Question | Source |
|----------|--------|
| Who are we? | Mission · story · personality [PCN-M17] |
| Why do we exist? | Community story · founding purpose |
| What are we doing? | Activity feed · initiatives · calendar |
| How can I help? | Opportunity Explorer [PCN-M09] |
| How do I join? | Join pathways [PCN-M13] |
| What makes us unique? | Traditions · Culture Garden highlights [CCR-001] |

**[PCN-M03b]** Public layer is **separate from internal operations** [PCN-BG, CCN-M004] — presentation without exposing operational intelligence [OPIS-001].

---

## PCN-M04 — Public Community Profiles

**[PCN-M04]** Every campus, county, committee, and initiative receives a **public profile**:

- Mission · community story · location · founding date · photos
- Community traditions · upcoming public events · current initiatives
- Volunteer opportunities · leadership contact (if desired)

**[PCN-M04a]** Profiles should be **attractive and easy to navigate** — mobile-first, accessible [PEL-001].

**[PCN-M04b]** Route: `/community/[slug]` (public view) · orchestrator: `getPublicCommunityProfile(slug)`.

**[PCN-M04c]** Community controls what is public [PCN-M14] — defaults conservative, opt-in for each field [SEC-001].

---

## PCN-M05 — Educational Institution Profiles

**[PCN-M05]** For every college, university, and future educational institution, public profiles include **publicly available information**:

- Institution overview · location · county · year founded
- Enrollment (updated periodically from public sources)
- School colors (used respectfully **without implying affiliation**)
- Mascot (text only, where appropriate)
- Academic highlights · campus traditions (from public information)
- Links to institution's **official website**

**[PCN-M05a]** Goal: students feel they are entering **a space built for their campus community** [original platform vision] while respecting trademarks and institutional identity [KDG-001].

**[PCN-M05b]** Route: `/schools/[slug]/community` · integrates [INST-001 registry] · orchestrator: `getPublicInstitutionProfile(slug)`.

**[PCN-M05c]** No implied endorsement — clear ASYON/community platform attribution [CONST legal posture].

---

## PCN-M06 — County Community Profiles

**[PCN-M06]** Each county receives a **public page**:

- County overview · map · communities served
- Current initiatives · volunteer opportunities · stories
- Upcoming events · partner organizations [IPS-001 public partners]

**[PCN-M06a]** **Counties become visible organizing hubs** [CNTY-001, CGO-M16 coverage lens].

**[PCN-M06b]** Route: `/county/[slug]` (public layer) · orchestrator: `getPublicCountyProfile(slug)`.

**[PCN-M06c]** Complements internal [County Command Center CCC-001] — public vs operational separation [PCN-BG].

---

## PCN-M07 — Community Activity Feed

**[PCN-M07]** Public visitors may see (community-approved):

- Stories · photos · completed missions · upcoming public events
- Community highlights · volunteer opportunities · recognition [CCR-001 public recognition]

**[PCN-M07a]** Feed reflects the community's **ongoing life** — not stale marketing copy [CST-M04 story pipeline].

**[PCN-M07b]** Orchestrator: `getPublicActivityFeed(communityId, pagination?)`.

**[PCN-M07c]** Only content marked **public** surfaces [PCN-M14, KDG-M16 data classification].

---

## PCN-M08 — Public Calendar

**[PCN-M08]** Communities may choose to publish:

- Public meetings · volunteer opportunities · training sessions
- Service events · community celebrations

**[PCN-M08a]** **Private activities remain private** [TSOS-001 visibility controls, SEC-001].

**[PCN-M08b]** Integrates [EEOS-001 events] · orchestrator: `getPublicCalendar(communityId, dateRange?)`.

---

## PCN-M09 — Opportunity Explorer

**[PCN-M09]** Visitors easily browse:

- Volunteer opportunities · events · committees seeking participants
- Leadership opportunities · community projects

**[PCN-M09a]** **Opportunity Explorer** connects directly to [Opportunity Exchange OEX-001] while respecting permissions — public opportunities only [OBE-001].

**[PCN-M09b]** Route: `/explore/opportunities` · orchestrator: `explorePublicOpportunities(filters?)`.

**[PCN-M09c]** Filter by location · mission · community type · date · skills needed.

---

## PCN-M10 — Story Showcase

**[PCN-M10]** Communities feature:

- Volunteer stories · leadership journeys · mission highlights
- Community traditions · photo galleries · videos · recognition stories

**[PCN-M10a]** **Stories make the community feel human** [CST-001, CCR-001 story-based recognition].

**[PCN-M10b]** Integrates [Story Atlas CST-M16] — public stories as geographic discovery layer.

**[PCN-M10c]** Orchestrator: `getPublicStoryShowcase(communityId)`.

---

## PCN-M11 — Community Map

**[PCN-M11]** Visitors browse Arkansas by:

- County · college · university · trade school · future high schools · regional communities

**[PCN-M11a]** **Every public community becomes discoverable** [Arkansas Coverage Map CGO-M16 public lens].

**[PCN-M11b]** Route: `/map/communities` · orchestrator: `getPublicCommunityMap(filters?, layers?)`.

**[PCN-M11c]** Layer toggles: by community type · by activity level · by opportunity count · gaps view (organizer-only).

---

## PCN-M12 — Search & Discovery

**[PCN-M12]** Public visitors search by:

- Institution name · county · community type · mission category
- Volunteer opportunities · events · topics

**[PCN-M12a]** **Discovery encourages exploration** — not algorithmic engagement traps [GCN-M03 Belonging Over Engagement].

**[PCN-M12b]** Route: `/explore/search` · orchestrator: `searchPublicCommunities(query, filters?)`.

**[PCN-M12c]** SEO-friendly URLs and metadata [PCN-BG discoverability].

---

## PCN-M13 — Join Pathways

**[PCN-M13]** Every public page clearly answers:

- How do I join? · Who can participate?
- What happens after I register? · Who will welcome me?

**[PCN-M13a]** **Joining should feel approachable** [ICS-001 Universal Invitation Builder integration].

**[PCN-M13b]** Join CTA links to [Invitation landing ICS-M08] → [Welcome Journey WBS-M04 First 30 Days].

**[PCN-M13c]** Orchestrator: `getJoinPathway(communityId)` — community-specific welcome preview.

---

## PCN-M14 — Privacy

**[PCN-M14]** Only information **intentionally marked public** is displayed.

**Private (never on public network):**

- Community discussions · member lists · internal planning
- Operational intelligence [OPIS-001] · sensitive stories [SEC-001]

**[PCN-M14a]** Public network should **inspire trust while protecting community privacy** [KDG-001, CCN-M004].

**[PCN-M14b]** Enforced at data layer — public API returns only classified-public fields [KDG-M16].

**[PCN-M14c]** Community admins review public content before publish [optional workflow v1.1].

---

## PCN-M15 — Future AI Assistance

**[PCN-M15]** Future AI **assists communication** — never replaces authentic community voices [GCN-M15, CST-M12].

**[PCN-M15a]** May:

- Summarize community activity · recommend communities based on interests
- Highlight volunteer opportunities · generate public event descriptions
- Recommend related stories · support multilingual public content (future)

**[PCN-M15b]** All AI-generated public content **community-approved** before publish [KDG-001].

---

## PCN-M16 — Arkansas Community Explorer

**[PCN-M16]** The **Arkansas Community Explorer (ACE)** is the **signature public discovery experience** — potentially the homepage many first-time visitors experience.

**[PCN-M16a]** Interactive map of Arkansas. Visitors click:

- A county · a university · a community college · a trade school
- A future high school · a statewide initiative

**[PCN-M16b]** Each location opens a **rich public profile**:

- Community overview · stories · public events · volunteer opportunities
- Growth highlights [CGO-001] · traditions · community photos · ways to get involved

**[PCN-M16c]** As the network grows, **the map becomes richer and more vibrant** [living network thesis GOS-001].

**[PCN-M16d]** Route: `/explore` (primary) · also enhances `/` homepage · orchestrator: `getArkansasCommunityExplorer(filters?, selectedSlug?)`.

**[PCN-M16e]** Complements internal maps:

| Map | Audience |
|-----|----------|
| [Coverage Map CGO-M16] | Organizers |
| [Civic Ecosystem Map IPS-M13] | Institutional partnerships |
| [Story Atlas CST-M16] | Narrative geography |
| **Community Explorer PCN-M16** | **Public discovery** |

**[PCN-M16f]** Not a static landing page — **interactive exploration** into community life.

---

## PCN-M17 — Community Personality

**[PCN-M17]** Each public community expresses **its own identity** while remaining part of the statewide platform [CEF-M01 recognizably the same].

**[PCN-M17a]** Examples:

- **UCA community** — student leadership, service learning, campus traditions
- **Philander Smith community** — history, civic engagement, campus culture
- **County community** — local service projects, regional partnerships

**[PCN-M17b]** Platform provides **consistent structure** while allowing each community to **tell its own story** [CCN-M identity, CID-001 community identity].

**[PCN-M17c]** Students feel they are entering **their community** when visiting their campus page — same underlying [Community OS COS-001], unique local expression [PCN-M17].

**[PCN-M17d]** Configurable: hero imagery · accent themes (within brand guidelines) · featured traditions · personality tags · welcome message.

**[PCN-M17e]** Orchestrator: `getCommunityPersonality(communityId)` · stored in `community_personality_config` [PCN-BG].

---

## PCN-M18 — V1 scope

| Deliverable | Status |
|-------------|--------|
| PCN philosophy documented | ✅ |
| Public profiles and discovery | ✅ |
| Institution and county pages defined | ✅ |
| Privacy boundaries | ✅ |
| Community Personality architecture | ✅ |
| Arkansas Community Explorer spec | ✅ |
| Live explorer with map aggregation | v1.1 |
| Multilingual public content | future |

---

## PCN-BG — Burt Implementation Guidance

**[PCN-BG-a]** Implementation should:

- **Separate public presentation from internal community operations** [CCC-001 vs PCN public layer]
- Support **customizable public profiles** and [Community Personality PCN-M17]
- Integrate [CST-001 Storytelling], [OEX-001 Opportunities], [CGO-001 Growth], [ICS-001 Invitations], [WBS-001 Welcome]
- **Protect all private operational data** [KDG-001 classification at query layer]
- Design for **search engine discoverability** [metadata, structured data, sitemap]
- Support **future expansion** to additional community types [CEF-001]

**[PCN-BG-b]** Files:

```
src/lib/pcn/getPublicCommunityProfile.ts
src/lib/pcn/getPublicInstitutionProfile.ts
src/lib/pcn/getPublicCountyProfile.ts
src/lib/pcn/getPublicActivityFeed.ts
src/lib/pcn/explorePublicOpportunities.ts
src/lib/pcn/getArkansasCommunityExplorer.ts
src/lib/pcn/getCommunityPersonality.ts
src/lib/pcn/searchPublicCommunities.ts
src/components/public/ArkansasCommunityExplorer.tsx
src/components/public/PublicCommunityProfile.tsx
src/components/public/OpportunityExplorer.tsx
data/registry/public-community-network.json
```

**[PCN-BG-c]** Database: `DB-PCN` · tables: `public_community_profiles`, `public_activity_feed`, `public_calendar_events`, `community_personality_config`, `explorer_map_cache`.

---

## AC-073 — Acceptance Criteria

Step 6.12 is complete when:

- [x] **[AC-073a]** Public Community Network philosophy documented. `[PCN-M01, PCN-M02, PCN-M03]`
- [x] **[AC-073b]** Public profiles and discovery mechanisms established. `[PCN-M04, PCN-M11, PCN-M12]`
- [x] **[AC-073c]** Educational institution and county pages defined. `[PCN-M05, PCN-M06]`
- [x] **[AC-073d]** Privacy boundaries incorporated. `[PCN-M14]`
- [x] **[AC-073e]** Community Personality specified. `[PCN-M17]`
- [x] **[AC-073f]** Arkansas Community Explorer specified. `[PCN-M16]`
- [x] **[AC-073g]** Burt has blueprint for statewide public-facing community network. `[PCN-BG, public-community-network.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Discover on Explorer → explore profile → find opportunity → join pathway → welcome → belong → community grows*
