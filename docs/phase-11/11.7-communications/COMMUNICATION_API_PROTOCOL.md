# Communication API Protocol

**Requirement family:** CAE-11.7-W5-API-*  
**Contract version:** 11.7-w5.1

## Principles

1. All writes route through W3 `CommunicationCommandEnvelope`.
2. `stripUntrustedIdentityFields` removes client-authoritative identity and lifecycle fields.
3. High-impact actions require `Idempotency-Key`.
4. Queries filter by institution and effective permissions.
5. Structured errors map domain failures to human-blocked responses.

## Lifecycle Actions

| Action slug | Command |
|-------------|---------|
| archive | ArchiveConversation |
| restore | ArchiveConversation (target_status: open) |
| resolve-thread | ResolveThread |
| record-decision | RecordDecision |
| publish-announcement | PublishAnnouncement |

## Context Resolution

`resolveCommunicationApiContext` resolves actor, institution, membership, locale, timezone, and permissions from gateway context — never from untrusted body fields.
