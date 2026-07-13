# Knowledge Artifact Model

**Protocol:** CAE-11.12-W2

## KnowledgeArtifactRecord

Every published institutional knowledge unit. Belongs to exactly one `KnowledgeCollection` and `KnowledgeDomain`.

### Required fields

- `canonical_id`, `institution_id`, `collection_id`, `domain_id`
- `artifact_type`, `body`, `summary`, `language`
- `lifecycle_state` (seven-state artifact lifecycle)
- `evidence_status`, `confidence_level`, `content_origin`, `is_ai_generated`

### Lifecycle

`draft → review → validated → published → operational → historical → archived`

### Versioning

Every mutation creates `KnowledgeVersionRecord` (immutable). Published artifacts reference `published_version_id`.

See `KNOWLEDGE_VERSIONING_STANDARD.md`.
