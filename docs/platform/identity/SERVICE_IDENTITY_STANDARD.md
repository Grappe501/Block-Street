# Service Identity Standard

Non-human actors for jobs, deployments, integrations, and monitoring.

## Requirements

- Clearly labeled — never masquerade as humans
- No human profile or invitation privilege
- Narrowly scoped permissions
- Human owner assigned
- Audited, rotatable, revocable

Store: `data/identity-trust/service_identities.json`

Implementation: `src/lib/identity-trust/wave1/service-identity.ts`
