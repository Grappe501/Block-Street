# Build Volume 2.8 — Media & Document Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.8 · **DAB-009**  
**Artifact:** `MEDIA_DOCUMENT_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.4 Database Schema Blueprint](DATABASE_SCHEMA_BLUEPRINT.md) [DAB-SCH12] · [Community Brain CKLS-001](../phase-03/COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · Story Atlas [CST-001] · Knowledge Governance [KDG-001]  
**Live spec:** `data/registry/media-document-model.json`

> Media is not simply file storage. It is part of the **institutional memory** of every participant, community, mission, and organization.

---

## Purpose

**[DAB-MED01]** The Media & Document Data Model defines how every document, image, video, audio recording, presentation, PDF, form, map, and digital artifact is managed throughout the Community Operating System.

**[DAB-MED01a]** Every media object should become:

- Searchable
- Connected
- Permission-aware
- Reusable

**[DAB-MED01b]** Media supports Community Brain [CKLS-001], Story Atlas [CST-001], Mission Library, and Legacy [DAB-SCH12].

---

## Guiding Principle

**[DAB-MED02]**

> **Knowledge is more valuable when its supporting evidence is preserved.**

**[DAB-MED02a]** Every document tells part of the community's story.

---

## Philosophy

**[DAB-MED03]** Traditional systems treat files as attachments.

**[DAB-MED03a]** The Community Operating System treats every document as a **first-class knowledge object**.

**[DAB-MED03b]** A document should know:

- Who created it
- Why it exists
- Which mission it supports
- Which communities use it
- Which stories reference it
- What knowledge was derived from it
- How it has evolved over time

**[DAB-MED03c]** Files become **connected knowledge**.

---

## Media Architecture

**[DAB-MED04]** Every media object contains six layers:

```text
File
     ↓
Metadata
     ↓
Relationships
     ↓
Permissions
     ↓
Knowledge
     ↓
History
```

**[DAB-MED04a]** The file is only **one part** of the object — metadata and relationships are equally canonical.

---

## Media Categories

**[DAB-MED05]** Seven primary media categories.

### Documents

**[DAB-MED05a]** Examples: PDF · Word documents · Markdown · Text · Policies · Reports · Meeting notes · Research

### Images

**[DAB-MED05b]** Examples: Photos · Graphics · Maps · Infographics · Scanned forms · Historical photographs

### Videos

**[DAB-MED05c]** Examples: Training · Community stories · Meetings · Presentations · Volunteer highlights · Instructional content

### Audio

**[DAB-MED05d]** Examples: Podcasts · Interviews · Meeting recordings · Oral histories · Training audio · Community memories

### Presentations

**[DAB-MED05e]** Examples: Slide decks · Workshops · Leadership training · Mission briefings · Educational content

### Structured Data Files

**[DAB-MED05f]** Examples: CSV · Spreadsheet · Import templates · Export packages · Analytics · Survey results

### Generated Artifacts

**[DAB-MED05g]** Examples: Reports · AI summaries · Certificates · Recognition documents · Meeting minutes · Mission summaries

**[DAB-MED05g1]** Generated artifacts remain **traceable to their source data** [KDG-001 · Knowledge Provenance].

---

## Canonical Media Object

**[DAB-MED06]** Every media object includes:

| Field | Purpose |
|-------|---------|
| Canonical ID | Stable identifier |
| Title | Human-readable name |
| Description | Purpose and summary |
| Media Type | Category classification |
| Owner | Participant or entity owner |
| Creation Date | When object born |
| Version | Current revision |
| Visibility | Permission class |
| Language | Content language |
| Tags | Discovery aids |
| Source | Origin channel or system |
| Relationships | Linked entities |
| Review Status | Stewardship state |

**[DAB-MED06a]** Metadata is as **important as the file itself**.

---

## Document Relationships

**[DAB-MED07]** Documents may relate to:

Participant · Community · Mission · Event · Story · Lesson · Playbook · Institution · County · Initiative · Knowledge Graph

**[DAB-MED07a]** Media **never exists in isolation** — explicit relationships to canonical entities [DAB-REL02].

**[DAB-MED07b]** Relationship types: `cover`, `gallery`, `evidence`, `attachment`, `charter`, `citation`, `source`.

---

## Versioning

**[DAB-MED08]** Documents should support:

- Version history
- Revision notes
- Author history
- Approval history
- Published version
- Draft version

**[DAB-MED08a]** Historical versions remain **accessible** — rollback creates new version, never destroys history.

**[DAB-MED08b]** Stories may snapshot document version at publish time [CST-001].

---

## OCR & Content Extraction

**[DAB-MED09]** Supported where appropriate. Extract:

- Text
- Tables
- Metadata
- Images
- Forms
- Signatures (when permitted)

**[DAB-MED09a]** OCR results become **searchable** while preserving the original file.

**[DAB-MED09b]** Extraction is a **derived capability** — optional V1; manual text entry acceptable for launch.

**[DAB-MED09c]** EXIF stripped on photo upload for privacy [DAB-SPM].

---

## Metadata Model

**[DAB-MED10]** Support:

Author · Created · Modified · Publisher · Keywords · Language · File Size · Checksum · Content Type · License · Review Status · Retention Policy

**[DAB-MED10a]** Metadata improves **discovery** — feeds search indexes [DAB-011] and AI retrieval [DAB-013].

**[DAB-MED10b]** `alt_text` required for public images [UXB-001 · EDB-001].

---

## Tagging

**[DAB-MED11]** Support tags for:

Topics · Communities · Missions · Leadership · Training · Volunteer · Knowledge Areas · Geography

**[DAB-MED11a]** Tags assist discovery but **do not replace structured relationships**.

---

## Search Integration

**[DAB-MED12]** Every document contributes to:

- Full-text search
- Semantic search
- Relationship search
- Knowledge search
- Media search

**[DAB-MED12a]** Search indexes are **derived** from canonical media records — rebuildable [DAB-EVT14].

---

## Knowledge Integration

**[DAB-MED13]** Documents may become:

Community Brain entries · Experience Playbooks · Lessons · Mission Library · Story Atlas · Legacy

**[DAB-MED13a]** Knowledge **compounds through documentation** [DAB-SCH12 · CKLS-001].

---

## Story Integration

**[DAB-MED14]** Stories may reference:

Photos · Videos · Documents · Audio · Maps · Historical artifacts

**[DAB-MED14a]** Stories become **evidence-backed narratives** [CST-001 · DAB-REL07i].

---

## AI Integration

**[DAB-MED15]** AI may:

- Summarize documents
- Extract lessons
- Generate citations
- Classify topics
- Recommend related knowledge
- Detect duplicate documents

**[DAB-MED15a]** AI **never replaces original source material** [DAB-PH10 · CIF-001].

**[DAB-MED15b]** All AI outputs cite source media IDs and checksums.

---

## Permission Model

**[DAB-MED16]** Media inherits permission from:

- Owner
- Community
- Mission
- Knowledge object
- Explicit overrides (when appropriate)

**[DAB-MED16a]** Sensitive documents remain **protected** — aligned with data classes [KDG-001 · DAB-SPM].

**[DAB-MED16b]** Signed URLs for private assets — short TTL. RLS by community scope + data class.

---

## Retention Model

**[DAB-MED17]** Every media object defines:

Retention period · Archive policy · Deletion eligibility · Legal hold · Historical significance

**[DAB-MED17a]** Retention should be **configurable** per type and data class.

**[DAB-MED17b]** Historical significance may override default deletion policy.

---

## Integrity

**[DAB-MED18]** Every stored file should support:

- Checksum (SHA-256)
- Version validation
- Corruption detection
- Backup verification

**[DAB-MED18a]** Authenticity strengthens **institutional trust**.

---

## External References

**[DAB-MED19]** Some documents may remain external.

Examples: Government publications · Academic papers · Public reports · Official guidance

**[DAB-MED19a]** The platform stores **metadata and references** rather than duplicating copyrighted content unless permitted [KDG-001 · approved sources].

---

## Media Collections

**[DAB-MED20]** Support curated collections:

Community archives · Training libraries · Mission documentation · Leadership resources · County history · Volunteer galleries

**[DAB-MED20a]** Collections become **reusable knowledge assets**.

---

## Geographic Integration

**[DAB-MED21]** Media may connect to:

County · Institution · Venue · Map · Community · Historic location

**[DAB-MED21a]** Maps and media **reinforce one another** [Registry geo metadata].

---

## Future Media Types

**[DAB-MED22]** Future additions may include:

3D models · Virtual tours · AR experiences · Interactive maps · Simulation data · Drone imagery

**[DAB-MED22a]** The architecture remains **extensible** through addition [DAB-SCH31].

---

## Evidence Vault

**[DAB-MED23]** **Major Architectural Recommendation:** Create an **Evidence Vault** as a specialized layer above media storage.

**[DAB-MED23a]** The Evidence Vault is not simply a file repository. It preserves the **evidence behind the platform's knowledge**.

**[DAB-MED23b]** Every story, lesson, recommendation, report, and Community Brain entry can trace back to supporting evidence in the vault.

Examples:

- Meeting recordings supporting meeting minutes
- Photos documenting completed volunteer projects
- Research reports supporting published playbooks
- Historical documents supporting Legacy records
- Public records supporting county profiles
- Videos supporting community stories
- Signed agreements supporting partnerships

**[DAB-MED23c]** Each evidence object maintains:

| Field | Purpose |
|-------|---------|
| Source | Origin and provenance |
| Chain of custody | Who handled it when |
| Related entities | Linked canonical objects |
| Associated events | Community Event Ledger links [DAB-EVT21] |
| Permission level | Access control |
| Retention policy | Lifecycle rules |
| Integrity verification | Checksum and validation |
| Citation metadata | How to reference in knowledge |

**[DAB-MED23d]** The Evidence Vault answers:

> **"How do we know this is true?"**

**[DAB-MED23e]** Rather than relying solely on summaries, the platform traces important conclusions back to **underlying evidence** — transparency, institutional memory, and explainable intelligence [KDG-001 · CIF-001].

**[DAB-MED23f]** Live spec: `data/registry/media-document-model.json` · `evidenceVault`

---

## Burt Implementation Guidance

**[DAB-MED24]** Implementation should:

1. Treat media as **first-class knowledge objects**
2. Store **rich metadata** alongside every file
3. Preserve **version history**
4. Separate **canonical metadata from storage implementation** (Supabase Storage V1)
5. Support **OCR and search as derived capabilities**
6. Integrate media with the **Community Knowledge Graph** [DAB-006]
7. Consult Evidence Vault spec before any media feature

**[DAB-MED24a]** Logical entities map to Knowledge schema [DAB-SCH12]: Story · Lesson · MediaReference · Legacy.

---

## AC-114 — Acceptance Criteria

Volume 2.8 is complete when:

- [x] **[AC-114a]** Media philosophy is documented. `[DAB-MED03]`
- [x] **[AC-114b]** Canonical media object is defined. `[DAB-MED04–MED06]`
- [x] **[AC-114c]** Versioning, metadata, OCR, search, and AI integration are established. `[DAB-MED08–MED15]`
- [x] **[AC-114d]** Permission and retention models are incorporated. `[DAB-MED16–MED17]`
- [x] **[AC-114e]** Evidence Vault specified. `[DAB-MED23]`
- [x] **[AC-114f]** Burt has a complete blueprint for document and media management. `[DAB-MED24]`

---

**Next step:** [2.9 — Configuration Data Model](CONFIGURATION_MODEL.md) [DAB-010]

**End of Volume 2.8.**
