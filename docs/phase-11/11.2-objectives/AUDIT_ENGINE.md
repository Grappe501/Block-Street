# Audit Engine

**Protocol:** CAE-11.2-W3 · **Implementation:** `services/version-audit.ts`

Every mutation records immutable `ExecutionAuditEntry`: who, what, when, where, previous/new state, reason, authority, request source.

Stored in `execution_audit_entries` slice.
