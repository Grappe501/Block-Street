# Communications Domain Services Protocol

**Build:** 11.7 · **Protocol:** W3 · **Protocol ID:** CAE-11.7-W3 · **System ID:** COM-SVC-001

> **Recovery note:** This protocol was labeled **CAE-11.4-W3** in the recovery blob. The repository registers Communications at **Build 11.7** (COM-002). See [BUILD_NUMBER_RECONCILIATION.md](../BUILD_NUMBER_RECONCILIATION.md).

**Governed by:** [01_CONSTITUTION.md](01_CONSTITUTION.md) · [02_CANONICAL_MODEL_PROTOCOL.md](02_CANONICAL_MODEL_PROTOCOL.md) · [PROTOCOL_ARCHITECTURE.md](../PROTOCOL_ARCHITECTURE.md)

---

## Mission

Transform the canonical communication model into a living communications engine. W2 defined what communication objects are; W3 defines how they behave.

## Constitutional doctrine

Communication is governed, not edited. Humans request actions; the Domain Layer determines lawfulness.

## Sole mutation path

`CommunicationsDomainService.execute()` — `src/lib/civic-action/builds/11.7/services/communications-engine.ts`

No UI, API, automation, AI, or script may bypass this engine.

## Engine scope

Conversation → Thread → Message → Decision → Meeting → Document → Action Item → Knowledge → AI Summary

## Typed commands (12)

```text
CreateConversation
CreateThread
PostMessage
EditMessage
RecordDecision
CreateMeeting
PublishAnnouncement
CreateDocument
ArchiveConversation
GenerateAISummary
CreateActionItem
ResolveThread
```

## Core responsibilities

Lifecycle, ownership, permission, visibility, moderation, parent-child validation, traceability, events, versions, audit, notifications (via events), mission sync queue (11.3 stub).

## AI boundary

- Service/AI identities cannot perform direct mutations.
- `GenerateAISummary` requires a verified Human actor with `request_source: ai_suggestion`.
- AI summaries never impersonate Human message authors.

## Validation pipeline stages

1. Identity and authority
2. Invitation / participation
3. Institution context
4. Permission
5. Visibility
6. Moderation
7. Relationships
8. Business rules

## Related documentation

See companion docs in this directory for engine-specific reference (conversation, message, decision, meeting, document, knowledge, policy, state machines, validation, certification).
