# Build Volume 2.9 — Configuration Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.9 · **DAB-010**  
**Artifact:** `CONFIGURATION_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [Digital Constitution Layer](../volume-01/DIGITAL_CONSTITUTION_LAYER.md) [DCL-001] · [2.1 Data Philosophy](DATA_PHILOSOPHY.md) [DAB-PH09]  
**Live spec:** `data/registry/configuration-model.json`

---

## DAB-CFG01 — Purpose

**[DAB-CFG01]** Defines **everything configurable** — roles, permissions templates, community types, mission templates, recognition, growth stages, workflows, notification settings — without code changes.

---

## DAB-CFG02 — Configuration Schema

**[DAB-CFG02a]** All config lives in `config` schema + DCL registry JSON [DCL-001].

**[DAB-CFG02b]** Pattern:

```text
config.config_entries (
  id, config_key, config_domain, value_json,
  scope_type, scope_id,      -- platform | community | institution
  version, effective_from, effective_to,
  created_by, created_at
)
```

---

## DAB-CFG03 — Roles & Permissions Templates

**[DAB-CFG03a]** `config.roles` — platform roles: `participant`, `organizer`, `moderator`, `admin`, `operator`.

**[DAB-CFG03b]** `config.community_role_templates` — per community type: default permissions matrix seed.

**[DAB-CFG03c]** Resolved at runtime by PRE [PRE-001] — config is input, not authority.

---

## DAB-CFG04 — Community Types & Templates

**[DAB-CFG04a]** `config.community_types`: campus, county, cohort, institution, alliance.

**[DAB-CFG04b]** `config.community_templates` — genome defaults [GOS-M10]: welcome workflow, mission templates, committee structure.

**[DAB-CFG04c]** Applied at community creation — overrides allowed per community.

---

## DAB-CFG05 — Mission & Workflow Templates

**[DAB-CFG05a]** `config.mission_templates` — canvas presets [MDS-001].

**[DAB-CFG05b]** `config.workflow_definitions` — state machine for approvals, onboarding, launch certification [CRCC-001].

**[DAB-CFG05c]** Steps reference service actions — not embedded business logic in JSON alone.

---

## DAB-CFG06 — Recognition & Growth Stages

**[DAB-CFG06a]** `config.recognition_badges` — criteria jsonb, icon ref, visibility.

**[DAB-CFG06b]** `config.growth_stages` — maps to [CGS-001]: thresholds, recommended actions.

---

## DAB-CFG07 — Notification Settings

**[DAB-CFG07a]** Platform defaults: category → channel → priority [AME-001].

**[DAB-CFG07b]** Participant overrides in `comms.notification_preferences` — not config schema (participant data).

**[DAB-CFG07c]** Community broadcast rules in config: digest schedule, quiet hours defaults.

---

## DAB-CFG08 — Feature Flags

**[DAB-CFG08a]** `config.feature_flags (key, enabled, scope, rollout_percentage, metadata)`.

**[DAB-CFG08b]** Aligns with [ENG-DTR07](../volume-01/DEPLOYMENT_TESTING_RELEASE_ARCHITECTURE.md).

---

## DAB-CFG09 — Config vs. DCL

**[DAB-CFG09a]** **DCL** — constitutional rules (principles, non-overridable constraints).

**[DAB-CFG09b]** **Config** — operational toggles and templates within DCL bounds.

**[DAB-CFG09c]** Config changes emit `config.updated` audit events.

---

## AC-115 — Acceptance Criteria

- [x] **[AC-115a]** Configuration schema and entry pattern documented. `[DAB-CFG02]`
- [x] **[AC-115b]** Roles, community types, templates, and workflows defined. `[DAB-CFG03–CFG05]`
- [x] **[AC-115c]** Recognition, notifications, feature flags, and DCL boundary established. `[DAB-CFG06–CFG09]`

---

**Next step:** [2.10 — Search Index Model](SEARCH_INDEX_MODEL.md) [DAB-011]

**End of Volume 2.9.**
