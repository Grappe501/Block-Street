# V1 Certification Matrix (SEED — SUPERSEDED)

> **Superseded by Pass 1 protocol artifacts:**  
> - `V1_CAPABILITY_CERTIFICATION_MATRIX.md`  
> - `data/v1-certification/certification_matrix.json`  
> - `PASS_01_EXECUTIVE_SUMMARY.md`

This early seed used a simpler vocabulary. Do not use it for ship decisions.

---


## Track A — Foundation & production architecture

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| A-001 | Custom session auth (`cos_session`) | ✅ | — | — | — | Partial | `src/lib/auth/*`, middleware |
| A-002 | Password login / register | ✅ | — | — | — | Complete | `(site)/login`, `register` |
| A-003 | Passwordless auth | ✅ | — | — | — | Complete | `(site)/passwordless` |
| A-004 | MFA setup | ✅ | — | — | — | Complete | `(site)/mfa/setup` |
| A-005 | Password reset | ✅ | — | — | — | Complete | forgot-password flows |
| A-006 | API auth engine | ✅ | — | — | — | Partial | Engine present; production threat model → Pass 8 |
| A-007 | Civic-action persistence store | ✅ | — | — | — | Partial | JSON store; scale/backup → Pass 8 |
| A-008 | Phase 11 wave test gates | ✅ | ✅ | — | — | Partial | Protocol gates; not product E2E |
| A-009 | LocalBrain API surface | ✅ | — | ❌ | ❌ | Partial | ~150 routes; no site consumers |
| A-010 | Deploy / rollback story | ⚠️ | — | — | ❌ | Missing | Needs Pass 8 evidence |
| A-011 | Monitoring / alerting | ⚠️ | — | — | ❌ | Missing | Needs Pass 8 evidence |
| A-012 | Build ledger accuracy | ⚠️ | — | — | — | Needs redesign | Header still shows stale 11.6 “current” |

---

## Track B — Identity, LocalBrain, first-run

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| B-001 | Invite-by-token activation | ✅ | — | — | — | Complete | `(site)/invite/[token]` |
| B-002 | Invitation accept flow | ✅ | — | — | — | Complete | `(site)/invitations/accept` |
| B-003 | Sponsor invite | ✅ | — | — | — | Complete | `(site)/identity/sponsor` |
| B-004 | Sent invitations list | ✅ | — | — | — | Complete | identity/invitations |
| B-005 | Cross-institution invitations | ✅ | — | — | — | Partial | Page exists; ops readiness unproven |
| B-006 | Role-based onboarding | ⚠️ | — | ❌ | ❌ | Partial | Thin checklist → `/admin`; docs richer than UX |
| B-007 | Select organization | ❌ | ❌ | ❌ | ❌ | Missing | Middleware mentions; no page |
| B-008 | Select workspace | ❌ | ❌ | ❌ | ❌ | Missing | Middleware mentions; no page |
| B-009 | Join community / join flows | ✅ | — | — | — | Partial | `(site)/join*` |
| B-010 | LocalBrain product page | ❌ | ❌ | ❌ | ❌ | Missing | No `(site)/localbrain` |
| B-011 | LocalBrain React UI | ❌ | ❌ | ❌ | ❌ | Missing | No product components found |
| B-012 | LocalBrain memory (product) | ⚠️ | — | ❌ | ❌ | Missing | API only: `localbrain/memory` |
| B-013 | LocalBrain preferences (product) | ⚠️ | — | ❌ | ❌ | Missing | API only |
| B-014 | LocalBrain timeline (product) | ⚠️ | — | ❌ | ❌ | Missing | API only |
| B-015 | First-run “belonging” moment | ⚠️ | — | ❌ | ❌ | Missing | No coherent ≤10 min proven journey |
| B-016 | Welcome → first success → dashboard | ⚠️ | — | ❌ | ❌ | Partial | Pieces exist; not one certified path |
| B-017 | Invitation → productive ≤10 min | ❌ | ❌ | ❌ | ❌ | Missing | Metric not measured / not wired |

---

## Track C — Executive workspace / daily OS

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| C-001 | Communications Daily Brief | ✅ | — | — | — | Complete | `communications/brief` (COM) |
| C-002 | LocalBrain briefing UX | ❌ | ❌ | ❌ | ❌ | Missing | API `localbrain/briefings` unused by pages |
| C-003 | Executive assistant UX | ❌ | ❌ | ❌ | ❌ | Missing | API only |
| C-004 | Meeting preparation UX | ❌ | ❌ | ❌ | ❌ | Missing | LIX prep API; COM meeting pages separate |
| C-005 | Next actions surface | ❌ | ❌ | ❌ | ❌ | Missing | API only |
| C-006 | Attention / focus UX | ❌ | ❌ | ❌ | ❌ | Missing | W2 protocol only |
| C-007 | Objectives “today” view | ✅ | — | — | — | Complete | initiatives/.../today |
| C-008 | Operations command center | ✅ | — | — | — | Partial | Strong surface; not personal daily OS |
| C-009 | Calendar page / agenda UI | ❌ | ❌ | ❌ | ❌ | Missing | Calendar APIs exist; no page |
| C-010 | Prefer platform over inbox | ❌ | ❌ | ❌ | ❌ | Missing | Pass 3 / Pass 6 must prove |
| C-011 | Decisions / drafts / commitments UX | ⚠️ | — | — | — | Partial | COM decision pages; LIX APIs separate |
| C-012 | Executive identity oversight | ✅ | — | — | — | Partial | identity-focused, not daily OS |

---

## Track D — Collaboration / teams

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| D-001 | Initiative people management | ✅ | — | — | — | Partial | `initiatives/[id]/people` |
| D-002 | Team spaces (named product) | ❌ | ❌ | ❌ | ❌ | Missing | No team-space route |
| D-003 | Join without training | ⚠️ | — | ❌ | ❌ | Partial | Join exists; “no explanation needed” unproven |
| D-004 | Community workspace (geo) | ✅ | — | — | — | Partial | county/school components — not LIX teams |
| D-005 | Shared mission conversation | ✅ | — | — | — | Partial | COM missions conversation page |
| D-006 | LIX conversation product UI | ❌ | ❌ | ❌ | ❌ | Missing | APIs only |
| D-007 | Contribute first task as new member | ⚠️ | — | — | — | Partial | Ops/missions exist; onboarding link weak |

---

## Track E — Knowledge / memory / org intelligence

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| E-001 | Learning knowledge explorer | ✅ | — | — | — | Complete | `learning/knowledge` |
| E-002 | Communications knowledge | ✅ | — | — | — | Complete | `communications/knowledge` |
| E-003 | Knowledge search (product) | ✅ | — | — | — | Partial | COM search; relevance → Pass 2/5 |
| E-004 | Personal LocalBrain memory UX | ❌ | ❌ | ❌ | ❌ | Missing | API only |
| E-005 | Promote personal → org memory | ⚠️ | — | ❌ | ❌ | Missing | `promote-memory` API only |
| E-006 | Knowledge survives leadership change | ⚠️ | — | — | ❌ | Partial | Protocol claim; org proof → Pass 7 |
| E-007 | Research network product UI | ❌ | ❌ | ❌ | ❌ | Missing | W5 APIs only |
| E-008 | Learning ↔ LocalBrain learning APIs | ⚠️ | — | — | — | Needs redesign | Learning UX uses 11.12, not living W7 |

---

## Track F — Missions / ops execution

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| F-001 | Initiatives list / create | ✅ | — | — | — | Complete | `(site)/initiatives` |
| F-002 | Initiative command / manage | ✅ | — | — | — | Partial | Multiple surfaces |
| F-003 | Objectives workspace | ✅ | — | — | — | Complete | objectives pages |
| F-004 | Mission workspace | ✅ | — | — | — | Complete | missions under objectives |
| F-005 | Progress / evidence / reviews | ✅ | — | — | — | Partial | Pages present |
| F-006 | Operations visibility | ✅ | — | — | — | Partial | `operations` page |
| F-007 | LIX organizer daily plan UX | ❌ | ❌ | ❌ | ❌ | Missing | API only |
| F-008 | LIX mission-plan UX | ❌ | ❌ | ❌ | ❌ | Missing | API only |
| F-009 | LIX team-status UX | ❌ | ❌ | ❌ | ❌ | Missing | API only |
| F-010 | Strategy → completed work with visibility | ⚠️ | — | — | — | Partial | Surfaces exist; Pass 3/7 prove end-to-end |

---

## Track G — Communications / engagement

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| G-001 | Communications home | ✅ | — | — | — | Complete | `communications` |
| G-002 | Meeting workspace | ✅ | — | — | — | Complete | meetings/[id] |
| G-003 | Decision workspace | ✅ | — | — | — | Complete | decisions/[id] |
| G-004 | Document workspace | ✅ | — | — | — | Complete | documents/[id] |
| G-005 | Notifications | ✅ | — | — | — | Partial | page exists; dual engines? → Pass 4 |
| G-006 | Communications search | ✅ | — | — | — | Partial | relevance/UX → Pass 2 |
| G-007 | Communications intelligence | ✅ | — | — | — | Partial | page exists |
| G-008 | Meeting memory (LIX) product | ❌ | ❌ | ❌ | ❌ | Missing | W6 APIs unused by LocalBrain UI |
| G-009 | COM vs LIX conversation unification | ⚠️ | — | — | — | Needs redesign | Candidate dual stack for Pass 4 |
| G-010 | Relationship context preserved | ⚠️ | — | — | — | Partial | Claim needs Pass 2/3 journey proof |

---

## Track H — Admin / governance

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| H-001 | Admin director workbench | ✅ | — | — | — | Partial | `admin/page` |
| H-002 | Admin login | ✅ | — | — | — | Complete | admin/login |
| H-003 | Identity admin overview | ✅ | — | — | — | Partial | admin/identity |
| H-004 | Identity audit | ✅ | — | — | — | Partial | audit page |
| H-005 | Identity intelligence | ✅ | — | — | — | Partial | intelligence page |
| H-006 | Ops identity / certification | ✅ | — | — | — | Partial | ops/identity* |
| H-007 | Support identity surface | ✅ | — | — | — | Partial | support/identity |
| H-008 | Full org admin without developers | ⚠️ | — | ❌ | ❌ | Missing | Incomplete institutional console |
| H-009 | LocalBrain admin / observatory UI | ❌ | ❌ | ❌ | ❌ | Missing | Advanced APIs only |
| H-010 | Governance amendments with simulation | ⚠️ | — | ❌ | ❌ | Partial | Kernel/twin protocol; no admin UX |

---

## Track I — Quality / security / hardening

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| I-001 | Auth middleware gating | ✅ | — | — | — | Partial | middleware.ts |
| I-002 | MFA available | ✅ | — | — | — | Partial | Setup page; enforcement policy unclear |
| I-003 | Wave / build certification tests | ✅ | ✅ | — | — | Partial | Protocol bar ≠ product bar |
| I-004 | “Would we run our own org?” | ❌ | ❌ | ❌ | ❌ | Missing | Pass 7 + Pass 8 |
| I-005 | AI graceful failure | ⚠️ | — | — | ❌ | Missing | Needs Pass 8 |
| I-006 | Backup restore proof | ❌ | ❌ | — | ❌ | Missing | Pass 8 |
| I-007 | Security review of ship surface | — | — | — | ❌ | Missing | Schedule Pass 8 / I |

---

## Track J — Beta / adoption / growth

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| J-001 | Launch readiness docs | ✅ | — | — | — | Partial | `docs/platform/launch/` |
| J-002 | Launch readiness script | ✅ | — | — | — | Partial | npm launch readiness (protocol-ish) |
| J-003 | Pilot onboarding product path | ⚠️ | — | ❌ | ❌ | Missing | Docs > certified UX path |
| J-004 | New org succeeds without founders | ❌ | ❌ | ❌ | ❌ | Missing | Pass 7 / Pass 3 proof required |
| J-005 | Training / certification for users | ✅ | — | — | — | Partial | learning + platform training docs |
| J-006 | Support path for pilots | ⚠️ | — | — | ❌ | Partial | support identity page ≠ pilot program |

---

## Living Intelligence protocol inventory (not auto Launch-Ready)

These are **Architecture Complete** as protocol. Product Launch Ready defaults **❌** until wired UX and Pass 6 clear.

| ID | Capability | Built | Works | UX Pass | Launch Ready | Pass 1 | Notes |
|----|------------|-------|-------|---------|--------------|--------|-------|
| LIX-W1 | LocalBrain & memory runtime | ✅ | ✅ | ❌ | ❌ | Partial | Protocol Complete / Product Missing |
| LIX-W2 | Context / attention / focus | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W3 | Executive assistant / briefings | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing (COM brief ≠ LIX) |
| LIX-W4 | Organizer / daily ops AI | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W5 | Research network | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W6 | Conversation intelligence | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W7 | Learning (living) | ✅ | ✅ | ❌ | ❌ | Partial | Duplicates 11.12 learning UX path |
| LIX-W8 | Prediction / scenarios | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W9 | Multi-agent orchestration | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W10 | Human partnership / trust | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W11 | Federation | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W12 | Automation runtime | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W13 | Capability factory | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W14 | Digital twin / sandbox | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W15 | Institutional OS kernel | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |
| LIX-W16 | Genesis / continuity | ✅ | ✅ | ❌ | ❌ | Missing | Product Missing |

---

## Pass 4 watchlist (duplicates / fragmentation)

Confirm in Architecture Audit:

1. Daily brief: COM assembler vs LocalBrain briefings  
2. Conversations / meeting memory: COM vs LIX W6  
3. Learning: 11.12 UX vs living W7 APIs  
4. Search: communications search vs other search stacks  
5. Notifications: communications notifications vs any other engines  
6. Calendars: `api/v1/calendar` vs workspace calendar vs organizer time surfaces  
7. Dashboards: admin / ops / objectives / learning — many “homes”  
8. Permissions: auth engine vs initiative roles vs kernel claims  

---

## Coverage status

| Metric | Value |
|--------|-------|
| Seeded capabilities | ~110 |
| Target | 300–500 |
| Pass 1 status | **In progress** (seed complete) |
| Any Launch Ready `✅` | **None yet** — Works/UX/Launch columns intentionally unset until later passes |

Expansion rule: add capabilities from USER_EXPERIENCE_BIBLE, launch standards, and each Track’s constitution — still capability-level, not every function.
