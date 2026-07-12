# Existing Human Reconciliation

Existing users are inventoried and mapped to canonical Human records without fabricating invitation history.

## Classifications

`founding_identity_candidate`, `known_human_sponsor_available`, `existing_human_sponsor_unknown`, `service_account`, `test_account`, `duplicate_account`, etc.

## Process

1. Create Human record with `hum_*` Global Human ID
2. Assign public human name
3. Attach authentication identities
4. Record legacy-origin lineage (`legacy-reconciled`)
5. Mark unresolved for Wave 2 verification

Implementation: `reconcileLegacyHumans()` in `src/lib/identity-trust/wave1/reconciliation.ts`

After Wave 1 activation, **all new humans** must enter through invitations.
