# System Architecture Overview

## High-Level Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC WEBSITE                        │
│  Home │ Join │ Campus Hubs │ County Hubs │ Council      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                 PARTICIPANT LAYER                        │
│  Profile │ Network Board │ Share Link │ QR Code           │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              ORGANIZING LAYER (v1.1+)                    │
│  Committees │ Events │ Messaging │ Surveys │ Outreach    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                 ADMIN / DIRECTOR LAYER                   │
│  Build Workbench │ Campus Dash │ County Dash │ State     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    DATA LAYER                            │
│  Netlify DB (Postgres) │ GitHub │ Netlify Deploy         │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

| Component | Choice | Notes |
|-----------|--------|-------|
| Framework | Next.js 15 (App Router) | SSR + API routes on Netlify |
| Language | TypeScript | Type-safe data model |
| Styling | Tailwind CSS | Mobile-first |
| Database | Netlify DB (Postgres) | SQL, relational |
| Hosting | Netlify | Auto-deploy from GitHub |
| Source control | GitHub | Commit every step |
| File system | H: drive only | `.npmrc` pins cache/temp to H: |

## URL Structure (Planned)

| Route | Purpose |
|-------|---------|
| `/` | Mission + home |
| `/join` | Signup flow |
| `/campus/[slug]` | Campus hub landing |
| `/county/[slug]` | County hub landing |
| `/council` | Founding leadership council |
| `/s/[slug]` | Personal share/recruit link |
| `/network` | Personal network board (authenticated) |
| `/admin` | Director workbench (build progress) |
| `/admin/campus/[slug]` | Campus admin dashboard |
| `/admin/county/[slug]` | County admin dashboard |

## Deployment Pipeline

```
Developer (H: drive) → git commit → GitHub push → Netlify build → Live site
                              ↓
                    build-progress.json updated
                    BUILD-LOG.md updated
                    Admin dashboard reflects changes
```

## File System Rule

**All project files, npm cache, and temp directories live on H: drive.**

Configured in `.npmrc`:
```
cache=H:\Block-Street\.npm-cache
tmp=H:\Block-Street\.tmp
```

Never write build artifacts or caches to C:.
