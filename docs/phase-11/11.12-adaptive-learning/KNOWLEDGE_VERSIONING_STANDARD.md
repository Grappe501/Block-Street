# Knowledge Versioning Standard

**Protocol:** CAE-11.12-W2

## Principle

Every change creates a version record. History is permanent. Nothing is overwritten.

## Version triggers

`body_changed`, `claim_changed`, `owner_changed`, `lifecycle_changed`, `evidence_changed`, `competency_changed`, `course_content_changed`, `certification_requirement_changed`, `translation_changed`, `relationship_changed`

## Immutable stores

- `knowledge_versions`
- `knowledge_version_audit`
- `knowledge_history_events`

## Completion binding

`LearningCompletion` records `bound_course_version` and `bound_artifact_version` at completion time.

Implementation: `src/lib/civic-action/builds/11.12/versioning.ts`
