# Knowledge Lifecycle Engine

**Protocol:** CAE-11.12-W3 · **Engine:** `knowledge-engine.ts`

## Artifact lifecycle

`draft → review → validated → published → operational → historical → archived`

Illegal shortcuts (e.g. `draft → published`) raise `KNOWLEDGE_TRANSITION_NOT_ALLOWED`.

## Publication gates

1. `SubmitKnowledgeArtifactForReview`
2. `CompleteKnowledgeReview`
3. `ValidateKnowledgeArtifact`
4. `ApproveKnowledgeArtifact` (creates approval record)
5. `PublishKnowledgeArtifact` (requires approval + validated state)

## Immutability

Published artifacts cannot be edited in place. Corrections use `ReportKnowledgeCorrection` or supersede flow.

## Versioning

Every mutation bumps `current_version` and appends `KnowledgeVersionRecord` via `createKnowledgeVersion`.

## Course lifecycle

`draft → review → published → active → retired → archived`. `PublishCourseVersion` pins `published_version`.

## Completion binding

`CompleteLearningTarget` sets `bound_course_version` and `bound_artifact_version` on `LearningCompletionRecord`.
