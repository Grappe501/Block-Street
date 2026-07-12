# Identity Lineage Standard

Immutable chain:

```
Founding Human → Sponsor → Invitation → Human → Institution Membership → Future Invitations
```

## Rules

- Accepted invitation lineage is append-only
- Corrections use new audit events, never in-place overwrites
- Legacy humans receive transparent migration lineage without fabricated invitations

## Audit events

See `recordWave1Audit()` event types in `src/lib/identity-trust/wave1/lineage.ts`.

Admin tools: `/api/admin/identity/lineage`, invite tree in identity overview.

Flag: `IDENTITY_LINEAGE_AUDIT_ENABLED`
