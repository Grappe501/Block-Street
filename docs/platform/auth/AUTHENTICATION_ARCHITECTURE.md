# Authentication Architecture

**System ID:** AUTH-001 · **Build:** 8.1

## Governing Principle

> Identity is permanent enough to establish continuity, but access is always contextual, limited, revocable, and auditable.

## Five Layers

1. **Person** — human or service actor
2. **Authentication Method** — how identity is proven (OAuth, password, passwordless, passkey)
3. **Canonical User Identity** — durable `PlatformUser` record
4. **Membership** — organization and workspace relationships
5. **Access Policy** — contextual roles and permissions (Builds 8.2, 8.8)

## Request Flow

```text
Incoming Request
  → Validate Session
  → Resolve User
  → Check Account State
  → Resolve Active Context (org + workspace)
  → Resolve Membership
  → Evaluate Role / Permissions
  → Check Authentication Strength (IAL / MFA)
  → Allow or Deny
  → Audit Event (if required)
```

## Route Categories

| Category | Requirement |
|----------|-------------|
| Public | No authentication |
| Authenticated | Valid active session |
| Membership Required | Active org/workspace membership |
| Role Restricted | Specific role in context |
| High Assurance | MFA or IAL-3+ |
| Administrative | Scoped admin authority |

## Separation of Concerns

- **Authentication** answers: Who is attempting to enter?
- **Identity** answers: Who is this person across the platform?
- **Authorization** answers: What may they do in this context?

Roles are never permanent personal attributes. The same person may be a student, volunteer, organizer, or administrator in different workspaces.

## Implementation

| Component | Path |
|-----------|------|
| Session engine | `src/lib/auth/engine.ts` |
| Context resolution | `src/lib/auth/context.ts` |
| Route protection | `src/middleware.ts` |
| Feature flags | `data/auth/feature_flags.json` |

## Related Documents

- [Canonical Identity Model](./CANONICAL_IDENTITY_MODEL.md)
- [Session Management Policy](./SESSION_MANAGEMENT_POLICY.md)
- [Honor System Migration Plan](./HONOR_SYSTEM_MIGRATION_PLAN.md)
