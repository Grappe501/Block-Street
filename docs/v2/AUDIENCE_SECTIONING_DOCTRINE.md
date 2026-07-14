# Audience Sectioning Doctrine

**Accepted:** 2026-07-14  
**Intent:** People should only see what pertains to them. Avoid overwhelming anyone as Field Plan and V2 lanes land.  
**Posture:** Additive overlays · progressive disclosure · same H: project root.

## Audience bands

| Band | Who | Default surfaces | Must not dump |
|------|-----|------------------|---------------|
| **Participant** | Invitees, students, young adults | `/invite`, `/choose-place`, `/network`, `/s/{slug}`, their place hub, `/july-14` when linked | Admin doctrine, LocalBrain APIs, Build Control, full OS maps |
| **Campus / Field Lead** | Social / voter reg / outreach leads | Participant surfaces + role kits + upcoming Field Plan packet | Platform engineering tabs, certification matrices |
| **Operator / Director** | Steve + delegated admins | Operator Command (V2-A), invites, participants, growth | Raw phase ledgers as primary UX |
| **Architect / Cert** | Ernie + review board | `docs/v1-certification/*`, Assurance Dashboard (V2-F) | Participant marketing copy as “done” proof |

## Progressive disclosure rules

1. **One job per first viewport** for participant pages (already: agenda-first on `/july-14`).
2. **Doctrine lives in docs / Architecture Library** — never as the default landing after invite.
3. **Field Plan packets** (when added) ship as a dedicated band under `/field` or equivalent — additive route tree — not bolted into every hub.
4. **LaunchChrome / middleware** continue to hide map/browse noise after place lock for participants.
5. **Admin remains invite/role gated** — never linked from participant next-actions unless explicitly operator.

## Field Plan placeholder (upcoming)

When Field Plan content lands:

- Store canon under `docs/field-plan/` and `data/field-plan/` on **H:\Block-Street**
- Participant-visible slices only via curated pages (role cards, next actions)
- Full field doctrine for leads/operators separately
- Register any new human journeys in [`PRODUCT_CERTIFICATION_REGISTRY.md`](../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md)

## Storage

Project truth remains `H:\Block-Street`. Cursor IDE canvases on `C:\` are not sources of record.
