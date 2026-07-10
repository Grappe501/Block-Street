# Build Volume 2.8 — Media & Document Model

### Data Architecture Bible

**Document ID:** VOLUME-002.8 · **DAB-009**  
**Artifact:** `MEDIA_DOCUMENT_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [Community Brain CKLS-001](../phase-03/COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · Story Atlas [CST-001]  
**Live spec:** `data/registry/media-document-model.json`

---

## DAB-MED01 — Purpose

**[DAB-MED01]** Defines images, videos, PDFs, audio, documents, OCR, metadata, version history, and permissions — supporting **Community Brain** and **Story Atlas**.

---

## DAB-MED02 — Media Asset

**[DAB-MED02a]** Table: `media.media_assets`:

```text
media_assets (
  id, asset_type,        -- image | video | audio | pdf | document | other
  filename, mime_type, byte_size,
  storage_provider,     -- supabase_storage
  storage_path, storage_bucket,
  checksum_sha256,
  width, height, duration_seconds,  -- type-specific
  uploaded_by, community_scope,
  visibility, data_class,
  created_at, archived_at
)
```

---

## DAB-MED03 — Document Model

**[DAB-MED03a]** Table: `media.documents` — logical document (may have multiple asset versions):

```text
documents (
  id, title, document_type, community_scope,
  current_version_id, owner_id, visibility,
  linked_entity_type, linked_entity_id,
  created_at, updated_at
)
```

**[DAB-MED03b]** Table: `media.document_versions`:

```text
document_versions (
  id, document_id, version_number,
  asset_id, body_text,           -- extracted/plain text
  change_summary, created_by, created_at
)
```

---

## DAB-MED04 — Metadata

**[DAB-MED04a]** EXIF stripped on upload for privacy (photos).

**[DAB-MED04b]** Custom metadata jsonb: `{ tags[], source, license, alt_text, caption }`.

**[DAB-MED04c]** `alt_text` required for public images [UXB-001 · EDB-001].

---

## DAB-MED05 — OCR & Text Extraction

**[DAB-MED05a]** PDF/image pipeline extracts `body_text` for search and AI retrieval [DAB-SIX · DAB-AIK].

**[DAB-MED05b]** Job table: `media.extraction_jobs (asset_id, status, extracted_text, completed_at)`.

**[DAB-MED05c]** OCR optional V1 — manual text entry acceptable for launch.

---

## DAB-MED06 — Entity Attachments

**[DAB-MED06a]** Junction: `media.entity_attachments (entity_type, entity_id, asset_id, attachment_role)`.

**[DAB-MED06b]** Roles: `cover`, `gallery`, `evidence`, `avatar`, `charter`, `attachment`.

---

## DAB-MED07 — Permissions

**[DAB-MED07a]** Inherit from linked entity visibility unless overridden.

**[DAB-MED07b]** RLS on `media_assets` by `community_scope` + `data_class` [DAB-SPM].

**[DAB-MED07c]** Signed URLs for private assets — short TTL.

---

## DAB-MED08 — Version History

**[DAB-MED08a]** Documents version linearly; rollback = new version pointing to prior asset.

**[DAB-MED08b]** Stories may snapshot document version at publish time.

---

## AC-114 — Acceptance Criteria

- [x] **[AC-114a]** Media asset and document schemas documented. `[DAB-MED02, MED03]`
- [x] **[AC-114b]** Metadata, OCR, and attachment model defined. `[DAB-MED04–MED06]`
- [x] **[AC-114c]** Permissions and version history established. `[DAB-MED07, MED08]`

---

**Next step:** [2.9 — Configuration Data Model](CONFIGURATION_MODEL.md) [DAB-010]

**End of Volume 2.8.**
