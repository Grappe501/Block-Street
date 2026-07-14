# Field Plan Depth Layers (L0 → L4)

**Status:** L0–L1 present · L2 Benton skeleton (WP-03) · L3 missing · L4 blocked  
**Machine twin:** `data/field-plan/depth-layers.json`  
**WP-03:** [`WP03_BENTON_L2_GEOGRAPHIC_DEPTH.md`](./WP03_BENTON_L2_GEOGRAPHIC_DEPTH.md) · `data/field-plan/depth/l2-geographic-playbooks/benton.json`  
**Rule:** Do not invent doctrine or Benton organizing zones. Fill only from the campaign Field Plan / Victory Field Framework.

## Layers

| Layer | Name | Status | What it answers |
|-------|------|--------|-----------------|
| **L0** | Doctrine & altitude | Present | Why the campaign organizes this way |
| **L1** | Role narrative | Partial | What each mapped seat owns (state-wide playbook) |
| **L2** | Geographic playbooks | **Need ~+1 depth** | How Benton / Clark / cities adapt L1 |
| **L3** | Phase × place ops | **Need ~+1 depth** | Dated checklists, turf, shifts on a board |
| **L4** | Execution loop | **Need ~+1 depth · blocked** | Assign → evidence with durable RBAC |

L2–L4 are the “about three more levels” Steve asked for.

## Integration path (additive)

1. Upload/maintain L2 JSON under `data/field-plan/depth/l2-geographic-playbooks/{county}.json` with required fields from the twin.
2. Promote L3 packs per position×phase×scope; bind into Area Campaign Leader shell (`/leader/:id`) — still scaffolds until content lands.
3. Unlock L4 only after invite-chain WP-01 **CERTIFIED** + Postgres/RBAC — templates already frozen in V2-B.5. V2-B.5 does not prove leader activation.

## Related

- Mapping: `V2B2_POSITION_MAPPING.md`
- Responsibilities: `V2B3_RESPONSIBILITY_LIBRARY.md`
- KPIs: `V2B4_KPI_WIRING.md`
- Durability freeze: `V2B5_DURABILITY_PREP.md`
