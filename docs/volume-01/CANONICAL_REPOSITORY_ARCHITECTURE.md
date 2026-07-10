# Build Volume 1.3 — Canonical Repository Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.3 · **ENG-003**  
**Artifact:** `CANONICAL_REPOSITORY_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Repository Constitution](REPOSITORY_CONSTITUTION.md) [RCN-001]  
**Builds on:** [1.2 System Architecture](SYSTEM_ARCHITECTURE.md) [ENG-002]  
**Volume sequence:** [VOLUME_1_MASTER_SEQUENCE.md](VOLUME_1_MASTER_SEQUENCE.md) · **EAB-001**  
**Live spec:** `data/registry/canonical-repository-architecture.json`

---

## ENG-RA01 — Purpose

**[ENG-RA01]** The Canonical Repository Architecture defines how the Community Operating System is **physically organized** within source control.

**[ENG-RA01a]** Every directory communicates **purpose**. Every file has a **logical home**. Future developers should **never guess** where something belongs.

**[ENG-RA01b]** This is the **permanent blueprint** for every directory, every module, and every future subsystem.

---

## ENG-RA02 — Guiding Principle

**[ENG-RA02]**

> **Repository organization should mirror system architecture.**

**[ENG-RA02a]** Folders represent **domains** — not programming languages [ENG-SA-L4 Domain Services].

**[ENG-RA02b]** A new developer should understand the system by **browsing folders alone**.

---

## ENG-RA03 — Repository Philosophy

**[ENG-RA03]** The repository should be:

| Property | Meaning |
|----------|---------|
| Easy to navigate | Predictable paths · README in every major folder |
| Predictable | Same internal structure per domain |
| Domain-driven | `services/community/` not `src/utils/communityStuff` |
| Scalable | New domains as new folders — not edits to monolith misc |
| Modular | Clear boundaries · dependency rule enforced |
| Discoverable | Search-friendly names · no abbreviations |
| Consistent | Domain template repeated everywhere |
| Self-documenting | README + architecture cross-refs |

---

## ENG-RA04 — Top-Level Repository

**[ENG-RA04]** Canonical product root (logical name):

```text
/community-operating-system
```

**[ENG-RA04a]** **Current GitHub repository:** [`Block-Street`](https://github.com/Grappe501/Block-Street) — retains name until formal rename; **logical architecture** follows canonical layout below.

**[ENG-RA04b]** Major top-level folders:

```text
docs/
apps/
packages/
services/
database/
api/
shared/
public/
infrastructure/
scripts/
tests/
tools/
config/
data/              ← transitional (V1 JSON registries → migrate to database/ + config/)
src/               ← transitional (V1 Next.js monolith → migrate to apps/ + services/)
```

Each folder has a **permanent responsibility**. Nothing belongs in root except project manifests (`package.json`, `README.md`, license, CI config).

---

## docs/ [ENG-RA-DOC]

**Purpose:** Documentation only. **No implementation code.**

```text
docs/
  architecture/          Volume 0 · living systems · master sequences
  engineering/           Volume 1 · factory layer (volume-01/)
  constitution/          Phase 1 · BUILD-BIBLE · principles
  domains/               Phase 2–6 domain docs (phase-02/ … phase-06/)
  api/                   API contracts (future OpenAPI)
  database/              Schema docs · ERD · migration notes
  deployment/            Netlify · env · release
  ux/                    Volume 3 · Volume 6
  security/              TPS · auth · privacy
  operations/            Volume 5 · runbooks
  research/              Exploratory · not canonical
  standards/             Naming · traceability · conventions
  roadmaps/              Future planning
  meeting-notes/         Process (non-canonical)
  release-notes/         Per-release changelog
  build-log/             BUILD-LOG.md chronicle
  build-steps/           Phase 1 steps
  master/                Volume 0 · Volumes index · umbrella bibles
  volume-01/             Volume 1 step artifacts
```

**Current mapping:** `docs/` exists today — align subfolders incrementally; `docs/volume-01/`, `docs/master/`, `docs/phase-*/` already conform.

---

## apps/ [ENG-RA-APP]

**Purpose:** User-facing applications. Every app **consumes shared services** — no embedded business rules.

```text
apps/
  public-web/            Public site · explorer · join
  participant/           Personal HQ · command center
  community/             Community command center
  admin/                 Director workbench
  mobile/                Future native shell
  kiosk/                 Future event check-in
  volunteer/             Volunteer passport flows
  event-operations/      Experience HQ
  analytics/             Future dashboards
```

**V1 transitional mapping:**

| Canonical | Current (`Block-Street`) |
|-----------|--------------------------|
| `apps/public-web/` | `src/app/(site)/` |
| `apps/admin/` | `src/app/admin/` |
| Presentation components | `src/components/` (non-admin) |

**Evolution:** Extract from `src/app/` when second app justifies split — until then, **logical boundaries** in folder comments and imports.

---

## packages/ [ENG-RA-PKG]

**Purpose:** Shared reusable libraries.

```text
packages/
  ui/                    Design system · primitives
  design-system/         Tokens · typography · spacing
  maps/                  Map layers · Arkansas registry
  calendar/              TSOS helpers
  forms/                 Validated form patterns
  permissions/           RBAC helpers
  notifications/         Template rendering
  search/                Query builders
  knowledge/             Graph client helpers
  graph/                 CKG interface types
  utilities/             Pure helpers
```

**V1 transitional mapping:** `src/components/ui/` (future) · shared Tailwind config · extract when **Shared Code Rule** triggers (3+ domains).

---

## services/ [ENG-RA-SVC]

**Purpose:** **Business logic.** Each service owns **one domain** [ENG-SA-L4].

```text
services/
  identity/
  participants/
  communities/
  registry/
  missions/
  projects/
  events/
  growth/
  leadership/
  capacity/
  partnerships/
  knowledge/
  stories/
  legacy/
  communication/
  notifications/
  search/
  intelligence/
  analytics/
  kernel/                Platform Kernel [ENG-SA04]
```

**V1 transitional mapping:** `src/lib/{domain}/` → future `services/{domain}/` with internal template:

```text
services/community/
  controllers/           Route handlers · server actions entry
  service/               Orchestrators (business logic)
  repository/            Data access only
  validation/            Zod schemas
  contracts/             Public TypeScript interfaces
  events/                Domain event emitters
  tests/
  documentation/
  README.md
```

**Current:** Create `src/lib/kernel/` · `src/lib/registry/` as first domain extractions.

---

## database/ [ENG-RA-DB]

**Purpose:** Everything database. **Nothing else belongs here.**

```text
database/
  schema/                Current DDL reference
  migrations/            Forward-only SQL (Supabase)
  seeds/                 County · institution · dev fixtures
  views/                 Reporting views
  functions/             Postgres functions
  indexes/               Index documentation
  backups/               Backup procedures (docs)
  development/           Local dev setup
  documentation/
```

**V1 transitional mapping:** `data/registry/*.json` → seed source until Postgres connected · migrations in `supabase/migrations/` (create when DB connects) · `data/` deprecated over time per [RCN-001 Migration Rule].

---

## api/ [ENG-RA-API]

**Purpose:** External API surface.

```text
api/
  v1/
    identity/
    communities/
    missions/
    events/
    growth/
    stories/
    search/
    knowledge/
    admin/
    system/
```

**V1 transitional mapping:** `src/app/api/v1/` (create per [ENG-005]) · server actions remain internal until public API needed.

---

## shared/ [ENG-RA-SHR]

**Purpose:** Cross-cutting utilities. **Shared means shared.**

```text
shared/
  types/                 Global TypeScript types
  constants/             App-wide constants
  validators/            Shared Zod primitives
  permissions/           Permission check helpers
  errors/                Error envelope · codes
  configuration/         Config loaders
  logging/               Structured log helpers
  security/              Crypto · sanitization helpers
```

**V1 transitional mapping:** `src/lib/data.ts` · shared types file → split into `shared/types/` over time.

---

## public/ [ENG-RA-PUB]

**Purpose:** Public static assets. **No business logic.**

```text
public/
  images/
  icons/
  logos/
  videos/
  documents/
  maps/                  Static map assets
  templates/             Downloadable templates
```

**Current:** `public/` exists — organize subfolders on first asset addition.

---

## infrastructure/ [ENG-RA-INF]

**Purpose:** Deployment. **Infrastructure stays isolated.**

```text
infrastructure/
  hosting/
  netlify/               netlify.toml · redirects · headers
  containers/            Future Docker
  database/              Supabase project config
  monitoring/            Sentry · uptime
  logging/               Log aggregation config
  security/              Secrets template · CSP
  backups/
  automation/            CI workflows
```

**V1 transitional mapping:** `netlify.toml` at root → move to `infrastructure/netlify/` when CI expands · GitHub Actions in `.github/workflows/`.

---

## scripts/ [ENG-RA-SCR]

**Purpose:** Developer automation. **Scripts never contain business rules.**

```text
scripts/
  build/
  validate/              TR-BR · registry lint
  seed/
  deploy/
  reports/
  documentation/
  maintenance/
  quality/
  migration/
```

---

## tests/ [ENG-RA-TST]

**Purpose:** Testing **mirrors implementation.**

```text
tests/
  unit/                  services/*/tests
  integration/           API + DB
  ui/                    Playwright / RTL
  performance/
  security/
  accessibility/
  regression/
  fixtures/
```

**Co-location allowed:** `services/community/tests/` OR mirror under `tests/` — pick one convention per domain, document in README.

---

## tools/ [ENG-RA-TOL]

**Purpose:** Internal utilities.

```text
tools/
  generators/            Domain scaffold generator
  diagnostics/
  analysis/
  migration-tools/
  developer-tools/
```

---

## config/ [ENG-RA-CFG]

**Purpose:** Configuration **replaces hardcoding** [ENG-SA09].

```text
config/
  application/
  communities/
  roles/
  permissions/
  templates/
  notifications/
  maps/
  search/
  ai/
```

**V1 transitional mapping:** `data/*.json` registries → migrate readable config here · secrets remain env vars only.

---

## ENG-RA05 — Domain Organization Rule

**[ENG-RA05]** Every major domain follows the **same internal structure**:

```text
services/{domain}/
  controllers/
  service/
  repository/
  validation/
  contracts/
  events/
  tests/
  documentation/
  README.md
```

**[ENG-RA05a]** Consistency **reduces cognitive load** — Burt copies template for new domains.

---

## ENG-RA06 — Documentation Rule

**[ENG-RA06]** Every major folder includes **`README.md`** describing:

- Purpose
- Responsibilities
- Dependencies
- Public interfaces
- Future expansion

**[ENG-RA06a]** Every directory **explains itself**.

---

## ENG-RA07 — Naming Standards

**[ENG-RA07]**

- **Singular** domain names for services: `community/` · `participant/` · `mission/`
- **Plural** only for collections: `participants/` when folder holds many entity types
- **Avoid abbreviations** unless universal (API, UI, HQ)
- **kebab-case** for multi-word folders · **camelCase** for TypeScript files

---

## ENG-RA08 — Dependency Rule

**[ENG-RA08]** Allowed direction:

```text
Apps
  ↓
API
  ↓
Services
  ↓
Database
```

**[ENG-RA08a]** **Never** reverse: Database must not import Services · Services must not import Apps.

**[ENG-RA08b]** `packages/` and `shared/` are imported **downward** by services and apps — never import app code from packages.

---

## ENG-RA09 — Shared Code Rule

**[ENG-RA09]** If **three or more domains** need the same capability → move to `packages/` or `shared/`.

**[ENG-RA09a]** **Do not duplicate logic.**

---

## ENG-RA10 — Plugin Philosophy

**[ENG-RA10]** Future capabilities appear as **new domains** — not modifications to existing ones:

```text
services/
  civic-academy/
  voting/
  petitions/
  legislation/
  scholarships/
  housing/
```

**[ENG-RA10a]** The repository **naturally expands** without destabilizing core domains.

---

## ENG-RA11 — Versioning Rule

**[ENG-RA11]** Every major architecture document receives:

- Version · Status · Owner · Approval history · Revision history

**[ENG-RA11a]** Registry JSON `version` field required · BUILD-LOG entry on canonical changes.

---

## ENG-RA12 — Repository Health

**[ENG-RA12]** The repository remains:

Predictable · Discoverable · Consistent · Well documented · Modular · Easy to search · Easy to onboard

**[ENG-RA12a]** Enforced by [Repository Constitution](REPOSITORY_CONSTITUTION.md) [RCN-001] on every PR and AI build.

---

## ENG-RA13 — Current Repository Map (Block-Street V1)

**[ENG-RA13]** Transitional layout — **July 2026**:

```text
Block-Street/                    GitHub: Grappe501/Block-Street · Netlify: block-street.netlify.app
├── docs/                        → docs/ (canonical)
├── data/                        → database/seeds + config/ (transitional)
├── src/
│   ├── app/                     → apps/ (public-web + admin)
│   ├── components/              → packages/ui + app presentation
│   └── lib/                     → services/ + shared/
├── public/                      → public/
├── netlify.toml                 → infrastructure/netlify/
├── package.json
└── README.md
```

**[ENG-RA13a]** **Migration discipline:** New code follows **canonical paths inside `src/lib/`** using domain folders · no new root-level misc folders · no `utils/misc/`.

---

## ENG-RA14 — Burt Implementation Guidance

**[ENG-RA14]** Implementation should:

- Create folders **only** when they have a defined responsibility
- Follow **domain boundaries** strictly [ENG-SA06]
- Avoid **"miscellaneous"** directories
- Keep **documentation adjacent** to implementation
- Use **configuration** rather than hardcoded behavior
- Preserve **consistency** across every domain
- Validate every change against [RCN-001 Repository Constitution]

---

## AC-085 — Acceptance Criteria

Volume 1.3 is complete when:

- [x] **[AC-085a]** Top-level repository structure defined. `[ENG-RA04]`
- [x] **[AC-085b]** Domain organization rules established. `[ENG-RA05]`
- [x] **[AC-085c]** Folder responsibilities documented. `[ENG-RA-DOC through CFG]`
- [x] **[AC-085d]** Dependency and shared-code rules specified. `[ENG-RA08, RA09]`
- [x] **[AC-085e]** Repository Constitution companion document created. `[RCN-001]`
- [x] **[AC-085f]** Current Block-Street transitional map documented. `[ENG-RA13]`
- [x] **[AC-085g]** Burt has canonical blueprint for organizing every file. `[canonical-repository-architecture.json]`

---

**Next step:** [1.4 — Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004]

**End of Volume 1.3 — Canonical Repository Architecture.**
