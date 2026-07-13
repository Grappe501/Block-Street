# Conversation Engine

**Protocol:** CAE-11.7-W3

Implementation: `communications-engine.ts` — `CreateConversation`, `ArchiveConversation`.

Lifecycle: Draft → Open → Active → Resolved → Archived. Illegal shortcut: Draft → Archived.

State machine: `src/lib/civic-action/builds/11.7/state-machines.ts`

See [03_DOMAIN_SERVICES_PROTOCOL.md](03_DOMAIN_SERVICES_PROTOCOL.md).
