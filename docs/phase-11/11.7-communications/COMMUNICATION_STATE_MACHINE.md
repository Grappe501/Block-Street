# Communication State Machine

**Protocol:** CAE-11.7-W3

Implementation: `src/lib/civic-action/builds/11.7/state-machines.ts`

| Entity | States |
|--------|--------|
| Conversation | draft, open, active, resolved, archived |
| Decision | draft, proposed, approved, historical |
| Document | draft, review, published, archived |
| Meeting | draft, scheduled, in_progress, completed, cancelled, archived |

See [03_DOMAIN_SERVICES_PROTOCOL.md](03_DOMAIN_SERVICES_PROTOCOL.md).
