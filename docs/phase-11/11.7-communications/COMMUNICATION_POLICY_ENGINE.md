# Communication Policy Engine

**Protocol:** CAE-11.7-W3

Implementation: `src/lib/civic-action/builds/11.7/services/policy.ts`

Resolves authority via `resolveCommunicationAuthority()`. Rejects service/AI direct mutations. `GenerateAISummary` requires Human actor with `request_source: ai_suggestion`.

Policies: `COMMUNICATION_POLICIES` in `domain-registry.ts`.

See [03_DOMAIN_SERVICES_PROTOCOL.md](03_DOMAIN_SERVICES_PROTOCOL.md).
