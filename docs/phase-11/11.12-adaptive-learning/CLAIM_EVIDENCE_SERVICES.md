# Claim and Evidence Services

**Protocol:** CAE-11.12-W3

## Commands

- `CreateKnowledgeClaim` — draft claim on artifact
- `RegisterKnowledgeSource` — source registry
- `AttachCitation` — links claim, source, artifact
- `AttachEvidenceReference` — binds external evidence
- `RetractKnowledgeClaim` — lawful retraction path

## Rules

- Claims cannot exceed parent artifact lifecycle (`childExceedsParent`)
- Validated claims require evidence path (KNW-V-013/014)
- Citations must reference existing claim and artifact

## Services

`KnowledgeClaimLifecycleService`, `KnowledgeClaimEvidenceService`, `KnowledgeCitationService`, `KnowledgeSourceRegistryService`
