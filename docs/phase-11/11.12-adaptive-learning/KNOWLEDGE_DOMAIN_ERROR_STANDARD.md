# Knowledge Domain Error Standard

**Protocol:** CAE-11.12-W3

## Error class

`KnowledgeDomainError` in `services/errors.ts` with structured `toValidationError()` output.

## Core codes

| Code | Meaning |
|------|---------|
| `KNOWLEDGE_VERSION_CONFLICT` | Stale `expected_version_optional` |
| `KNOWLEDGE_EVIDENCE_REQUIRED` | Claim/evidence gate failed |
| `KNOWLEDGE_PUBLICATION_BLOCKED` | Artifact not validated |
| `KNOWLEDGE_APPROVAL_REQUIRED` | Publish without approval |
| `KNOWLEDGE_IMMUTABLE_PUBLISHED` | In-place edit of published artifact |
| `CERTIFICATION_REQUIREMENTS_UNMET` | Award without requirements |
| `AI_SUGGESTION_REQUIRES_HUMAN_REVIEW` | AI truth boundary |
| `KNOWLEDGE_DIRECT_MUTATION_FORBIDDEN` | Bypass of domain engine |
| `KNOWLEDGE_SERVICE_IDENTITY_FORBIDDEN` | Service/AI direct mutation |
| `TRANSLATION_STALE_SOURCE` | Source artifact version changed |

## Response shape

Failed commands return `success: false` with `validation_errors[]` containing `code`, `human_message`, `technical_reason`, `suggested_action`, and `blocking_requirement`.
