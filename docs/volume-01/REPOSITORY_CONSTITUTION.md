# Repository Constitution

**Document ID:** RCN-001  
**Artifact:** `REPOSITORY_CONSTITUTION.md`  
**Status:** Canonical  
**Priority:** Critical  
**Companion to:** [Canonical Repository Architecture](CANONICAL_REPOSITORY_ARCHITECTURE.md) [ENG-003]

**Live spec:** `data/registry/repository-constitution.json`

> Every pull request, code review, and automated AI build validates against this constitution.

---

## RCN-M01 — Purpose

**[RCN-M01]** The Repository Constitution is the **quality gate** that keeps the codebase organized for years.

**[RCN-M01a]** Without it, folder structures evolve organically and navigation becomes impossible — the failure mode Volume 1.3 exists to prevent.

---

## RCN-M02 — Constitutional Rules

Every change must satisfy **all applicable rules**:

| # | Rule | Validation |
|---|------|------------|
| **RCN-01** | Every **new domain** must have a `README.md` | PR checklist |
| **RCN-02** | Every **service** must include tests (unit minimum) | CI gate |
| **RCN-03** | Every **public API** must have a contract (Zod + types) | ENG-005 |
| **RCN-04** | Every **database change** must have a migration | No manual prod DDL |
| **RCN-05** | Every **configuration change** stays outside business logic | No magic strings in services |
| **RCN-06** | Every **new module** must document its dependencies in README | PR review |
| **RCN-07** | Every domain exposes only **approved public interfaces** (`contracts/`) | No deep imports |
| **RCN-08** | No **miscellaneous** or `utils/orphan/` folders | ENG-RA14 |
| **RCN-09** | **Dependency direction** Apps → API → Services → Database only | Lint / review |
| **RCN-10** | **Requirement ID** in commit message for production features | TR-MOTTO |
| **RCN-11** | **BUILD-LOG** entry for significant capabilities | ENG-D14 |
| **RCN-12** | **No secrets** in repository | Pre-commit / scan |
| **RCN-13** | **Mobile-first** review for user-facing UI changes | ENG-D13 |
| **RCN-14** | **RLS policies** for new tenant-scoped tables | Security review |

---

## RCN-M03 — Pull Request Checklist

Before merge:

- [ ] Traces to requirement ID or explicit operator instruction
- [ ] Domain folder follows standard template [ENG-RA05]
- [ ] README updated if new domain or public interface changed
- [ ] Tests added or waiver documented with requirement ID
- [ ] Migration included if schema changed
- [ ] No business logic in React components [ENG-D10]
- [ ] Repository Constitution rules reviewed
- [ ] BUILD-LOG updated if significant

---

## RCN-M04 — AI Build Validation

**[RCN-M04]** Cursor / AI assistants must:

1. Read [Engineering Doctrine](ENGINEERING_DOCTRINE.md) + relevant Volume 1 step before coding
2. Place files in **canonical paths** per [ENG-RA13] transitional map
3. Never create untraceable features
4. Never skip migration + test for data changes
5. Run `npm run build` before marking slice complete

---

## RCN-M05 — Violations

**[RCN-M05a]** **Minor:** Fix before merge (naming, missing README).

**[RCN-M05b]** **Major:** Block merge (wrong dependency direction, secrets, no migration, untraceable feature).

**[RCN-M05c]** **Structural:** Requires architecture revision before proceeding (new top-level folder without ENG approval).

---

## AC-086 — Acceptance Criteria

- [x] **[AC-086a]** Constitutional rules documented. `[RCN-M02]`
- [x] **[AC-086b]** PR checklist established. `[RCN-M03]`
- [x] **[AC-086c]** AI build validation rules specified. `[RCN-M04]`

---

**End of Repository Constitution.**
