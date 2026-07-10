# Build Volume 2.11 — Analytics & Metrics Model

### Data Architecture Bible

**Document ID:** VOLUME-002.11 · **DAB-012**  
**Artifact:** `ANALYTICS_DATA_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [NISS-001](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) · Network Intelligence  
**Live spec:** `data/registry/analytics-data-model.json`

---

## DAB-ANL01 — Purpose

**[DAB-ANL01]** Defines KPIs, dashboards, rollups, Community Health, growth metrics, operational metrics, leadership metrics, and reporting snapshots — supporting **Network Intelligence**.

---

## DAB-ANL02 — Design Principles

**[DAB-ANL02a]** Analytics are **derived** — never canonical source of truth.

**[DAB-ANL02b]** Snapshots are **point-in-time** — reproducible from events + canonical tables.

**[DAB-ANL02c]** Privacy: aggregate by default; individual metrics require consent [TPS-001].

---

## DAB-ANL03 — Metric Definitions

**[DAB-ANL03a]** Table: `analytics.metric_definitions`:

```text
metric_definitions (
  id, metric_key, name, description,
  metric_domain,        -- growth | health | operational | leadership
  aggregation_type,     -- count | sum | avg | ratio | score
  formula_ref,          -- documentation link
  refresh_interval,
  visibility
)
```

---

## DAB-ANL04 — Metric Snapshots

**[DAB-ANL04a]** Table: `analytics.metric_snapshots`:

```text
metric_snapshots (
  id, metric_key, scope_type, scope_id,
  period_type,          -- daily | weekly | monthly | all_time
  period_start, period_end,
  value_numeric, value_json,
  computed_at, source_event_high_watermark
)
```

**[DAB-ANL04b]** Scopes: platform, network, county, community, mission.

---

## DAB-ANL05 — Community Health

**[DAB-ANL05a]** Composite score `community_health_score` — weighted components:

| Component | Weight | Source |
|-----------|--------|--------|
| Membership growth | 20% | member joins vs. target |
| Engagement | 25% | event participation, mission activity |
| Leadership coverage | 20% | leadership assignments complete |
| Knowledge freshness | 15% | recent stories/lessons |
| Response time | 10% | invitation acceptance rate |
| Sentiment (V1.1+) | 10% | optional survey |

**[DAB-ANL05b]** Stored in `analytics.community_health_scores`.

---

## DAB-ANL06 — Growth Metrics

**[DAB-ANL06]** Key metrics [GOS-M07 · CEF-001]:

- Active participants (30-day)
- New registrations (period)
- Invite conversion rate
- County coverage (% counties with active community)
- Institution coverage
- Mission completion rate

---

## DAB-ANL07 — Operational Metrics

**[DAB-ANL07]** Operator dashboard [ENG-DTR18 · CRCC-001]:

- API error rate, p95 latency
- Notification delivery success
- Index lag, graph sync lag
- Background job queue depth
- Migration status

---

## DAB-ANL08 — Leadership Metrics

**[DAB-ANL08a]** Per-community leadership dashboard:

- Missions owned vs. completed
- Team size and mentor ratio
- Volunteer hours (V1.1+)
- Story contributions

**[DAB-ANL08b]** Visible to leaders for **their scope** only [PRE-001].

---

## DAB-ANL09 — Reporting Snapshots

**[DAB-ANL09a]** Table: `analytics.report_snapshots` — frozen exports for board meetings, grants, launch reviews.

**[DAB-ANL09b]** Includes: JSON payload, PDF ref (media), generated_by, report_type.

---

## AC-117 — Acceptance Criteria

- [x] **[AC-117a]** Metric definitions and snapshot schema documented. `[DAB-ANL03, ANL04]`
- [x] **[AC-117b]** Community health and growth metrics defined. `[DAB-ANL05, ANL06]`
- [x] **[AC-117c]** Operational, leadership, and reporting models specified. `[DAB-ANL07–ANL09]`

---

**Next step:** [2.12 — AI Knowledge Model](AI_KNOWLEDGE_MODEL.md) [DAB-013]

**End of Volume 2.11.**
