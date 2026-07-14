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
Field Lead
    ↓
County Command
    ↓
Regional Command
    ↓
State Command
    ↓
Operator
    ↓
Architect
```

| Band | Who | Default surfaces | Must not dump |
|------|-----|------------------|---------------|
| **Participant** | Invitees, students, 16–24 members | `/invite`, `/choose-place`, `/network`, `/s/{slug}`, place hub, `/july-14` when linked | Doctrine, Build Control, LocalBrain APIs, full OS maps |
| **Field Lead** | Campus role leads (social, voter reg, events, outreach) | Participant + role kits + Field Plan packet | Engineering tabs, full certification matrices |
| **County Command** | County organizers / hub owners | County hub ops, county roster, outreach gaps for that county | Statewide admin doctrine dump |
| **Regional Command** | Multi-county / region coordinators | Regional rollups, attention queues | Product architecture libraries |
| **State Command** | Statewide organizing leads | Statewide map/network health, invite chain status | Raw wave APIs |
| **Operator** | Steve + delegated directors | **Operator Command (V2-A)** — truth, health, next actions | Participant marketing as “certified” |
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

- [`FEATURE_DISCOVERY_REGISTRY.md`](./FEATURE_DISCOVERY_REGISTRY.md)
- [`../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md`](../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md)
- [`V2_A_OPERATOR_COMMAND.md`](./V2_A_OPERATOR_COMMAND.md)
