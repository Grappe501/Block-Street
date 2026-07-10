# Build Volume 2.11 — Analytics & Metrics Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.11 · **DAB-012**  
**Artifact:** `ANALYTICS_DATA_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.6 Event Data Model](EVENT_DATA_MODEL.md) [DAB-007] · [2.5 Knowledge Graph](KNOWLEDGE_GRAPH_SCHEMA.md) [DAB-006] · [NISS-001](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) · [CRCC-001](../volume-01/COMMUNITY_READINESS_CERTIFICATION_CRITERIA.md)  
**Live spec:** `data/registry/analytics-data-model.json`

> Analytics are **not** the purpose of the platform. They are instruments that help communities understand how well they are serving people.

---

## Purpose

**[DAB-ANL01]** The Analytics & Metrics Data Model defines how the Community Operating System measures:

- Community health
- Participation
- Leadership development
- Knowledge growth
- Mission impact
- Long-term organizational effectiveness

**[DAB-ANL01a]** Every metric should help answer:

> **"How can we build stronger communities?"**

---

## Guiding Principle

**[DAB-ANL02]**

> **Measure what strengthens communities—not simply what is easy to count.**

**[DAB-ANL02a]** Metrics should encourage **healthy behavior** rather than vanity statistics.

---

## Philosophy

**[DAB-ANL03]** Traditional systems emphasize: Clicks · Views · Logins · Downloads

**[DAB-ANL03a]** The Community Operating System should emphasize:

Belonging · Participation · Leadership · Knowledge · Relationships · Community health · Volunteer impact · Long-term sustainability

**[DAB-ANL03b]** The platform should reward **meaningful engagement** rather than superficial activity [DAB-PH21].

**[DAB-ANL03c]** Analytics are **derived** — never canonical source of truth [DAB-SCH17a].

---

## Analytics Architecture

**[DAB-ANL04]** The analytics pipeline consists of six layers:

```text
Canonical Data
        ↓
Community Event Ledger
        ↓
Analytics Pipeline
        ↓
Metric Engine
        ↓
Dashboard Models
        ↓
Decision Support
```

**[DAB-ANL04a]** Each layer has **one responsibility** — metric definitions separate from dashboard presentation.

**[DAB-ANL04b]** Reproducible from events + canonical tables [DAB-EVT14].

---

## Canonical Sources

**[DAB-ANL05]** Analytics may derive from:

Participants · Communities · Missions · Events · Volunteer activity · Stories · Knowledge · Relationships · Partnerships · Calendar · Community Knowledge Graph · Digital Twins · Community Event Ledger

**[DAB-ANL05a]** Canonical data always remains **authoritative**.

---

## Metric Categories

**[DAB-ANL06]** Ten primary metric category groups.

### Community Health Metrics

**[DAB-ANL06a]** Measure: Active communities · Member participation · Leadership continuity · Knowledge growth · Mission completion · Community resilience

**[DAB-ANL06a1]** Community health becomes **observable** — not reduced to opaque scores alone [DAB-ANL20].

### Participation Metrics

**[DAB-ANL06b]** Measure: Volunteer hours · Event attendance · Mission participation · Committee involvement · Mentorship engagement · Returning volunteers

**[DAB-ANL06b1]** Participation should value **consistency over volume**.

### Leadership Metrics

**[DAB-ANL06c]** Measure: Leadership pipeline · New leaders developed · Mentorship completion · Leadership succession · Leadership diversity · Leadership retention

**[DAB-ANL06c1]** Leadership should **compound over time**.

### Growth Metrics

**[DAB-ANL06d]** Measure: Community launches · Invitation acceptance · Referral chains · Belonging milestones · Institution participation · County coverage

**[DAB-ANL06d1]** Growth should remain **healthy and sustainable** [GOS-M07 · CEF-001].

### Mission Metrics

**[DAB-ANL06e]** Measure: Mission completion · Milestone completion · Volunteer participation · Knowledge generated · Community impact · Mission reuse

**[DAB-ANL06e1]** Mission success extends **beyond task completion**.

### Knowledge Metrics

**[DAB-ANL06f]** Measure: Stories published · Lessons captured · Playbooks created · Knowledge reuse · Community Brain growth · Legacy preservation

**[DAB-ANL06f1]** Knowledge should **compound continuously** [CKLS-001].

### Partnership Metrics

**[DAB-ANL06g]** Measure: Active partnerships · Shared initiatives · Partner engagement · Community collaboration · Institution participation · Cross-county relationships

**[DAB-ANL06g1]** Partnerships become **measurable assets**.

### Capacity Metrics

**[DAB-ANL06h]** Measure: Skills available · Facilities · Equipment utilization · Transportation availability · Volunteer capacity · Community readiness

**[DAB-ANL06h1]** Capacity supports **planning**.

### Communication Metrics

**[DAB-ANL06i]** Measure: Announcement reach · Digest engagement · Notification effectiveness · Communication preferences · Community response · Attention health

**[DAB-ANL06i1]** Communication should respect **participant attention** [AME-001].

### Geographic Metrics

**[DAB-ANL06j]** Measure: County coverage · Institution coverage · Regional activity · Community density · Travel patterns · Service gaps

**[DAB-ANL06j1]** Maps become **measurable** [ADT-002].

---

## Metric Objects

**[DAB-ANL07]** Every metric includes:

| Field | Purpose |
|-------|---------|
| Canonical ID | Stable identifier |
| Metric Name | Human-readable name |
| Category | Domain grouping |
| Definition | What is measured |
| Calculation | Reproducible formula |
| Units | Measurement unit |
| Refresh Schedule | Update cadence |
| Owner | Metric steward |
| Visibility | Permission class |
| Confidence | Data quality signal |
| Source | Canonical source refs |
| Version | Definition version |

**[DAB-ANL07a]** Metrics become **governed data** — not ad hoc SQL.

---

## KPI Model

**[DAB-ANL08]** Key Performance Indicators should be limited to measures aligned with platform mission.

Examples: Communities launched · Volunteer retention · Leadership pipeline health · Knowledge growth · Mission completion · Community health · Institution participation

**[DAB-ANL08a]** KPIs should remain **understandable** — few, mission-aligned, explainable.

---

## Dashboard Objects

**[DAB-ANL09]** Dashboards are **derived views**.

Examples: Participant · Community · County · Institution · Leadership · State

**[DAB-ANL09a]** Dashboards should **answer questions** rather than simply display numbers.

**[DAB-ANL09b]** Separate metric definitions from dashboard presentation [DAB-ANL22].

---

## Time Series

**[DAB-ANL10]** Support:

Daily · Weekly · Monthly · Quarterly · Annual · Historical comparisons · Trend analysis

**[DAB-ANL10a]** **History matters more than snapshots** — time series preserved in Analytics schema [DAB-SCH17].

---

## Rollups

**[DAB-ANL11]** Metrics aggregate naturally:

```text
Participant
↓
Community
↓
Institution
↓
County
↓
Region
↓
State
```

**[DAB-ANL11a]** Rollups remain **explainable** — traceable to source events and entities.

---

## Benchmarking

**[DAB-ANL12]** Support comparisons:

Community vs Community · County vs County · Institution vs Institution · Historical comparison · Peer groups

**[DAB-ANL12a]** Benchmarking should encourage **learning, not competition**.

---

## Community Health Index

**[DAB-ANL13]** Composite indicator built from:

Participation · Leadership · Knowledge · Growth · Mission completion · Volunteer retention

**[DAB-ANL13a]** Community health should remain **transparent and explainable** — component breakdown required, not single unexplained number [DAB-ANL20].

---

## Data Freshness

**[DAB-ANL14]** Every metric records:

Last refreshed · Refresh frequency · Source data · Known limitations

**[DAB-ANL14a]** Participants should know **how current data is**.

---

## Explainability

**[DAB-ANL15]** Every metric should answer:

- What is being measured?
- How is it calculated?
- Where does the data originate?
- What assumptions exist?

**[DAB-ANL15a]** **Transparency builds trust** [CIF-001 · ENG-KG18].

---

## Privacy

**[DAB-ANL16]** Analytics respect:

Permissions · Visibility · Aggregation thresholds · Community boundaries

**[DAB-ANL16a]** Sensitive participant information should **never be exposed** through reporting [TPS-001 · DAB-SPM].

**[DAB-ANL16b]** Aggregate by default; individual metrics require consent.

---

## AI Integration

**[DAB-ANL17]** AI may:

- Summarize dashboards
- Identify trends
- Forecast growth
- Recommend improvements
- Highlight anomalies
- Generate executive reports

**[DAB-ANL17a]** AI **interprets analytics without redefining them** [DAB-PH10 · CIF-001].

---

## Community Health Observatory

**[DAB-ANL18]** **Major Architectural Recommendation:** Create a **Community Health Observatory** as the highest-level analytics capability.

**[DAB-ANL18a]** Rather than isolated charts, the Observatory continuously evaluates health of participants, communities, institutions, counties, and the statewide network.

**[DAB-ANL18b]** Signal domains:

| Domain | Signals |
|--------|---------|
| **Participation** | Volunteer engagement, event participation, mission involvement, committee activity |
| **Leadership** | Leadership pipeline, mentorship activity, succession readiness, leadership retention |
| **Knowledge** | Stories published, lessons captured, playbooks reused, Community Brain growth |
| **Growth** | New participants, community launches, referral networks, belonging milestones |
| **Capacity** | Skills, facilities, equipment, volunteer availability |
| **Partnership** | Institutional engagement, shared initiatives, cross-community collaboration |
| **Operational** | Mission completion, calendar activity, communication effectiveness, response times |

**[DAB-ANL18c]** The Observatory produces **explainable health assessments** rather than opaque scores.

Example — instead of "78 health score":

- Leadership continuity is strong
- Volunteer participation increased over the last three months
- Mentorship activity has declined
- Knowledge contributions are accelerating
- Partnership development has slowed
- Community engagement remains stable

**[DAB-ANL18d]** Analytics help people **strengthen communities through understanding**, not reduce human systems to unexplained numbers.

**[DAB-ANL18e]** Live spec: `data/registry/analytics-data-model.json` · `communityHealthObservatory`

---

## Operational Metrics (Platform)

**[DAB-ANL19]** Operator dashboard [ENG-DTR18 · CRCC-001] — separate from community-facing metrics:

API error rate · p95 latency · Notification delivery success · Index lag · Graph sync lag · Background job queue depth · Migration status

**[DAB-ANL19a]** Platform operational metrics support **reliability**, not community vanity stats.

---

## Reporting Snapshots

**[DAB-ANL20]** Frozen exports for board meetings, grants, launch reviews — reproducible point-in-time with source watermark [DAB-SCH17 Snapshot].

---

## Burt Implementation Guidance

**[DAB-ANL21]** Implementation should:

1. Derive metrics from **canonical operational data**
2. Keep calculations **reproducible**
3. Separate **metric definitions from dashboard presentation**
4. Build **explainability into every KPI**
5. Preserve **historical time series**
6. Keep analytics **permission-aware**
7. Consult Community Health Observatory spec before health features

**[DAB-ANL21a]** Logical home: Analytics schema [DAB-SCH17] — Snapshot · Aggregation · DashboardMetric · KPI · Rollup · HistoricalSummary · PerformanceIndicator.

---

## AC-117 — Acceptance Criteria

Volume 2.11 is complete when:

- [x] **[AC-117a]** Analytics philosophy is documented. `[DAB-ANL03]`
- [x] **[AC-117b]** Metric categories are established. `[DAB-ANL06]`
- [x] **[AC-117c]** KPI, dashboard, rollup, and benchmarking models are defined. `[DAB-ANL08–ANL12]`
- [x] **[AC-117d]** Explainability, privacy, and AI integration are incorporated. `[DAB-ANL15–ANL17]`
- [x] **[AC-117e]** Community Health Observatory specified. `[DAB-ANL18]`
- [x] **[AC-117f]** Burt has a complete blueprint for analytics across the COS. `[DAB-ANL21]`

---

**Next step:** [2.12 — AI Knowledge Model](AI_KNOWLEDGE_MODEL.md) [DAB-013]

**End of Volume 2.11.**
