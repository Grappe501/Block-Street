# Communication Validation Pipeline

**Protocol:** CAE-11.7-W3

Implementation: `src/lib/civic-action/builds/11.7/services/validation-pipeline.ts`

Stages: identity/authority → invitation → institution → permission → visibility → moderation → relationships → business rules.

Every mutation command calls `runValidationPipeline()` before persistence.

See [03_DOMAIN_SERVICES_PROTOCOL.md](03_DOMAIN_SERVICES_PROTOCOL.md).
