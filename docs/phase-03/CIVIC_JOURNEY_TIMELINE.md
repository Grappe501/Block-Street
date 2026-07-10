# Civic Journey Timeline

**Document ID:** PHASE-003.11  
**Artifact:** `CIVIC_JOURNEY_TIMELINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Every act of service becomes part of your story.**

This is not an activity log. It is **the story of a participant's contribution to their community** — preserved for years, woven into the Civic Passport.

**Builds On:** [Participant Journey Framework](PARTICIPANT_JOURNEY.md) · [Community Recognition & Appreciation](COMMUNITY_RECOGNITION_APPRECIATION.md) · [Personal Growth & Leadership](PERSONAL_GROWTH_LEADERSHIP.md) · [Personal Relationship Network](PERSONAL_RELATIONSHIP_NETWORK.md) · [Trust, Privacy & Digital Safety](TRUST_PRIVACY_DIGITAL_SAFETY.md)

**Live spec:** `data/registry/civic-journey-timeline.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CJT-M01 | Purpose |
| CJT-M02 | Guiding principle |
| CJT-M03 | Philosophy |
| CJT-M04 | Timeline categories |
| CJT-M05 | Timeline experience |
| CJT-M06 | Reflection |
| CJT-M07 | Media attachments |
| CJT-M08 | Community history |
| CJT-M09 | Search |
| CJT-M10 | Privacy |
| CJT-M11 | Historical integrity |
| CJT-M12 | Memory Moments architecture |
| CJT-M13 | Civic Passport integration |
| CJT-M14 | Cross-system event sourcing |
| CJT-M15 | Future portfolio |
| CJT-M16 | V1 scope |
| CJT-BG | Burt implementation guidance |
| AC-030 | Step 3.11 acceptance criteria |

---

## CJT-M01 — Purpose

**[CJT-M01]** The Civic Journey Timeline preserves the history of a participant's **growth, relationships, leadership, and community contributions**.

**[CJT-M01a]** Rather than functioning as an activity log, the timeline tells the **story of how a participant developed through service and organizing**.

**[CJT-M01b]** The timeline becomes a **permanent part of the participant's Civic Passport** [CPP-001, JRN-M09].

**[CJT-M01c]** Terminology: **Civic Journey Timeline** (not "Participant Timeline" or "activity feed").

**[CJT-M01d]** Most software shows what's happening **today**. This platform helps participants understand **their story** — a feature people may not appreciate on day one but will treasure five years later.

---

## CJT-M02 — Guiding Principle

**[CJT-M02]**

> **Every act of service becomes part of your story.**

**[CJT-M02a]** Participants should be able to look back years later and **remember the communities they helped build**.

**[CJT-M02b]** Complementary to appreciation [CRA-M02]: recognition celebrates contribution; timeline **preserves** it [CRA-M10].

---

## CJT-M03 — Philosophy

**[CJT-M03]** The timeline is a **narrative** — not a transaction log.

It should answer:

| Question | Example |
|----------|---------|
| **How did I grow?** | First training → committee chair |
| **Who did I help?** | Five organizers mentored |
| **Who helped me?** | Mentor since freshman year |
| **What communities did I strengthen?** | Pulaski County launch |
| **What did we build together?** | Third committee anniversary |

**[CJT-M03a]** Timeline entries reference **canonical events** — they do not duplicate source data [CJT-M14].

**[CJT-M03b]** Narrative tone over system jargon — see [CJT-M05].

---

## CJT-M04 — Timeline Categories

**[CJT-M04]** Events naturally organize into themes:

### Joining

Registered · Completed profile · Selected campus · Selected county · Created first network · Joined first community

*Source: registration [USR-001], HQ setup [PHQ-001], RGE first invite [RGE-M11]*

### Relationships

Invited friend · Met mentor · Mentored participant · New collaboration · Community connection · Long-term partnership

*Source: PRN relationship timeline [PRN-M12], RGE attribution [RGE-M09]*

### Volunteer Service

Volunteer event · Service project · Community outreach · Hours contributed · Special projects · Recognition

*Source: VOL-001 future · CRA recognition events [CRA-M10]*

### Leadership

Organized event · Started committee · Led project · Facilitated meeting · Developed organizer · Launched community

*Source: COM-001 future · EVT-001 · PGL growth milestones [PGL-M10]*

### Learning

Completed training · Leadership lesson · Workshop · Certification · Reflection · Future Civic Academy

*Source: PGL learning pathways [PGL-M08] · future academy*

### Communities

Joined committee · Created project · Campus milestone · County milestone · Community launch · Regional collaboration

*Source: Phase 4 community hubs · CID-001*

### Recognition

Community appreciation · Volunteer recognition · Leadership milestone · Mentorship recognition · Stories · Future awards

*Source: CRA-M10 recognition timeline event types*

**[CJT-M04a]** Categories are **filters and narrative groupings** — one underlying timeline store [CJT-BG].

**[CJT-M04b]** Unified with JRN-M07 milestone catalog where applicable.

---

## CJT-M05 — Timeline Experience

**[CJT-M05]** The timeline should **read naturally**:

| Example copy |
|--------------|
| "Today you welcomed your first new participant." |
| "Two years ago you organized your first campus event." |
| "You have now mentored five organizers." |
| "The committee you helped launch is celebrating its third anniversary." |

**[CJT-M05a]** Participants should feel **proud of their journey** — tone is celebratory and reflective, not transactional.

**[CJT-M05b]** Relative time + absolute date on hover/detail — "Two years ago" links to full date.

**[CJT-M05c]** HQ Passport section [PHQ-M12] and Command Center Journey widget [PCC-M12] surface **recent highlights** — full timeline on dedicated view.

---

## CJT-M06 — Reflection

**[CJT-M06]** Participants may **optionally add reflections** to timeline moments:

- Lessons learned · Challenges overcome · Project summaries
- Personal growth · Community stories

**[CJT-M06a]** Reflection transforms **memories into knowledge** [PGL-M11 reflection journal].

**[CJT-M06b]** Reflections are **participant-authored** — never auto-generated as if from the participant [TPS-M15].

**[CJT-M06c]** Default visibility: **private** — sharable per reflection [CJT-M10].

---

## CJT-M07 — Media Attachments

**[CJT-M07]** Future versions may attach media to timeline entries:

Photos · Documents · Videos · Graphics · Volunteer projects · Presentations

**[CJT-M07a]** Media references stored — files in object storage [KDG-M09] — not embedded in timeline row.

**[CJT-M07b]** The timeline becomes **richer over time** — sparse at launch is acceptable [CJT-M16].

---

## CJT-M08 — Community History

**[CJT-M08]** Many milestones involve **other people**:

| Shared moment | Timeline behavior |
|---------------|-------------------|
| Shared volunteer project | Linked entries for each participant |
| Joint event | Co-attendee references |
| Committee launch | Founding members linked |
| Community celebration | Community node + participant edges |

**[CJT-M08a]** Participants see how their story **intersects with others** — graph edges, not duplicate narratives [REL-M01, PDT-001].

**[CJT-M08b]** Privacy: co-participant names respect visibility [SEC-001, TPS-M07].

---

## CJT-M09 — Search

**[CJT-M09]** Participants should eventually **search their journey**:

| Query type | Example |
|------------|---------|
| Volunteer projects | "Show volunteer projects" |
| Committee work | "Show committee work" |
| Leadership | "Show leadership experiences" |
| Mentorship | "Show mentorship" |
| Campus history | "Show campus history" |

**[CJT-M09a]** Search indexes **category, date, community, reflection text** (participant's own only).

**[CJT-M09b]** The timeline becomes a **searchable memory** — critical for long-tenure participants.

---

## CJT-M10 — Privacy

**[CJT-M10]** Participants control:

| Control | Default |
|---------|---------|
| Who sees the timeline | Connections |
| Public milestones | Opt-in per event |
| Private reflections | Only Me |
| Community stories | Author consent [CRA-M09a] |
| Recognition entries | Per CRA-M10b views |

**[CJT-M10a]** Sharing is always **participant-controlled** [SEC-001, TPS-M07].

**[CJT-M10b]** Three views align with CRA-M10b:

| View | Content |
|------|---------|
| **Private** | Full timeline including reflections |
| **Connections** | Milestones + public gratitude |
| **Public** | Privacy-filtered highlights |

---

## CJT-M11 — Historical Integrity

**[CJT-M11]** Timeline events should **preserve history** [KDG-M07, STS-M16]:

**[CJT-M11a]** Rather than deleting important events, they should generally be **archived** where appropriate — participants retain a continuous record.

**[CJT-M11b]** Append-only write pattern — corrections add **amendment entries**, not silent overwrites.

**[CJT-M11c]** Institution or county changes preserve **historical edges** — "Previously at X" remains in timeline [PEP-M16].

**[CJT-M11d]** Aligns with Status Timeline architecture [STS-M16] across entities.

---

## CJT-M12 — Memory Moments Architecture

**[CJT-M12]** **Signature feature:** The system occasionally surfaces **significant memories** — not nostalgia for its own sake, but continuity and celebration of service.

| Example Memory Moment |
|-----------------------|
| "One year ago today you welcomed your first new member." |
| "Three years ago you helped launch the Pulaski County community." |
| "Remember your first volunteer event?" |
| "Today marks two years since you organized your first campus meeting." |

**[CJT-M12a]** Memory Moments reinforce **continuity**, celebrate service, and remind participants of the difference they've made [CAM-M03 celebrate].

**[CJT-M12b]** Orchestrator: `surfaceMemoryMoments(participantId, asOfDate)` — queries timeline for anniversaries, firsts, and milestones.

**[CJT-M12c]** Delivery respects **Attention Budget** [CAM-M13] — inspirational priority; Morning Brief or Passport highlight, not push spam.

**[CJT-M12d]** Frequency cap — max one Memory Moment per login session unless participant opts into more.

**[CJT-M12e]** Participant may **dismiss or snooze** — never dark-pattern re-surface.

---

## CJT-M13 — Civic Passport Integration

**[CJT-M13]** Timeline is the **narrative backbone** of the Civic Passport [JRN-M09, CPP-001]:

| Passport section | Timeline source |
|------------------|-----------------|
| Milestones | JRN-M07 + CRA categories |
| Service history | Volunteer category |
| Leadership | Leadership category |
| Growth narrative | PGL Growth Graph summary [PGL-M13] |
| Recognition | CRA-M10 entries |
| Personal reflections | CJT-M06 |

**[CJT-M13a]** Passport is **exportable narrative** future — timeline is source of truth for story assembly.

**[CJT-M13b]** Monthly Impact Report [CAM-M08] may include timeline highlights — budget-respecting digest.

---

## CJT-M14 — Cross-System Event Sourcing

**[CJT-M14]** Timeline entries **reference canonical events** — do not duplicate source data:

```
timeline_entries
    → source_type: "registration" | "relationship" | "volunteer" | ...
    → source_id: UUID of canonical record
    → narrative: generated human-readable copy [CJT-M05]
    → category: CJT-M04 key
    → occurred_at: timestamp
    → visibility: CJT-M10
```

**[CJT-M14a]** Event producers emit **timeline events** on meaningful actions:

| Producer | Example event |
|----------|---------------|
| USR-001 registration | `joined.registered` |
| RGE-001 invite accepted | `relationships.inviteAccepted` |
| CRA-001 gratitude received | `recognition.gratitudeReceived` |
| PGL-001 growth milestone | `learning.milestoneReached` |
| PRN-M12 | `relationships.timelineSeed` |

**[CJT-M14b]** Single `appendTimelineEntry()` gate — idempotent on `source_type + source_id`.

**[CJT-M14c]** Sub-timelines (relationship [PRN-M12], growth [PGL-M10], recognition [CRA-M10]) are **views** over unified store — not separate silos.

---

## CJT-M15 — Future Portfolio

**[CJT-M15]** Long-term vision: timeline supports **portfolio export** for scholarships, applications, and leadership references:

- Curated public milestone set
- Service hours summary
- Leadership narrative
- Mentor attestations future

**[CJT-M15a]** Participant selects which entries appear in portfolio — never auto-public [CJT-M10].

---

## CJT-M16 — V1 Scope

**[CJT-M16]** Design complete in Step 3.11; implementation post-V1 core:

| Deliverable | V1 |
|-------------|-----|
| Philosophy + category taxonomy | ✅ this document |
| Memory Moments architecture spec | ✅ CJT-M12 |
| Event sourcing pattern | ✅ CJT-M14 |
| Registration + first invite timeline seeds | minimal |
| Full search + media + portfolio | v1.1+ |
| Memory Moments UI | v1.1 |
| Reflection authoring | v1.1 |

**[CJT-M16a]** Jul 12/14: **append registration event** on join — timeline stub in Passport section; full UI post-launch.

---

## CJT-BG — Burt Implementation Guidance

**[CJT-BG]** Implementation should:

1. **Store timeline entries independently** — `timeline_entries` table, append-only [CJT-M11]
2. **Reference canonical events** — `source_type` + `source_id` [CJT-M14]
3. **Support multiple event types** — category taxonomy [CJT-M04]
4. **Allow future media attachments** — nullable `media_refs[]` [CJT-M07]
5. **Optimize for chronological exploration** — index on `participant_id, occurred_at DESC`
6. **Design for long-term historical preservation** — archive not delete [CJT-M11]

**[CJT-BG-a]** Recommended file structure:

```
src/lib/timeline/appendTimelineEntry.ts
src/lib/timeline/generateNarrative.ts
src/lib/timeline/surfaceMemoryMoments.ts
src/lib/timeline/searchTimeline.ts
```

**[CJT-BG-b]** Database objects:

| Table | Purpose |
|-------|---------|
| `timeline_entries` | Append-only journey events |
| `timeline_reflections` | Optional participant reflections |
| `timeline_media_refs` | Future media attachments |

**[CJT-BG-c]** No feature ships milestone UI without timeline event emission — production gate extension.

---

## AC-030 — Acceptance Criteria

Step 3.11 is complete when:

- [x] **[AC-030a]** Civic Journey Timeline philosophy documented. `[CJT-M01, CJT-M03]`
- [x] **[AC-030b]** Timeline categories established. `[CJT-M04]`
- [x] **[AC-030c]** Reflection and storytelling incorporated. `[CJT-M05, CJT-M06]`
- [x] **[AC-030d]** Privacy and historical preservation defined. `[CJT-M10, CJT-M11]`
- [x] **[AC-030e]** Memory Moments architecture specified. `[CJT-M12]`
- [x] **[AC-030f]** Civic Passport integration documented. `[CJT-M13, JRN-M09]`
- [x] **[AC-030g]** Burt has blueprint for lifelong participant narrative. `[CJT-BG, civic-journey-timeline.json]`

---

**Next Step:** 3.14 — Participant Experience

*Trace: Service → timeline entry → Civic Passport → Memory Moment → "remember why I stayed" → sustained engagement*
