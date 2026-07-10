# VOLUME 5 — Operations & Launch Bible

**Document ID:** VOLUME-005 · **OLB-001**  
**Artifact:** `OPERATIONS_LAUNCH_BIBLE.md`  
**Status:** Canonical · v1 Structure  
**Priority:** Critical — how the system is run in the real world  
**Live spec:** `data/registry/operations-launch-bible.json`

> Define **how communities launch, institutions onboard, counties activate, and the platform is operated** day to day.

**Governed by:** [Volume 0 Section S](MASTER_ARCHITECTURE_BIBLE.md) [MAB-S] · [GOS-001](GROWTH_OPERATING_SYSTEM_CERTIFICATION_NETWORK_READINESS.md)

---

## OLB-M01 — Purpose

**[OLB-M01]** Bridge from **architecture complete** to **communities live** — launch playbooks, moderation, backups, monitoring, incidents, releases, governance, documentation.

---

## Launch Progression [OLB-C01]

| Stage | Scope | Readiness level | Key doc |
|-------|-------|-----------------|---------|
| **Beta** | Single campus pilot | L1 Discoverable | WBS-001 |
| **Pilot** | Multi-community county | L2 Connected | CEF-001 |
| **Campus launch** | Institution-wide | L3 Active | IPS-001 |
| **County launch** | County-wide | L4 Thriving | CGO-001 |
| **Statewide launch** | Arkansas network | L5 Replicating | GOS-001 |
| **Self-expanding** | Network grows itself | L6 Ecosystem | NISS-001 |

**[OLB-C01a]** Each stage has: entry criteria · exit checklist · rollback procedure · success metrics.

---

## Community Launch Process [OLB-C02]

**[OLB-C02a]** **Community Foundry [CEF-001]:** Genome template → charter → leaders → welcome → first mission → public profile.

**[OLB-C02b]** **Launch checklist (minimum):**

1. Charter approved [CCN-001]
2. ≥2 leaders identified [CLD-001]
3. Welcome journey configured [WBS-001]
4. First mission designed [MDS-001]
5. Opportunity posted [OEX-001]
6. Public profile opt-in reviewed [PCN-001 · TPS-001]
7. Readiness assessment passed [GOS-001]

---

## Institution Onboarding [OLB-C03]

**[OLB-C03a]** Institution record verified [INST-001] · partnership mutual value documented [IPS-M14].

**[OLB-C03b]** Campus communities mapped · primary contact · student org pathways · alumni bridge [LCN-001].

---

## County Activation [OLB-C04]

**[OLB-C04a]** County node live [CNTY-001] · coordinator role assigned · cross-community calendar [SCN-001].

**[OLB-C04b]** Arkansas Coverage Map updated [CGO-M16].

---

## Moderator Workflows [OLB-C05]

| Task | Frequency | Tools |
|------|-----------|-------|
| Welcome review | Daily | WBS dashboard |
| Story consent queue | As needed | CST-001 |
| Trust reports | As needed | TPS-001 |
| Community health check | Weekly | CGS-001 · CIS-001 |
| Growth recommendations | Monthly | CGIS-001 |

**[OLB-C05a]** Moderators **serve communities** — not surveillance. Transparency with participants [CCN-001].

---

## Backups & Recovery [OLB-C06]

- Postgres: daily automated · point-in-time recovery · test restore monthly
- Storage: bucket versioning · cross-region copy for production
- Configuration: infrastructure as code in repo
- **RTO:** 4 hours · **RPO:** 1 hour (production)

---

## Monitoring & Incident Response [OLB-C07]

**[OLB-C07a]** **Monitor:** uptime · error rate · API latency · auth failures · RLS denials (anomaly).

**[OLB-C07b]** **Severity levels:** S1 (data breach/outage) · S2 (major feature down) · S3 (degraded) · S4 (minor).

**[OLB-C07c]** **Incident process:** detect → triage → communicate → fix → postmortem → BUILD-LOG entry.

---

## Versioning & Release [OLB-C08]

**[OLB-C08a]** Semantic versioning · changelog in BUILD-LOG · feature flags for risky releases.

**[OLB-C08b]** **Release train:** weekly minor · hotfix anytime for S1/S2.

**[OLB-C08c]** Community-facing release notes — plain language, not developer jargon.

---

## Governance & Documentation [OLB-C09]

**[OLB-C09a]** **Governance:** Platform constitution + community charters · dispute escalation path · annual charter review.

**[OLB-C09b]** **Documentation per feature [MAB-R]:** architecture · user guide · admin guide · developer guide · API docs.

**[OLB-C09c]** **Operational runbooks:** launch · incident · backup restore · database migration · AI prompt update.

---

## AC-081 — Acceptance Criteria

- [x] **[AC-081a]** Six launch stages mapped to readiness levels. `[OLB-C01]`
- [x] **[AC-081b]** Community, institution, county launch processes defined. `[OLB-C02–C04]`
- [x] **[AC-081c]** Moderator, backup, monitoring, release processes documented. `[OLB-C05–C08]`
- [x] **[AC-081d]** Governance and documentation standards linked. `[OLB-C09]`
- [ ] **[AC-081e]** Full runbook library (v1.1+).

---

**End of Volume 5 v1.**
