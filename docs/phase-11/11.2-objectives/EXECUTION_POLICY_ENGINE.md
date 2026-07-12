# Execution Policy Engine

**Protocol:** CAE-11.2-W3 · **Source:** `services/domain-registry.ts`

Central policies: no orphan tasks, no active mission without objective, no archived parent with active children, draft→approved requires proposed, no service identity mutations.

Policy lives in Domain Layer only — never duplicated in UI.
