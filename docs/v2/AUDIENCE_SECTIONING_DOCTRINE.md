# Audience Sectioning Doctrine

**Accepted:** 2026-07-14 · **Permanent architectural pillar**  
**Intent:** People should only see what pertains to them.  
**First question for every page, dashboard, workflow, and nav item:**

> **Who is this built for?**  
> Then: What feature is this?

## Audience hierarchy (locked)

```text
Participant
    ↓
Field Lead / Institution Lead / Functional Lead
    ↓
County Volunteer Lead  ·  College Leader
    ↓
Volunteer Manager          ← statewide personnel (grassroots)
    ↓
Campaign Director
    ↓
Operator / Architect (product control — not field chain)
```

Product-review bands remain: Operator · Architect.  
**Field personnel chain** is defined in [`CHAIN_OF_COMMAND_DOCTRINE.md`](./CHAIN_OF_COMMAND_DOCTRINE.md).

| Band | Who | Default surfaces | Must not dump |
|------|-----|------------------|---------------|
| **Participant** | Invitees, students, 16–24 members | `/invite`, `/choose-place`, `/network`, `/s/{slug}`, place hub, `/july-14` when linked | Doctrine, Build Control, LocalBrain APIs, full OS maps |
| **Field Lead** | Campus / function leads | Area Campaign Leader Dashboard `/leader/{id}` + Field Plan packet for that seat only | Other counties, full education ledger, engineering tabs |
| **College Leader** | Education organizing lead under VM | `/admin/college-command` — goal-scope colleges; bonus HS/trade/tech/private | Unrelated county volunteer records |
| **County Volunteer Lead** | County personnel lead under VM | `/admin/counties/{slug}/volunteer-command` — that county only | Other counties, statewide personnel chrome |
| **Volunteer Manager** | Statewide grassroots personnel lead | `/admin/volunteer-command` — people, leadership, counties, education, intake… | Treating Build % as launch proof; paid-staff language |
| **Campaign Director** | Director | Omniview + inspect any subordinate board | Impersonating another user’s session |
| **Operator** | Steve + delegated ops | **Operator Command (V2-A)** — truth, health, next actions | Participant marketing as “certified” |
| **Architect** | Ernie + review board | Certification docs, Feature Discovery, Assurance (V2-F) | Treating Build % as launch proof |

## Progressive disclosure rules

1. **One job per first viewport** for participant pages.
2. **Doctrine → Architecture Library** — never default post-invite landing.
3. **Field Plan** → additive `/field` (or equivalent) tree; curated slices per band.
4. **LaunchChrome / middleware** hide map noise after place lock for participants.
5. **No upward leakage** — participant next-actions never deep-link into Operator/Architect chrome unless the human holds that role.

## Field Plan

Canon: `docs/field-plan/` + `data/field-plan/` on **H:\Block-Street**  
Every field surface declares `audience` in Feature Discovery Registry.

## Related

- [`QUIET_DAILY_LIFE_DOCTRINE.md`](./QUIET_DAILY_LIFE_DOCTRINE.md) — calm volunteer-facing experience; progressive disclosure by growth stage
- [`FEATURE_DISCOVERY_REGISTRY.md`](./FEATURE_DISCOVERY_REGISTRY.md)
- [`../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md`](../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md)
- [`V2_A_OPERATOR_COMMAND.md`](./V2_A_OPERATOR_COMMAND.md)
