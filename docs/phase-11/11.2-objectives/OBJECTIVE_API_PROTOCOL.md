# Objective API Protocol

**Protocol:** CAE-11.2-W5 · **Contract:** `11.2-w5.1`

The Objective Engine is never called directly. Every consumer uses published API contracts under `/api/v1/objectives`.

## Invariants

- Clients express intent via commands; they do not manipulate persistence models.
- Read APIs expose projections only and never mutate state.
- Every mutation reauthorizes on the server regardless of UI permissions.
- Institution boundaries are enforced on every request.
- AI endpoints are read-only.

## Contract Version

Returned in every response `meta.contract_version`.
