# Build Volume 1.1 — Engineering Doctrine

### Engineering Architecture Bible

**Document ID:** VOLUME-001.1 · **ENG-001**  
**Artifact:** `ENGINEERING_DOCTRINE.md`  
**Status:** Canonical  
**Priority:** Critical

**Volume:** [VOLUME_1_MASTER_SEQUENCE.md](VOLUME_1_MASTER_SEQUENCE.md) · **EAB-001**  
**Extends:** [PHASE-001.8 Implementation Doctrine](../build-steps/PHASE-001.8-IMPLEMENTATION-DOCTRINE.md) [ED-002–ED-FD]  
**Governed by:** [Volume 0](../master/MASTER_ARCHITECTURE_BIBLE.md) [MAB-001]  
**Live spec:** `data/registry/engineering-doctrine.json`

---

## ENG-D01 — Purpose

**[ENG-D01]** The Engineering Doctrine defines **how Burt should build** the Community Operating System from the approved architecture.

**[ENG-D01a]** This document establishes the **technical philosophy, build discipline, quality expectations, and implementation rules** that apply to every future code slice.

**[ENG-D01b]** Burt should never treat this as a simple website build. This is a **modular Community Operating System**.

**[ENG-D01c]** If this document conflicts with PHASE-001.8 on engineering process, **this document wins** for Volume 1+ implementation. If either conflicts with Volume 0 on principles, **Volume 0 wins**.

---

## ENG-D02 — Guiding Principle

**[ENG-D02]**

> **Design first. Build deliberately. Validate every slice. Preserve future expansion.**

**[ENG-D02a]** Aligns with [ED-003] and [MAB-M21 Burt's First Rule].

**[ENG-D02b]** Every slice must be traceable, complete, and validated before the next slice begins.

---

## ENG-D03 — Core Engineering Philosophy

**[ENG-D03]** The platform should be built as:

| Property | Meaning |
|----------|---------|
| **Modular** | Clear domain boundaries · orchestrators · minimal coupling [ED-ME] |
| **SQL-backed** | Database is source of truth · migration-controlled schema |
| **API-driven** | UI consumes services · contracts versioned [ENG-005] |
| **Mobile-first** | Primary experience on phone [ED-MF · MAB principle 12] |
| **Privacy-aware** | Least privilege · consent · visibility levels [TPS-001] |
| **Extensible** | Extension points without premature complexity [ENG-D07] |
| **Testable** | Validation evidence required per slice [ENG-D13] |
| **Documented** | BUILD-LOG · registry · completion report [ENG-D14] |
| **Versionable** | Forward-compatible migrations · semantic releases [ED-VC] |
| **Deployment-ready** | Every complete slice is deployable [ED-SCD] |

**[ENG-D03a]** Every implementation choice should make **future growth easier, not harder** [MAB principle 20].

---

## ENG-D04 — Primary Build Rule

**[ENG-D04]**

> **Nothing should be implemented unless it traces to an approved requirement, architecture document, or explicit operator instruction.**

**[ENG-D04a]** If a feature cannot be traced, it should not be built [TR-MOTTO].

**[ENG-D04b]** Valid trace sources:

1. Requirement ID in `requirements-registry.json`
2. Volume 0–6 or Phase 1–6 canonical document
3. Explicit operator instruction (documented in BUILD-LOG)

**[ENG-D04c]** Before code: read relevant architecture · confirm requirement IDs · confirm dependencies [ENG-D18].

---

## ENG-D05 — Build Method

**[ENG-D05]** Use **vertical slices** [ED-VS · GM-P2].

**[ENG-D05a]** Each slice should include:

| Layer | Deliverable |
|-------|-------------|
| Data model | Schema design aligned with [Volume 2](../master/DATA_ARCHITECTURE_BIBLE.md) |
| Migration | Forward-only SQL in `supabase/migrations/` |
| Service/API layer | Domain orchestrator + route or server action |
| UI | Mobile-first interface consuming service |
| Validation | Gates in [ENG-D13 Testing Doctrine] |
| Tests | Unit + integration minimum |
| Documentation | Completion report [ENG-D14] |
| Completion report | What was built · tests run · next slice |

**[ENG-D05b]** **Avoid half-built horizontal systems** — do not implement all tables, then all APIs, then all UI across the platform.

**[ENG-D05c]** A slice is **not complete** until it works **end to end** and leaves the platform deployable [ED-SCD].

```text
Trace requirement → migration → service → API → UI → validate → document → complete
```

---

## ENG-D06 — Simplicity Rule

**[ENG-D06]** Build the **simplest durable version** first.

**[ENG-D06a]** Do not overbuild Version 1 [GM-V1 · ENG-D06].

**[ENG-D06b]** Do not fake future systems — stub extension points, not imaginary features.

**[ENG-D06c]** Do not hard-code things that are clearly meant to become **configurable** [MAB principle 19 · GOS-M10 Community Genome · CEF-001 templates].

**[ENG-D06d]** Forbidden without requirement ID: speculative microservices · duplicate entity models · unrelated refactors · features not in registry.

---

## ENG-D07 — Expansion Rule

**[ENG-D07]** Every major object should **assume future expansion**.

**[ENG-D07a]** Examples:

- More community types
- More institution types
- More roles
- More maps
- More timelines
- More communication channels
- More AI assistance
- More states later [interstate · GOS-M07]

**[ENG-D07b]** Build for extension **without premature complexity** — UUID IDs · `community_id` scoping · typed relationship tables · API `/v1/` · config keys over literals.

**[ENG-D07c]** Defer abstraction until a **second use case** proves a shared pattern — but always design the hook.

---

## ENG-D08 — Technical Baseline

**[ENG-D08]** Recommended baseline (exact stack finalized in [1.2 System Architecture](SYSTEM_ARCHITECTURE.md) [ENG-002]):

| Layer | Baseline |
|-------|----------|
| Frontend | React · Next.js App Router · TypeScript · Tailwind |
| Database | SQL (Postgres via Supabase) |
| Deployment | Netlify |
| Workflow | GitHub · CI on every merge |
| API | Serverless / route handlers / server actions where appropriate |
| Schema | Migration-controlled |
| Config | Environment variables · no secrets in repo |
| UI | Mobile-first responsive |

**[ENG-D08a]** Architecture should **preserve these assumptions** even if individual tools change.

**[ENG-D08b]** Live stack reference: `data/registry/engineering-architecture-bible.json` · `v1Stack`.

---

## ENG-D09 — Data Doctrine

**[ENG-D09]** The **database is the source of truth** [ED-DB].

**[ENG-D09a]** Data must be:

- **Normalized** where practical
- **Traceable** to requirements and entities [DAB-001]
- **Versioned** when important [ED-VC]
- **Timestamped** (`created_at`, `updated_at`)
- **Auditable** (append-only audit log · domain events [ENG-009])
- **Exportable** (participant data portability [TPS-001])
- **Protected** by permissions and RLS [ENG-D12]

**[ENG-D09b]** No critical platform knowledge should live **only in UI code**.

**[ENG-D09c]** Detail: [1.4 Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004] · [Volume 2](../master/DATA_ARCHITECTURE_BIBLE.md).

---

## ENG-D10 — Service Doctrine

**[ENG-D10]** Business logic belongs in **services**, not scattered through components [ED-ME].

**[ENG-D10a]** Services organized by domain:

| Service | Domain |
|---------|--------|
| Registry | Counties · institutions · places [Phase 2] |
| Participants | Identity · HQ · journey [Phase 3] |
| Communities | COS · command center · teams [Phase 4] |
| Invitations | Invites · connections · PON [Phase 6] |
| Missions | Design · execution · hierarchy [Phase 5] |
| Events | Experiences · scheduling [EEOS-001] |
| Growth | Outreach · readiness · foundry [Phase 6] |
| Knowledge | Brain · graph · search [CKLS · ENG-008] |
| Intelligence | Analytics · AI hooks [Volume 4] |
| Admin | Workbench · governance |

**[ENG-D10b]** UI should **consume services** rather than recreate rules.

**[ENG-D10c]** Each service exposes orchestrators — `getX`, `createX`, `updateX` — single entry points [COS-001 · AOS-001].

**[ENG-D10d]** Detail: [1.7 Domain Service Architecture](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-007].

---

## ENG-D11 — UI Doctrine

**[ENG-D11]** The interface should be [ED-UX · MAB-I]:

- **Mobile-first** — primary flows work on phone [ED-MF]
- **Clear** — progressive disclosure · obvious next action
- **Fast** — skeleton loading · no spinner-only dashboards
- **Accessible** — WCAG 2.1 AA [DG-011]
- **Emotionally welcoming** — [Volume 6](../master/EXPERIENCE_DESIGN_BIBLE.md) [EDB-001]
- **Consistent across domains** — shared design system [Volume 3](../master/USER_EXPERIENCE_BIBLE.md)

**[ENG-D11a]** No feature should invent a **totally separate design language**.

**[ENG-D11b]** Technology should disappear behind the organizing experience [ED-UXa] — participants think about campus, county, network, missions — not software.

---

## ENG-D12 — Security Doctrine

**[ENG-D12]** Security is **not a later phase** [ED-SEC · MAB-L].

**[ENG-D12a]** Every slice should consider:

| Control | Requirement |
|---------|-------------|
| Authentication | Supabase Auth · session validation |
| Authorization | RBAC + community scope + relationship-aware checks |
| Input validation | Zod at API boundary |
| Role boundaries | Least privilege [ED-SECd] |
| Privacy settings | Visibility levels [TPS-001] |
| Audit logs | Who · what · when for sensitive actions |
| Environment secrets | Never in repo |
| Public/private separation | RLS on every tenant table |

**[ENG-D12b]** Youth safety and privacy [DG-004] are non-negotiable from slice one.

**[ENG-D12c]** Detail: [1.6 Authorization Architecture](AUTHORIZATION_ARCHITECTURE.md) [ENG-006].

---

## ENG-D13 — Testing Doctrine

**[ENG-D13]** Every slice should include **validation**. No slice marked complete without **validation evidence**.

**[ENG-D13a]** Minimum gates:

| Gate | Check |
|------|-------|
| Typecheck | `tsc` / build passes |
| Build | `npm run build` succeeds |
| Migration validation | Migration applies cleanly · rollback plan noted |
| API smoke test | Happy path + permission denial |
| UI smoke test | Primary flow renders · mobile viewport |
| Mobile layout review | Touch targets · single-column where required |
| Permission review | RLS + role boundaries verified |
| Documentation update | BUILD-LOG · registry · completion report |

**[ENG-D13b]** Aligns with [MAB-Q Testing Constitution] · [ENG-D06 validation gates].

---

## ENG-D14 — Documentation Doctrine

**[ENG-D14]** Every meaningful implementation should **update documentation** [ED-DF].

**[ENG-D14a]** At minimum, each completion report includes:

- **What was built**
- **Files changed**
- **Requirements satisfied** (IDs)
- **Tests run**
- **Known limitations**
- **Deferred work**
- **Recommended next step**

**[ENG-D14b]** Burt should leave the **next thread smarter than the last**.

**[ENG-D14c]** Update `docs/build-log/BUILD-LOG.md` · `data/build-progress.json` · `data/requirements-registry.json` on every significant slice.

---

## ENG-D15 — AI Doctrine

**[ENG-D15]** AI may assist but must **not silently decide** [MAB principle 10 · CP-010].

**[ENG-D15a]** Future AI systems must be:

- **Explainable** — reasoning + sources on every output
- **Permission-aware** — community-scoped retrieval
- **Human-reviewable** — approval before public actions
- **Grounded** in platform knowledge — RAG over approved objects
- **Clearly separated** from canonical data updates — AI proposes · people commit

**[ENG-D15b]** AI advises. People decide.

**[ENG-D15c]** Detail: [1.13 AI Intelligence Architecture](AI_INTELLIGENCE_ARCHITECTURE.md) [ENG-013] · [Volume 4](../master/AI_INTELLIGENCE_BIBLE.md).

---

## ENG-D16 — Deployment Doctrine

**[ENG-D16]** Deployment should be **boring** [OLB-001 · ENG-014].

**[ENG-D16a]** Every release should have:

- **Clean build** — CI green
- **Migration plan** — forward-only · tested on staging
- **Environment check** — variables verified
- **Smoke test** — critical paths after deploy
- **Rollback awareness** — documented revert path
- **Clear release notes** — plain language for communities

**[ENG-D16b]** No hidden manual steps unless **documented** in runbook.

**[ENG-D16c]** Environments: `local` · `preview` · `staging` · `production`.

---

## ENG-D17 — Engineering Motto

**[ENG-D17]**

> **Build small enough to validate, strong enough to scale.**

**[ENG-D17a]** Same spirit as [ED-SCD] small complete deliverables · [GOS-001] 2 → 20,000 without redesign.

---

## ENG-D18 — Burt Implementation Instructions

**[ENG-D18]** Before each slice, Burt should:

| Step | Action |
|------|--------|
| 1 | Read the relevant architecture document (Volume 0–6 · Phase doc · Volume 1 step) |
| 2 | Identify requirement IDs in `requirements-registry.json` |
| 3 | Confirm dependencies and volume step order |
| 4 | Implement the **smallest complete vertical slice** [ENG-D05] |
| 5 | Run validation [ENG-D13] |
| 6 | Document results [ENG-D14] |
| 7 | Recommend the next slice |

**[ENG-D18a]** Also apply [MAB-M21]: Constitution alignment · relationships · five-year test · simplification test.

**[ENG-D18b]** If design is missing — **pause** and request design step [ED-GR]. Do not invent architecture under pressure.

---

## Volume Cross-References

| Volume | Doctrine requires |
|--------|-------------------|
| Volume 2 | Entity catalog authoritative for schema · follow 1.4 |
| Volume 3 | Wireframes and navigation before UI code |
| Volume 4 | AI advisory-only · human approval mandatory |
| Volume 5 | Launch and ops runbooks for go-live slices |
| Volume 6 | Emotional design informs copy and flow |

---

## AC-083 — Acceptance Criteria

Volume 1.1 is complete when:

- [x] **[AC-083a]** Engineering principles are documented. `[ENG-D02, ENG-D03]`
- [x] **[AC-083b]** Vertical-slice build method is established. `[ENG-D05]`
- [x] **[AC-083c]** Data, service, UI, security, testing, and deployment doctrines are defined. `[ENG-D09–D13, ENG-D16]`
- [x] **[AC-083d]** Burt has clear rules for how to implement every future feature. `[ENG-D04, ENG-D18]`
- [x] **[AC-083e]** Live registry and master sequence wired. `[engineering-doctrine.json]`

---

**Next step:** [1.2 — System Architecture](SYSTEM_ARCHITECTURE.md) [ENG-002]

**End of Volume 1.1 — Engineering Doctrine.**
