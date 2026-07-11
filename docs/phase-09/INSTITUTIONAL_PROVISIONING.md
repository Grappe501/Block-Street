# Institutional Provisioning — Build 9.1

**System ID:** PRV-001 · **AC-186** · Phase 9 Step 9.1

---

## Purpose

Institutional provisioning creates an organization's initial home inside the platform through one governed workflow — without manual undocumented setup.

---

## Provisioning Lifecycle

```text
requested → reviewed → approved → provisioning → configuration_required
→ data_readiness → pilot → launch_ready → active
```

Alternative states: `rejected`, `paused`, `restricted`, `suspended`, `archived`

---

## Provisioning Package

Each approved institution receives:

- Organization identity
- Initial administrative workspace
- Default roles and security baseline
- CMS space and initial dashboards
- Training environment and pilot workspace
- Support access and launch checklist

---

## APIs

- `GET /api/v1/launch/overview` — launch dashboard metrics
- `GET /api/v1/launch/provisionings` — list provisioning records
- `POST /api/v1/launch/provisionings` — request new institution
- `GET /api/v1/launch/provisionings/{id}` — provisioning detail
- `POST /api/v1/launch/provisionings/{id}/transition` — governed status change
- `GET /api/v1/launch/configuration-templates` — reusable institution templates
- `GET /api/admin/launch/overview` — administration dashboard
- `GET /api/admin/launch/provisionings` — admin provisioning list

---

## Data

- `data/launch/provisionings.json`
- `data/launch/configuration_templates.json`
- `data/launch/feature_flags.json`

**Platform standard:** `docs/platform/launch/INSTITUTION_PROVISIONING_STANDARD.md`

---

## Acceptance Criteria (AC-186)

- A new institution can be created through one governed workflow
- Required owners and administrators are assigned
- Default security and access policies are applied
- Initial workspaces and platform services are available
- Provisioning status is visible and auditable
- No organization depends on manual undocumented setup
