# Block Street

**Arkansas youth & student organizing platform**

> Give Arkansas college students and young adults one shared organizing home — where every campus builds its own voice, every county welcomes those not in school, and student energy becomes civic power.

## Guiding Principle

**Student-led. Campus-rooted. County-connected. Statewide-connected. Nonpartisan by design.**

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Database | Netlify DB (Postgres) |
| Hosting | Netlify |
| Source | GitHub |
| File system | **H: drive only** — no writes to C: |

## Repository Structure

Canonical layout: [docs/volume-01/CANONICAL_REPOSITORY_ARCHITECTURE.md](docs/volume-01/CANONICAL_REPOSITORY_ARCHITECTURE.md) [ENG-003]

**V1 transitional (this repo):**

```
docs/           Architecture, phases, volumes, build log (markdown)
data/           JSON registries & seeds (→ database/ + config/)
src/            Next.js apps (→ apps/ + services/)
public/         Static assets
```

**GitHub:** https://github.com/Grappe501/Block-Street · **Live:** https://block-street.netlify.app/

## Build Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | Mission + Structure | In progress |
| 2 | Data Model | Pending |
| 3 | Public Website | Pending |
| 4 | Signup + Personal Network Board | Pending |
| 5 | Admin + Campus/County Dashboards | Pending |
| 6 | Launch Hardening | Pending |

## Admin Dashboard

Visit `/admin` on the live site for the Director Workbench — tabs for mission, phases, build log, architecture, deployment, and version roadmap. Updated with every commit.

## Development

```bash
# All commands run from H:\Block-Street
npm install
npm run dev
```

## Deployment

Push to GitHub → Netlify auto-deploys from main branch.

## Documentation Index

See [docs/00-INDEX.md](docs/00-INDEX.md) for the full documentation map.
