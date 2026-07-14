# V2-B.2 — Position Mapping

**Status:** Mapping registry generated · operator review of queues required  
**Preserves:** V2-A.3 hierarchy · enrollment-share campus goals · Blobs+seed · sensitive mutations disabled  
**Twin:** `data/field-plan/position-mapping-registry.json`  
**Rules:** `data/field-plan/position-mapping-rules.json`

## Questions every mapped position must answer

1. Where does this position sit?
2. Who supervises it?
3. What geography or institution does it serve?
4. What permissions will it eventually need?
5. Which dashboard owns its work?
6. What happens when the position is vacant?

## Policy

- Map Field Plan keys into **existing** Volunteer Command roles — do not invent parallel org charts.
- `media_lead` / `logistics_lead` stay **unmapped** (CIWS deferred) → review queue.
- Central activation list → **deferred_central** (other directorates), not forced under Volunteer Manager.
- Conflicts (e.g. shared function lanes) enter conflict queue — **never silent merge**.

## Commands

```bash
npm run field-plan:map-positions
npm run test:v2b2-position-mapping
```

## Next

**V2-B.3** Expandable responsibility library — see [`V2B3_RESPONSIBILITY_LIBRARY.md`](./V2B3_RESPONSIBILITY_LIBRARY.md).
