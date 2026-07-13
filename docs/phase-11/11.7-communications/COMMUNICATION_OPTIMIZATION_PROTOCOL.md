# Communication Optimization Protocol

**Subsystem:** COM-OPT-001 · **Build:** 11.7-W7

## Constitution

1. All optimizations are **advisory only** — Humans accept, modify, defer, or reject.
2. Optimization must never send messages, publish announcements, approve decisions, or mutate governance.
3. Every recommendation includes `what_changed`, `why`, `evidence`, `confidence`, `expected_benefit`, `potential_risk`, and `who_should_review`.
4. Feedback (`accepted` / `modified` / `deferred` / `rejected` / `already_implemented`) informs future recommendations without domain mutation.
5. Simulations are non-mutating sandboxes.

## Prohibited Actions

See `OPTIMIZATION_PROHIBITED_ACTIONS` in `optimization/contracts.ts`.
